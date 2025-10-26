import { NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export async function GET() {
  try {
    // Buscar todas as propriedades com os campos necessários
    const properties = await prisma.property.findMany({
      select: {
        type: true,
        category: true,
        city: true,
        address: true
      }
    })

    // Extrair tipos únicos (venda/aluguel)
    const types = [...new Set(properties.map(p => p.type).filter(Boolean))].sort()

    // Extrair categorias únicas (casa, apartamento, etc)
    const categories = [...new Set(properties.map(p => p.category).filter(Boolean))].sort()

    // Extrair cidades únicas
    const cities = [...new Set(properties.map(p => p.city).filter(Boolean))].sort()

    // Extrair bairros únicos dos endereços
    const neighborhoods = [...new Set(
      properties
        .map(p => {
          if (!p.address) return ''
          const parts = p.address.split(',')
          return parts[1]?.trim() || ''
        })
        .filter(Boolean)
    )].sort()

    return NextResponse.json({
      types,
      categories,
      cities,
      neighborhoods
    })
  } catch (error) {
    console.error('Erro ao buscar localizações:', error)
    console.error('Stack trace:', error)
    return NextResponse.json(
      {
        error: 'Erro interno do servidor',
        message: error instanceof Error ? error.message : 'Erro desconhecido'
      },
      { status: 500 }
    )
  } finally {
    await prisma.$disconnect()
  }
}
