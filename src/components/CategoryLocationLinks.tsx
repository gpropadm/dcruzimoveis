'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { MapPin, Home } from 'lucide-react'

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

  if (loading) {
    return (
      <section className="py-12 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center">
            <div className="animate-pulse text-gray-400">Carregando...</div>
          </div>
        </div>
      </section>
    )
  }

  if (categoryLocations.length === 0) {
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
    <section className="py-12 bg-gray-50">
      <div className="container mx-auto px-4">
        {/* Título da seção */}
        <div className="text-center mb-8">
          <h2 className="text-2xl md:text-3xl font-bold text-gray-800 mb-2">
            Encontre seu imóvel ideal
          </h2>
          <p className="text-gray-600">
            Navegue por categoria e localização
          </p>
        </div>

        {/* Grid de links */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 max-w-6xl mx-auto">
          {categoryLocations.map((item, index) => (
            <Link
              key={index}
              href={generateSearchUrl(item)}
              className="group bg-white rounded-lg shadow-sm hover:shadow-md transition-all duration-200 p-4 border border-gray-200 hover:border-blue-400"
            >
              <div className="flex items-start gap-3">
                {/* Ícone */}
                <div className="flex-shrink-0 mt-1">
                  <div className="w-10 h-10 rounded-full bg-blue-50 group-hover:bg-blue-100 flex items-center justify-center transition-colors">
                    <Home className="w-5 h-5 text-blue-600" />
                  </div>
                </div>

                {/* Conteúdo */}
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold text-gray-800 group-hover:text-blue-600 transition-colors text-sm mb-1">
                    {formatCategory(item.category)} em {item.city}
                  </h3>
                  <div className="flex items-center gap-2 text-xs text-gray-500">
                    <MapPin className="w-3 h-3" />
                    <span>{item.count} {item.count === 1 ? 'imóvel' : 'imóveis'}</span>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  )
}
