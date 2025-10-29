import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '@/lib/auth'
import prisma from '@/lib/prisma'
import { geocodeCEPWithCache } from '@/lib/geocoding'
import { sendWhatsAppMessage } from '@/lib/whatsapp-twilio'

// GET - Buscar imóvel específico
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session) {
      return NextResponse.json({ error: 'Não autorizado' }, { status: 401 })
    }

    const { id } = await params
    const property = await prisma.property.findUnique({
      where: { id }
    })

    if (!property) {
      return NextResponse.json({ error: 'Imóvel não encontrado' }, { status: 404 })
    }


    return NextResponse.json(property)
  } catch (error) {
    console.error('Erro ao buscar imóvel:', error)
    return NextResponse.json({ error: 'Erro interno do servidor' }, { status: 500 })
  }
}

// PUT - Atualizar imóvel
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session) {
      return NextResponse.json({ error: 'Não autorizado' }, { status: 401 })
    }

    const body = await request.json()

    console.log('🔍 EDIT - Dados recebidos do frontend:')
    console.log('   Latitude:', body.latitude, 'Tipo:', typeof body.latitude)
    console.log('   Longitude:', body.longitude, 'Tipo:', typeof body.longitude)
    console.log('   CEP:', body.cep)

    const {
      title,
      seoTitle,
      description,
      seoDescription,
      cep,
      address,
      city,
      state,
      price,
      type,
      category,
      bedrooms,
      bathrooms,
      parking,
      area,
      video,
      featured,
      images,
      // Coordenadas GPS
      latitude,
      longitude,
      gpsAccuracy,
      // Campos específicos para apartamentos
      apartmentTotalArea,
      apartmentUsefulArea,
      suites,
      iptu,
      // Campos específicos para fazenda
      totalArea,
      cultivatedArea,
      pastures,
      areaUnit,
      buildings,
      waterSources,
      // Campos específicos para apartamento
      floor,
      condoFee,
      amenities,
      // Campos específicos para terreno
      zoning,
      slope,
      frontage,
      // Campos específicos para casa
      houseType,
      yard,
      garage,
      // Campos específicos para comercial
      commercialType,
      floor_commercial,
      businessCenter,
      features,
      // Formas de pagamento
      acceptsFinancing,
      acceptsTrade,
      acceptsCar
    } = body


    // Verificar se o imóvel existe
    const { id } = await params
    const existingProperty = await prisma.property.findUnique({
      where: { id }
    })

    if (!existingProperty) {
      return NextResponse.json({ error: 'Imóvel não encontrado' }, { status: 404 })
    }

    // Função para normalizar texto para URL (remove acentos, caracteres especiais, etc)
    const normalizeForUrl = (text: string) => {
      return text
        .toLowerCase()
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '') // Remove acentos
        .replace(/[^a-z0-9\s-]/g, '') // Remove caracteres especiais
        .replace(/\s+/g, '-') // Substitui espaços por hífens
        .replace(/-+/g, '-') // Remove hífens duplos
        .trim()
    }

    // Gerar novo slug se o título mudou
    let slug = existingProperty.slug
    if (title !== existingProperty.title) {
      slug = normalizeForUrl(title)

      // Verificar se o slug já existe
      const existingSlug = await prisma.property.findFirst({
        where: {
          slug,
          id: { not: id }
        }
      })

      if (existingSlug) {
        slug = `${slug}-${Date.now()}`
      }
    }

    // 🗺️ GEOCODING AUTOMÁTICO: Só sobrescreve se usuário NÃO forneceu coordenadas manuais
    let finalLatitude = latitude
    let finalLongitude = longitude
    let autoGeocoded = false

    // Verificar se o usuário forneceu coordenadas manuais explicitamente
    const hasManualCoordinates = latitude !== undefined && longitude !== undefined && latitude !== null && longitude !== null
    const cepChanged = cep !== existingProperty.cep
    const noCoordinates = !existingProperty.latitude && !existingProperty.longitude

    // Só faz geocoding automático se:
    // 1. Usuário NÃO forneceu coordenadas manuais E
    // 2. (CEP mudou OU não há coordenadas no banco)
    if (cep && !hasManualCoordinates && (cepChanged || noCoordinates)) {
      console.log('🔍 INICIANDO geocoding automático do CEP (EDIT):', cep)
      console.log('📍 CEP mudou:', cepChanged, '| Sem coordenadas:', noCoordinates)
      console.log('📍 CEP anterior:', existingProperty.cep, '| CEP novo:', cep)

      try {
        console.log('📞 Chamando geocodeCEPWithCache (EDIT)...')
        const geocodingResult = await geocodeCEPWithCache(cep)
        console.log('📋 Resultado do geocoding (EDIT):', JSON.stringify(geocodingResult, null, 2))

        if (geocodingResult?.coordinates) {
          finalLatitude = geocodingResult.coordinates.latitude
          finalLongitude = geocodingResult.coordinates.longitude
          autoGeocoded = true

          console.log('✅ GEOCODING REALIZADO COM SUCESSO (EDIT):', {
            cep,
            coordinates: geocodingResult.coordinates,
            address: geocodingResult.address,
            finalLatitude,
            finalLongitude
          })
        } else {
          console.log('❌ GEOCODING FALHOU (EDIT) - resultado null para CEP:', cep)
        }
      } catch (geocodingError) {
        console.error('❌ ERRO CRÍTICO no geocoding (EDIT):', geocodingError)
        console.error('Stack trace (EDIT):', (geocodingError as Error).stack)
        // Continua sem coordenadas se houver erro
      }
    } else {
      if (hasManualCoordinates) {
        console.log('✅ Usando coordenadas manuais fornecidas - Lat:', latitude, 'Lng:', longitude)
      } else {
        console.log('⚠️ Pulando geocoding (EDIT) - CEP:', cep, 'CEP mudou:', cepChanged, 'Sem coordenadas:', noCoordinates)
      }
    }

    // 💰 Verificar se houve redução de preço para enviar alertas
    const currentPrice = existingProperty.price
    const newPrice = typeof price === 'string' ? parseFloat(price) : price
    const isPriceReduction = newPrice < currentPrice

    console.log('💰 Verificação de preço:')
    console.log('  - Preço atual:', currentPrice)
    console.log('  - Novo preço:', newPrice)
    console.log('  - É redução?:', isPriceReduction)

    const updatedProperty = await prisma.property.update({
      where: { id },
      data: {
        title,
        seoTitle: seoTitle || null,
        description,
        seoDescription: seoDescription || null,
        cep: cep || null,
        address,
        city,
        state,
        price: newPrice,
        previousPrice: isPriceReduction ? currentPrice : existingProperty.previousPrice,
        priceReduced: isPriceReduction,
        priceReducedAt: isPriceReduction ? new Date() : existingProperty.priceReducedAt,
        type,
        category,
        bedrooms: bedrooms || null,
        bathrooms: bathrooms || null,
        parking: parking || null,
        area: area || null,
        video,
        featured,
        images,
        slug,
        // Coordenadas GPS (podem ter sido geocodificadas automaticamente)
        latitude: finalLatitude || null,
        longitude: finalLongitude || null,
        gpsAccuracy: gpsAccuracy || null,
        // Campos específicos para apartamentos
        apartmentTotalArea: apartmentTotalArea || null,
        apartmentUsefulArea: apartmentUsefulArea || null,
        suites: suites || null,
        iptu: iptu || null,
        // Campos específicos para fazenda
        totalArea: totalArea || null,
        cultivatedArea: cultivatedArea || null,
        pastures: pastures || null,
        areaUnit,
        buildings,
        waterSources,
        // Campos específicos para apartamento
        floor: floor || null,
        condoFee: condoFee || null,
        amenities,
        // Campos específicos para terreno
        zoning,
        slope,
        frontage: frontage || null,
        // Campos específicos para casa
        houseType,
        yard,
        garage,
        // Campos específicos para comercial
        commercialType,
        floor_commercial: floor_commercial || null,
        businessCenter,
        features,
        // Formas de pagamento
        acceptsFinancing: acceptsFinancing || false,
        acceptsTrade: acceptsTrade || false,
        acceptsCar: acceptsCar || false
      }
    })

    // 📢 Se houve redução de preço, enviar alertas via WhatsApp
    console.log('🔔 ========== VERIFICANDO ALERTAS DE PREÇO ==========')
    console.log(`  Property ID: ${id}`)
    console.log(`  isPriceReduction: ${isPriceReduction}`)
    console.log(`  currentPrice: ${currentPrice}`)
    console.log(`  newPrice: ${newPrice}`)

    if (isPriceReduction) {
      console.log(`💰 ✅ PREÇO REDUZIDO DETECTADO! De R$ ${currentPrice} para R$ ${newPrice}`)

      try {
        console.log(`🔍 Buscando alertas ativos para propertyId: ${id}`)

        const priceAlerts = await prisma.priceAlert.findMany({
          where: {
            propertyId: id,
            active: true
          }
        })

        console.log(`📱 RESULTADO: ${priceAlerts.length} alertas encontrados`)
        if (priceAlerts.length > 0) {
          console.log('📋 Alertas:', JSON.stringify(priceAlerts.map(a => ({
            name: a.name,
            phone: a.phone,
            active: a.active
          })), null, 2))
        }

        // Buscar imagem do imóvel
        let propertyImage = null
        if (images) {
          try {
            const parsedImages = JSON.parse(images)
            if (Array.isArray(parsedImages) && parsedImages.length > 0) {
              propertyImage = parsedImages[0]
              console.log('📷 Imagem do imóvel encontrada:', propertyImage)
            }
          } catch (err) {
            console.log('⚠️ Erro ao parsear imagens:', err)
          }
        }

        // Enviar WhatsApp para cada pessoa que cadastrou alerta
        for (const alert of priceAlerts) {
          try {
            const oldPriceFormatted = new Intl.NumberFormat('pt-BR', {
              style: 'currency',
              currency: 'BRL',
              minimumFractionDigits: 0
            }).format(currentPrice)

            const newPriceFormatted = new Intl.NumberFormat('pt-BR', {
              style: 'currency',
              currency: 'BRL',
              minimumFractionDigits: 0
            }).format(newPrice)

            const savings = currentPrice - newPrice
            const savingsFormatted = new Intl.NumberFormat('pt-BR', {
              style: 'currency',
              currency: 'BRL',
              minimumFractionDigits: 0
            }).format(savings)

            // Enviar para o ADMIN (não para o cliente)
            const phoneAdmin = process.env.WHATSAPP_ADMIN_PHONE || '5561996900444'

            const message = `🏡 *ALERTA: PREÇO REDUZIDO!*

🔔 Cliente interessado: ${alert.name}
📱 Telefone: ${alert.phone}

📍 Imóvel: *${title}*

💸 Preço anterior: ~${oldPriceFormatted}~
✅ *Novo preço: ${newPriceFormatted}*
💰 *Economia: ${savingsFormatted}*

⚠️ Entre em contato com ${alert.name} no ${alert.phone} para avisar sobre a redução!

Ver detalhes: ${process.env.NEXT_PUBLIC_SITE_URL || 'https://imobiliaria-six-tau.vercel.app'}/imovel/${updatedProperty.slug}`

            // Enviar com imagem se disponível
            console.log(`📞 Tentando enviar WhatsApp ADMIN para ${phoneAdmin}`)
            console.log(`   Cliente interessado: ${alert.name} (${alert.phone})`)
            console.log(`   Mensagem: ${message.substring(0, 100)}...`)
            console.log(`   Tem imagem: ${!!propertyImage}`)

            const sent = await sendWhatsAppMessage(phoneAdmin, message, propertyImage || undefined)

            if (sent) {
              console.log(`✅✅✅ SUCESSO! Alerta enviado para ADMIN ${phoneAdmin}`)
            } else {
              console.log(`❌❌❌ FALHA! Não enviou para ADMIN ${phoneAdmin}`)
            }
          } catch (err) {
            console.error(`Erro ao enviar alerta para ${alert.phone}:`, err)
          }
        }
      } catch (err) {
        console.error('❌ Erro ao processar alertas de preço:', err)
      }
    } else {
      console.log(`⚠️ NÃO É REDUÇÃO DE PREÇO - Não enviará alertas`)
      console.log(`   Motivo: newPrice (${newPrice}) >= currentPrice (${currentPrice})`)
    }
    console.log('🔔 ========== FIM VERIFICAÇÃO ALERTAS ==========')

    return NextResponse.json(updatedProperty)
  } catch (error) {
    console.error('Erro ao atualizar imóvel:', error)
    return NextResponse.json({ error: 'Erro interno do servidor' }, { status: 500 })
  }
}

