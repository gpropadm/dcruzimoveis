'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'

interface CategoryLocation {
  category: string
  city: string
  type: string
  count: number
}

interface CategoryLocationLinksProps {
  type?: 'venda' | 'aluguel' | 'all'
  limit?: number
}

export default function CategoryLocationLinks({ type, limit = 12 }: CategoryLocationLinksProps) {
  const [categoryLocations, setCategoryLocations] = useState<CategoryLocation[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const loadCategoryLocations = async () => {
      try {
        const params = new URLSearchParams()
        if (type && type !== 'all') params.append('type', type)
        params.append('limit', limit.toString())

        const response = await fetch(`/api/properties/category-locations?${params}`)
        if (response.ok) {
          const data = await response.json()
          setCategoryLocations(data.categoryLocations || [])
        }
      } catch (error) {
        console.error('Erro ao carregar categorias por localização:', error)
      } finally {
        setLoading(false)
      }
    }

    loadCategoryLocations()
  }, [type, limit])

  if (loading || categoryLocations.length === 0) {
    return null
  }

  // Função para formatar o nome da categoria
  const formatCategory = (category: string) => {
    return category.charAt(0).toUpperCase() + category.slice(1).toLowerCase()
  }

  // Função para gerar a URL de busca
  const generateSearchUrl = (item: CategoryLocation) => {
    const params = new URLSearchParams()
    params.append('category', item.category)
    params.append('city', item.city)
    if (item.type) params.append('type', item.type)
    return `/imoveis?${params.toString()}`
  }

  return (
    <section className="py-12 bg-white">
      <div className="container mx-auto px-4 max-w-6xl">
        {/* Links simples */}
        <div className="flex flex-wrap gap-3 justify-center">
          {categoryLocations.map((item, index) => (
            <Link
              key={index}
              href={generateSearchUrl(item)}
              className="text-blue-600 hover:text-blue-800 hover:underline text-sm"
            >
              {formatCategory(item.category)} em {item.city}
            </Link>
          ))}
        </div>
      </div>
    </section>
  )
}
