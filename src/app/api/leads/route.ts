import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { sendWhatsAppMessage } from '@/lib/whatsapp-twilio'

export async function POST(request: NextRequest) {
  try {
    console.log('📧 [API Leads] Recebendo dados...')

    const body = await request.json()
    console.log('📧 [API Leads] Dados recebidos:', {
      name: body.name,
      email: body.email,
      phone: body.phone,
      propertyId: body.propertyId,
      hasMessage: !!body.message
    })

    const { name, email, phone, message, propertyId, propertyTitle, propertyPrice, propertyType, source, preferredCategory, preferredType, preferredCity, preferredState, preferredPriceMin, preferredPriceMax, enableMatching } = body

    // Validação básica
    if (!name || name.trim() === '') {
      console.log('❌ [API Leads] Nome obrigatório')
      return NextResponse.json(
        { error: 'Nome é obrigatório' },
        { status: 400 }
      )
    }

    // Se há interesse em um imóvel específico, extrair preferências
    let preferredData = {}
    if (propertyId) {
      try {
        const property = await prisma.property.findUnique({
          where: { id: propertyId }
        })

        if (property) {
          // Definir faixa de preço baseada no imóvel de interesse (±20%)
          const priceVariation = property.price * 0.2
          preferredData = {
            preferredPriceMin: Math.max(0, property.price - priceVariation),
            preferredPriceMax: property.price + priceVariation,
            preferredCategory: property.category,
            preferredCity: property.city,
            preferredState: property.state,
            preferredBedrooms: property.bedrooms,
            preferredBathrooms: property.bathrooms,
            preferredType: property.type,
            enableMatching: true
          }

          console.log('🎯 Preferências extraídas do imóvel de interesse:', preferredData)
        }
      } catch (error) {
        console.error('Erro ao extrair preferências do imóvel:', error)
      }
    }

    // Criar lead no banco
    const lead = await prisma.lead.create({
      data: {
        name: name.trim(),
        email: email?.trim() || null,
        phone: phone?.trim() || null,
        message: message?.trim() || null,
        propertyId: propertyId || null,
        propertyTitle: propertyTitle || null,
        propertyPrice: propertyPrice || null,
        propertyType: propertyType || null,
        source: source || 'site',
        status: 'novo',
        ...preferredData,
        // Se vier preferências diretas do body, sobrescrever
        ...(preferredCategory && { preferredCategory }),
        ...(preferredType && { preferredType }),
        ...(preferredCity && { preferredCity }),
        ...(preferredState && { preferredState }),
        ...(preferredPriceMin && { preferredPriceMin }),
        ...(preferredPriceMax && { preferredPriceMax }),
        ...(enableMatching !== undefined && { enableMatching })
      }
    })

    console.log('✅ [API Leads] Lead criado com sucesso:', {
      id: lead.id,
      nome: lead.name,
      imovel: lead.propertyTitle,
      email: lead.email,
      preferenciasExtraidas: Object.keys(preferredData).length > 0
    })

    // Enviar notificação via WhatsApp usando Twilio
    try {
      const phoneAdmin = process.env.WHATSAPP_ADMIN_PHONE || '5561996900444'

      // Buscar imagem do imóvel
      let propertyImage = null
      if (propertyId) {
        try {
          const property = await prisma.property.findUnique({
            where: { id: propertyId },
            select: { images: true }
          })

          if (property && property.images) {
            const images = JSON.parse(property.images)
            if (Array.isArray(images) && images.length > 0) {
              propertyImage = images[0] // Primeira imagem
              console.log('📷 Imagem do imóvel encontrada:', propertyImage)
            }
          }
        } catch (error) {
          console.log('⚠️ Erro ao buscar imagem:', error)
        }
      }

      // Mensagem mais natural
      const clientMessage = lead.message || `Tenho interesse no imóvel "${lead.propertyTitle}". Gostaria de mais informações.`

      const whatsappMessage = `🔔 NOVO LEAD INTERESSADO

👤 Cliente: ${lead.name}
📱 WhatsApp: ${lead.phone || 'Não informado'}
📧 Email: ${lead.email || 'Não informado'}

🏠 Imóvel: ${lead.propertyTitle || 'Não informado'}
💰 Valor: ${lead.propertyPrice ? `R$ ${lead.propertyPrice.toLocaleString('pt-BR')}` : 'Não informado'}

💬 Mensagem:
"${clientMessage}"

📅 Recebido: ${new Date().toLocaleString('pt-BR')}
🆔 Lead ID: ${lead.id}`

      // 1. Enviar notificação para o admin
      const sentToAdmin = await sendWhatsAppMessage(phoneAdmin, whatsappMessage, propertyImage || undefined)

      if (sentToAdmin) {
        console.log('✅ WhatsApp enviado para admin via Twilio')

        await prisma.whatsAppMessage.create({
          data: {
            messageId: `lead-admin-${Date.now()}`,
            from: 'twilio',
            to: phoneAdmin,
            body: whatsappMessage,
            type: 'text',
            timestamp: new Date(),
            fromMe: true,
            status: 'sent',
            source: 'lead_notification',
            contactName: lead.name,
            propertyId: lead.propertyId
          }
        })
      } else {
        console.log('⚠️ Falha ao enviar WhatsApp para admin')
      }

      // 2. Enviar confirmação para o cliente (se tiver telefone)
      if (lead.phone) {
        const settings = await prisma.settings.findFirst()
        const siteName = settings?.siteName || 'BS Imóveis DF'
        const sitePhone = settings?.whatsappNumber || phoneAdmin

        const clientConfirmation = `✅ Olá ${lead.name}!

Recebemos seu interesse no imóvel:
🏠 ${lead.propertyTitle || 'Imóvel selecionado'}

Em breve entraremos em contato para fornecer mais informações e agendar uma visita!

📱 WhatsApp: ${sitePhone}

${siteName}
Obrigado pelo contato! 😊`

        const sentToClient = await sendWhatsAppMessage(lead.phone, clientConfirmation)

        if (sentToClient) {
          console.log('✅ Confirmação enviada para cliente')

          await prisma.whatsAppMessage.create({
            data: {
              messageId: `lead-client-${Date.now()}`,
              from: 'twilio',
              to: lead.phone,
              body: clientConfirmation,
              type: 'text',
              timestamp: new Date(),
              fromMe: true,
              status: 'sent',
              source: 'lead_confirmation',
              contactName: lead.name,
              propertyId: lead.propertyId
            }
          })
        } else {
          console.log('⚠️ Falha ao enviar confirmação para cliente')
        }
      }

    } catch (whatsappError) {
      console.error('⚠️ Erro ao enviar notificação WhatsApp:', whatsappError)
      // Não falha o lead se o WhatsApp falhar
    }

    return NextResponse.json(
      {
        success: true,
        message: 'Lead cadastrado com sucesso!',
        leadId: lead.id
      },
      { status: 201 }
    )

  } catch (error) {
    console.error('❌ [API Leads] Erro ao criar lead:', error)
    console.error('❌ [API Leads] Stack:', error instanceof Error ? error.stack : 'N/A')
    return NextResponse.json(
      {
        error: 'Erro interno do servidor',
        details: error instanceof Error ? error.message : 'Erro desconhecido'
      },
      { status: 500 }
    )
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '10')
    const status = searchParams.get('status')
    const search = searchParams.get('search')

    const skip = (page - 1) * limit

    // Construir filtros
    const where: Record<string, unknown> = {}
    
    if (status && status !== 'all') {
      where.status = status
    }

    if (search) {
      where.OR = [
        { name: { contains: search } },
        { email: { contains: search } },
        { phone: { contains: search } },
        { propertyTitle: { contains: search } }
      ]
    }

    // Buscar leads com paginação
    const [leads, total] = await Promise.all([
      prisma.lead.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
        include: {
          property: {
            select: {
              id: true,
              title: true,
              slug: true,
              type: true,
              price: true,
              images: true
            }
          }
        }
      }),
      prisma.lead.count({ where })
    ])

    // Para cada lead, verificar se há mensagens WhatsApp relacionadas
    const leadsWithWhatsAppStatus = await Promise.all(
      leads.map(async (lead) => {
        if (!lead.phone) return { ...lead, hasWhatsAppMessage: false }

        // Verificar se existe mensagem WhatsApp para este lead
        const whatsappMessage = await prisma.whatsAppMessage.findFirst({
          where: {
            OR: [
              { contactName: { contains: lead.name } },
              {
                AND: [
                  { body: { contains: lead.name } },
                  { fromMe: true }
                ]
              }
            ]
          },
          orderBy: { createdAt: 'desc' }
        })

        return {
          ...lead,
          hasWhatsAppMessage: !!whatsappMessage,
          whatsAppMessageDate: whatsappMessage?.createdAt || null
        }
      })
    )

    return NextResponse.json({
      leads: leadsWithWhatsAppStatus,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      }
    })

  } catch (error) {
    console.error('Erro ao buscar leads:', error)
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    )
  }
}