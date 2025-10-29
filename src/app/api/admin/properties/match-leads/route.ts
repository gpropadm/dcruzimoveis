import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { propertyId } = body

    if (!propertyId) {
      return NextResponse.json(
        { error: 'ID do imóvel é obrigatório' },
        { status: 400 }
      )
    }

    // Buscar o imóvel cadastrado
    const property = await prisma.property.findUnique({
      where: { id: propertyId }
    })

    if (!property) {
      return NextResponse.json(
        { error: 'Imóvel não encontrado' },
        { status: 404 }
      )
    }

    console.log('🔍 Iniciando matching para imóvel:', {
      id: property.id,
      title: property.title,
      price: property.price,
      type: property.type,
      category: property.category,
      city: property.city
    })

    // Buscar leads que podem ter interesse neste imóvel
    const potentialLeads = await prisma.lead.findMany({
      where: {
        AND: [
          { enableMatching: true },
          { phone: { not: null } }, // Só leads com WhatsApp
          { status: { in: ['novo', 'interessado', 'perdido', 'contatado'] } }, // Só leads ativos
          {
            OR: [
              // Matching por tipo (venda/aluguel)
              { preferredType: property.type },
              { propertyType: property.type },
              { AND: [{ preferredType: null }, { propertyType: null }] }
            ]
          },
          {
            OR: [
              // Matching por categoria
              { preferredCategory: property.category },
              { preferredCategory: null }
            ]
          },
          {
            OR: [
              // Matching por cidade
              { preferredCity: property.city },
              { preferredCity: null }
            ]
          }
        ]
      }
    })

    console.log(`🎯 Encontrados ${potentialLeads.length} leads potenciais`)

    const matchingLeads = []
    const whatsappResults = []

    for (const lead of potentialLeads) {
      let matchScore = 0
      const matchReasons = []

      // Verificar compatibilidade de preço
      const priceMatch = checkPriceMatch(lead, property)
      if (priceMatch.matches) {
        matchScore += 30
        matchReasons.push(priceMatch.reason)
      }

      // Verificar categoria
      if (lead.preferredCategory === property.category) {
        matchScore += 25
        matchReasons.push(`Categoria: ${property.category}`)
      }

      // Verificar cidade
      if (lead.preferredCity === property.city) {
        matchScore += 20
        matchReasons.push(`Cidade: ${property.city}`)
      }

      // Verificar quartos
      if (lead.preferredBedrooms && property.bedrooms &&
          Math.abs(lead.preferredBedrooms - property.bedrooms) <= 1) {
        matchScore += 15
        matchReasons.push(`Quartos: ${property.bedrooms}`)
      }

      // Verificar banheiros
      if (lead.preferredBathrooms && property.bathrooms &&
          Math.abs(lead.preferredBathrooms - property.bathrooms) <= 1) {
        matchScore += 10
        matchReasons.push(`Banheiros: ${property.bathrooms}`)
      }

      // Se score >= 50, é um match válido
      if (matchScore >= 50) {
        matchingLeads.push({
          lead,
          matchScore,
          matchReasons
        })

        // Enviar WhatsApp para este lead
        const whatsappResult = await sendPropertyWhatsApp(lead, property, matchReasons)
        whatsappResults.push(whatsappResult)
      }
    }

    console.log(`✅ ${matchingLeads.length} matches encontrados e WhatsApps enviados`)

    return NextResponse.json({
      success: true,
      property: {
        id: property.id,
        title: property.title
      },
      matches: matchingLeads.length,
      whatsappSent: whatsappResults.filter(r => r.success).length,
      details: matchingLeads.map(m => ({
        leadName: m.lead.name,
        leadPhone: m.lead.phone,
        matchScore: m.matchScore,
        matchReasons: m.matchReasons
      }))
    })

  } catch (error) {
    console.error('Erro no matching de leads:', error)
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    )
  }
}

function checkPriceMatch(lead: any, property: any) {
  const propertyPrice = property.price

  // Se o lead tem faixa de preço definida
  if (lead.preferredPriceMin && lead.preferredPriceMax) {
    const min = lead.preferredPriceMin
    const max = lead.preferredPriceMax

    console.log(`🔍 Verificando preço: ${propertyPrice} vs faixa ${min}-${max}`)

    if (propertyPrice >= min && propertyPrice <= max) {
      return {
        matches: true,
        reason: `Preço na faixa: R$ ${propertyPrice.toLocaleString('pt-BR')}`
      }
    } else {
      console.log(`❌ Preço fora da faixa: ${propertyPrice} não está entre ${min}-${max}`)
    }
  }

  // Se o lead demonstrou interesse em um imóvel similar (±20%)
  if (lead.propertyPrice) {
    const tolerance = lead.propertyPrice * 0.2 // 20% de tolerância
    const minPrice = lead.propertyPrice - tolerance
    const maxPrice = lead.propertyPrice + tolerance

    if (propertyPrice >= minPrice && propertyPrice <= maxPrice) {
      return {
        matches: true,
        reason: `Preço similar ao interesse anterior (±20%)`
      }
    }
  }

  return { matches: false, reason: 'Preço incompatível' }
}

