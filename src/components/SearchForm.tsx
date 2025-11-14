'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useTheme } from '@/contexts/ThemeContext'

interface SearchFilters {
  types: string[]
  categoriesByType: Record<string, string[]>
}

export default function SearchForm() {
  const router = useRouter()
  const { primaryColor } = useTheme()
  const [filters, setFilters] = useState<SearchFilters>({ types: [], categoriesByType: {} })
  const [selectedCategory, setSelectedCategory] = useState<string>('')
  const [selectedType, setSelectedType] = useState<string>('')
  const [bedrooms, setBedrooms] = useState<string>('')
  const [location, setLocation] = useState<string>('')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchFilters()
  }, [])

  const fetchFilters = async () => {
    try {
      const response = await fetch('/api/search-filters')
      if (response.ok) {
        const data = await response.json()
        setFilters(data)
      }
    } catch (error) {
      console.error('Erro ao carregar filtros:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()

    const searchParams = new URLSearchParams()

    if (selectedType) searchParams.set('type', selectedType)
    if (selectedCategory) searchParams.set('category', selectedCategory)
    if (bedrooms) searchParams.set('bedrooms', bedrooms)
    if (location.trim()) {
      const locationParts = location.trim().split(' - ')
      if (locationParts.length === 2) {
        searchParams.set('city', locationParts[0])
        searchParams.set('state', locationParts[1])
      } else {
        searchParams.set('city', location.trim())
      }
    }

    router.push(`/imoveis?${searchParams.toString()}`)
  }

  if (loading) {
    return (
      <div className="max-w-6xl mx-auto px-4">
        <div className="animate-pulse">
          <div className="h-20 bg-white/80 rounded-2xl"></div>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-6xl mx-auto px-4">
      {/* Formulário de Busca Redesenhado */}
      <div className="bg-white rounded-2xl shadow-2xl overflow-hidden">
        <form onSubmit={handleSearch}>
          <div className="grid grid-cols-1 md:grid-cols-5 gap-0">

            {/* 1. Venda/Aluguel - Destaque */}
            <div className="relative group border-b md:border-b-0 md:border-r border-gray-200">
              <div className="absolute top-3 left-6 text-xs font-semibold text-gray-500 uppercase tracking-wide">
                Negócio
              </div>
              <select
                value={selectedType}
                onChange={(e) => setSelectedType(e.target.value)}
                className="w-full h-20 pt-6 pb-2 px-6 bg-transparent border-none focus:outline-none focus:ring-0 text-gray-800 font-semibold text-lg appearance-none cursor-pointer hover:bg-gray-50 transition-colors"
                style={{ backgroundImage: 'url("data:image/svg+xml,%3Csvg xmlns=\'http://www.w3.org/2000/svg\' width=\'14\' height=\'14\' viewBox=\'0 0 14 14\'%3E%3Cpath fill=\'%23999\' d=\'M7 10L2 5h10z\'/%3E%3C/svg%3E")', backgroundRepeat: 'no-repeat', backgroundPosition: 'right 1.5rem center' }}
              >
                <option value="">Selecione</option>
                {filters.types && filters.types.map((type) => (
                  <option key={type} value={type}>
                    {type.charAt(0).toUpperCase() + type.slice(1)}
                  </option>
                ))}
              </select>
            </div>

            {/* 2. Tipo de Imóvel */}
            <div className="relative group border-b md:border-b-0 md:border-r border-gray-200">
              <div className="absolute top-3 left-6 text-xs font-semibold text-gray-500 uppercase tracking-wide">
                Tipo
              </div>
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="w-full h-20 pt-6 pb-2 px-6 bg-transparent border-none focus:outline-none focus:ring-0 text-gray-800 font-semibold text-lg appearance-none cursor-pointer hover:bg-gray-50 transition-colors"
                style={{ backgroundImage: 'url("data:image/svg+xml,%3Csvg xmlns=\'http://www.w3.org/2000/svg\' width=\'14\' height=\'14\' viewBox=\'0 0 14 14\'%3E%3Cpath fill=\'%23999\' d=\'M7 10L2 5h10z\'/%3E%3C/svg%3E")', backgroundRepeat: 'no-repeat', backgroundPosition: 'right 1.5rem center' }}
              >
                <option value="">Selecione</option>
                {filters.categoriesByType && Object.values(filters.categoriesByType).flat().filter((v, i, a) => a.indexOf(v) === i).map((category) => (
                  <option key={category} value={category}>
                    {category.charAt(0).toUpperCase() + category.slice(1)}
                  </option>
                ))}
              </select>
            </div>

            {/* 3. Cidade */}
            <div className="relative group border-b md:border-b-0 md:border-r border-gray-200 md:col-span-2">
              <div className="absolute top-3 left-6 text-xs font-semibold text-gray-500 uppercase tracking-wide">
                Localização
              </div>
              <input
                type="text"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                placeholder="Cidade, bairro..."
                className="w-full h-20 pt-6 pb-2 px-6 bg-transparent border-none focus:outline-none focus:ring-0 text-gray-800 font-semibold text-lg placeholder:text-gray-400 hover:bg-gray-50 transition-colors"
              />
            </div>

            {/* 4. Quartos */}
            <div className="relative group">
              <div className="absolute top-3 left-6 text-xs font-semibold text-gray-500 uppercase tracking-wide">
                Quartos
              </div>
              <select
                value={bedrooms}
                onChange={(e) => setBedrooms(e.target.value)}
                className="w-full h-20 pt-6 pb-2 px-6 bg-transparent border-none focus:outline-none focus:ring-0 text-gray-800 font-semibold text-lg appearance-none cursor-pointer hover:bg-gray-50 transition-colors"
                style={{ backgroundImage: 'url("data:image/svg+xml,%3Csvg xmlns=\'http://www.w3.org/2000/svg\' width=\'14\' height=\'14\' viewBox=\'0 0 14 14\'%3E%3Cpath fill=\'%23999\' d=\'M7 10L2 5h10z\'/%3E%3C/svg%3E")', backgroundRepeat: 'no-repeat', backgroundPosition: 'right 1.5rem center' }}
              >
                <option value="">Todos</option>
                <option value="1">1</option>
                <option value="2">2</option>
                <option value="3">3</option>
                <option value="4">4+</option>
              </select>
            </div>
          </div>

          {/* Botão de Busca - Inferior */}
          <div className="bg-gradient-to-r from-gray-50 to-gray-100 px-6 py-4 flex justify-end">
            <button
              type="submit"
              className="px-8 py-3 rounded-xl font-bold text-white shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200 flex items-center gap-2"
              style={{ backgroundColor: primaryColor }}
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              <span>Buscar Imóveis</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}