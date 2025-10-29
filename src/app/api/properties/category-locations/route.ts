import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

const cache = new Map()
const CACHE_TTL = 300 * 1000 // 5 minutos

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const type = searchParams.get('type') // venda ou aluguel
    const limit = parseInt(searchParams.get('limit') || '12')

    // Criar chave de cache
    const cacheKey = `category-locations-${type}-${limit}`
    const cached = cache.get(cacheKey)

    if (cached && Date.now() - cached.timestamp < CACHE_TTL) {
      return NextResponse.json(cached.data)
    }

    let where: any = {
      status: 'disponivel'
    }

    if (type) {
      where.type = type
    }

    // Buscar agregação de categoria + cidade com contagem
    const properties = await prisma.property.groupBy({
      by: ['category', 'city', 'type'],
      where,
      _count: {
        id: true
      },
      orderBy: {
        _count: {
          id: 'desc'
        }
      },
      take: limit
    })

    const categoryLocations = properties.map(item => ({
      category: item.category,
      city: item.city,
      type: item.type,
      count: item._count.id
    }))

    const response = {
      categoryLocations,
      total: categoryLocations.length
    }

    // Armazenar no cache
    cache.set(cacheKey, {
      data: response,
      timestamp: Date.now()
    })

    return NextResponse.json(response)

  } catch (error) {
    console.error('Erro ao buscar categorias por localização:', error)
    return NextResponse.json(
      { error: 'Erro interno do servidor', categoryLocations: [] },
      { status: 500 }
    )
  }
}