function normalizePhoneNumber(phone: string): string {
  // Remove todos os caracteres não numéricos
  const cleanPhone = phone.replace(/\D/g, '')

  // Se já tem 13 dígitos (55 + DDD + número), retorna como está
  if (cleanPhone.length === 13 && cleanPhone.startsWith('55')) {
    return cleanPhone
  }

  // Se tem 11 dígitos (DDD + número), adiciona 55
  if (cleanPhone.length === 11) {
    return '55' + cleanPhone
  }

  // Se tem 10 dígitos (DDD sem 9 + número), adiciona 55 e 9
  if (cleanPhone.length === 10) {
    return '55' + cleanPhone.substring(0, 2) + '9' + cleanPhone.substring(2)
  }

  // Outros casos, retorna como está
  return cleanPhone
}

async function sendPropertyWhatsApp(lead: any, property: any, matchReasons: string[]) {
  try {
    const instanceId = process.env.ULTRAMSG_INSTANCE_ID
    const token = process.env.ULTRAMSG_TOKEN

    if (!instanceId || !token) {
      throw new Error('UltraMsg não configurado')
    }

    const propertyUrl = `${process.env.NEXTAUTH_URL}/imovel/${property.slug}`
    const optOutUrl = `${process.env.NEXTAUTH_URL}/opt-out/${lead.id}`

    // Buscar foto principal do imóvel
    let propertyImage = null
    if (property.images) {
      try {
        const images = JSON.parse(property.images)
        if (Array.isArray(images) && images.length > 0) {
          propertyImage = images[0] // Primeira imagem (principal)
        }
      } catch (error) {
        console.log('⚠️ Erro ao parse images:', error)
      }
    }

    const whatsappMessage = `*NOVA OPORTUNIDADE PARA VOCÊ*

Olá *${lead.name}*!

Encontramos um imóvel que pode te interessar:

*${property.title}*
*Preço:* R$ ${property.price.toLocaleString('pt-BR')}
*Local:* ${property.city}, ${property.state}
*Categoria:* ${property.category}
${property.bedrooms ? `*Quartos:* ${property.bedrooms}` : ''}
${property.bathrooms ? `*Banheiros:* ${property.bathrooms}` : ''}
${property.area ? `*Área:* ${property.area}m²` : ''}

*Por que este imóvel é perfeito para você:*
${matchReasons.map(reason => `✅ ${reason}`).join('\n')}

*Ver detalhes:* ${propertyUrl}

*Quer agendar uma visita?*
Responda esta mensagem ou ligue para nós!

---
Para não receber mais sugestões: ${optOutUrl}

DCruz Imóveis`

    const normalizedPhone = normalizePhoneNumber(lead.phone)
    console.log(`📱 Enviando WhatsApp para ${lead.name}:`, {
      original: lead.phone,
      normalizado: normalizedPhone,
      comImagem: !!propertyImage
    })

    let response

    // Enviar com imagem se disponível
    if (propertyImage) {
      console.log('📸 Enviando com foto do imóvel:', propertyImage)

      const mediaUrl = `https://api.ultramsg.com/${instanceId}/messages/image`
      const mediaPayload = {
        token: token,
        to: normalizedPhone,
        image: propertyImage,
        caption: whatsappMessage,
        priority: 'high'
      }

      response = await fetch(mediaUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(mediaPayload)
      })
    } else {
      console.log('📝 Enviando sem imagem (só texto)')

      const textUrl = `https://api.ultramsg.com/${instanceId}/messages/chat`
      const textPayload = {
        token: token,
        to: normalizedPhone,
        body: whatsappMessage,
        priority: 'high'
      }

      response = await fetch(textUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(textPayload)
      })
    }

    const responseData = await response.json()

    if (response.ok && responseData.sent) {
      console.log(`✅ WhatsApp enviado para ${lead.name} (${lead.phone})`)

      // Salvar mensagem no banco
      await prisma.whatsAppMessage.create({
        data: {
          messageId: String(responseData.id) || `match-${Date.now()}`,
          from: instanceId,
          to: normalizedPhone,
          body: whatsappMessage,
          type: 'text',
          timestamp: new Date(),
          fromMe: true,
          status: 'sent',
          source: 'property_matching',
          contactName: lead.name,
          propertyId: property.id
        }
      })

      // Atualizar status do lead
      await prisma.lead.update({
        where: { id: lead.id },
        data: {
          agentProcessed: true,
          agentStatus: 'whatsapp_sent',
          agentProcessedAt: new Date(),
          status: 'contatado'
        }
      })

      return {
        success: true,
        leadName: lead.name,
        leadPhone: lead.phone,
        messageId: responseData.id
      }

    } else {
      console.error(`❌ Falha ao enviar WhatsApp para ${lead.name}:`, responseData)
      return {
        success: false,
        leadName: lead.name,
        leadPhone: lead.phone,
        error: responseData
      }
    }

  } catch (error) {
    console.error(`⚠️ Erro ao enviar WhatsApp para ${lead.name}:`, error)
    return {
      success: false,
      leadName: lead.name,
      leadPhone: lead.phone,
      error: error instanceof Error ? error.message : 'Unknown error'
    }
  }
}