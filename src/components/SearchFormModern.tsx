'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useTheme } from '@/contexts/ThemeContext'

export default function SearchFormModern() {
  const router = useRouter()
  const { primaryColor } = useTheme()
  const [searchType, setSearchType] = useState<'venda' | 'aluguel'>('venda')
  const [location, setLocation] = useState('')

  const handleSearch = () => {
    const params = new URLSearchParams()
    params.set('type', searchType)
    if (location) params.set('city', location)
    router.push(`/imoveis?${params.toString()}`)
  }

  return (
    <div className="w-full max-w-3xl mx-auto px-4">
      <div className="bg-white rounded-lg shadow-md p-4">
        {/* Tabs Comprar/Alugar */}
        <div className="flex border-b border-gray-200 mb-4">
          <button
            onClick={() => setSearchType('venda')}
            className={`pb-3 px-6 font-medium text-sm transition-colors ${
              searchType === 'venda'
                ? 'border-b-2'
                : 'text-gray-500 hover:text-gray-700'
            }`}
            style={{ borderColor: searchType === 'venda' ? primaryColor : 'transparent', color: searchType === 'venda' ? primaryColor : '' }}
          >
            Comprar
          </button>
          <button
            onClick={() => setSearchType('aluguel')}
            className={`pb-3 px-6 font-medium text-sm transition-colors ${
              searchType === 'aluguel'
                ? 'border-b-2'
                : 'text-gray-500 hover:text-gray-700'
            }`}
            style={{ borderColor: searchType === 'aluguel' ? primaryColor : 'transparent', color: searchType === 'aluguel' ? primaryColor : '' }}
          >
            Alugar
          </button>
        </div>

        {/* Campo de Busca */}
        <div className="flex gap-2">
          <input
            type="text"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            placeholder="Buscar por cidade ou bairro"
            className="flex-1 py-2.5 px-4 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-opacity-50"
            onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
          />
          <button
            onClick={handleSearch}
            className="px-6 py-2.5 rounded-md text-white font-medium hover:opacity-90 transition-opacity"
            style={{ backgroundColor: primaryColor }}
          >
            Buscar
          </button>
        </div>
      </div>
    </div>
  )
}