// PATCH - Atualizar campos específicos
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions)

    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { id } = await params
    const body = await request.json()

    // Campos que podem ser atualizados via PATCH
    const allowedFields = ['status', 'featured']
    const updateData: any = {}

    for (const field of allowedFields) {
      if (field in body) {
        updateData[field] = body[field]
      }
    }

    if (Object.keys(updateData).length === 0) {
      return NextResponse.json(
        { error: 'Nenhum campo válido para atualizar' },
        { status: 400 }
      )
    }

    const updatedProperty = await prisma.property.update({
      where: { id },
      data: updateData
    })

    return NextResponse.json({
      success: true,
      property: updatedProperty
    })

  } catch (error) {
    console.error('Erro ao atualizar propriedade:', error)
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    )
  }
}

// DELETE - Excluir imóvel
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions)

    if (!session) {
      return NextResponse.json({ error: 'Não autorizado' }, { status: 401 })
    }

    // Verificar se o imóvel existe
    const { id } = await params
    const existingProperty = await prisma.property.findUnique({
      where: { id }
    })

    if (!existingProperty) {
      return NextResponse.json({ error: 'Imóvel não encontrado' }, { status: 404 })
    }

    await prisma.property.delete({
      where: { id }
    })

    return NextResponse.json({ message: 'Imóvel excluído com sucesso' })
  } catch (error) {
    console.error('Erro ao excluir imóvel:', error)
    return NextResponse.json({ error: 'Erro interno do servidor' }, { status: 500 })
  }
}