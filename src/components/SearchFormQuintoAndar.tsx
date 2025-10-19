'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useTheme } from '@/contexts/ThemeContext'

export default function SearchFormQuintoAndar() {
  const router = useRouter()
  const { primaryColor } = useTheme()
  const [searchType, setSearchType] = useState<'venda' | 'aluguel'>('aluguel')
  const [city, setCity] = useState('')
  const [neighborhood, setNeighborhood] = useState('')
  const [maxPrice, setMaxPrice] = useState('')
  const [minRooms, setMinRooms] = useState('')

  const handleSearch = () => {
    const params = new URLSearchParams()
    params.set('type', searchType)
    if (city) params.set('city', city)
    if (neighborhood) params.set('neighborhood', neighborhood)
    if (maxPrice) params.set('maxPrice', maxPrice)
    if (minRooms) params.set('minRooms', minRooms)
    router.push(`/imoveis?${params.toString()}`)
  }

  return (
    <div className="w-full max-w-md">
      {/* Título */}
      <h1 className="text-4xl font-bold mb-6 leading-tight text-white" style={{ textShadow: '2px 2px 8px rgba(0,0,0,0.5)' }}>
        Alugue um lar<br />
        para chamar de seu
      </h1>

      {/* Tabs Alugar/Comprar */}
      <div className="flex gap-6 mb-6">
        <button
          onClick={() => setSearchType('aluguel')}
          className={`pb-2 font-semibold text-base transition-all ${
            searchType === 'aluguel'
              ? 'border-b-3 text-white'
              : 'text-white/70 hover:text-white/90'
          }`}
          style={{
            borderBottomWidth: searchType === 'aluguel' ? '3px' : '0',
            borderColor: searchType === 'aluguel' ? '#fff' : 'transparent'
          }}
        >
          Alugar
        </button>
        <button
          onClick={() => setSearchType('venda')}
          className={`pb-2 font-semibold text-base transition-all ${
            searchType === 'venda'
              ? 'border-b-3 text-white'
              : 'text-white/70 hover:text-white/90'
          }`}
          style={{
            borderBottomWidth: searchType === 'venda' ? '3px' : '0',
            borderColor: searchType === 'venda' ? '#fff' : 'transparent'
          }}
        >
          Comprar
        </button>
      </div>

      {/* Formulário */}
      <form
        onSubmit={(e) => { e.preventDefault(); handleSearch(); }}
        className="rounded-2xl p-6 space-y-4 bg-white"
      >
        {/* Campo Cidade */}
        <div className="relative">
          <div className="flex items-start gap-3">
            <svg className="w-5 h-5 mt-8 flex-shrink-0" style={{ color: '#6b6b6b' }} fill="none" viewBox="0 0 24 24">
              <path fill="currentColor" fillRule="evenodd" d="M12 5.25c-2.4853 0-4.5 2.0147-4.5 4.5s2.0147 4.5 4.5 4.5 4.5-2.0147 4.5-4.5-2.0147-4.5-4.5-4.5zm-3 4.5c0-1.6569 1.3432-3 3-3 1.6569 0 3 1.3431 3 3s-1.3431 3-3 3c-1.6568 0-3-1.3431-3-3z" clipRule="evenodd"></path>
              <path fill="currentColor" fillRule="evenodd" d="M17.0313 3.2208c-2.9659-2.2944-7.0967-2.2944-10.0625 0C3.2903 6.0662 2.6712 11.398 5.5959 15.018L12 22.9433l6.4041-7.9254c2.9247-3.62 2.3057-8.9517-1.3728-11.797zm-.9179 1.1864c-2.4253-1.8763-5.8014-1.8763-8.2268 0-3.012 2.3298-3.5214 6.7006-1.124 9.668L12 20.5567l5.2374-6.4815c2.3974-2.9673 1.888-7.3382-1.124-9.668z" clipRule="evenodd"></path>
            </svg>
            <div className="flex-1">
              <label className="block text-sm font-semibold mb-2" style={{ color: '#1a1a1a' }}>
                Cidade
              </label>
              <input
                type="text"
                value={city}
                onChange={(e) => setCity(e.target.value)}
                placeholder="Busque por cidade"
                className="w-full px-0 py-2 bg-transparent border-0 border-b-2 focus:outline-none focus:ring-0 placeholder-gray-400 text-gray-900"
                style={{ borderColor: '#e0e0e0' }}
              />
            </div>
          </div>
        </div>

        {/* Campo Bairro */}
        <div className="relative">
          <div className="flex items-start gap-3">
            <svg className="w-5 h-5 mt-8 flex-shrink-0" style={{ color: '#6b6b6b' }} fill="none" viewBox="0 0 24 24">
              <path fill="currentColor" fillRule="evenodd" d="M1.7655 11.5832l.9689 1.1451 1.7655-1.4939V22.5h15V11.1444l1.7938 1.5005.9624-1.1505-10.2508-8.575-10.2398 8.6638zM5.9999 21V9.9653l6.0109-5.0858 5.9891 5.0101V21h-2.25v-9.75h-7.5V21H6zm3.75 0h4.5v-8.25h-4.5V21z" clipRule="evenodd"></path>
            </svg>
            <div className="flex-1">
              <label className="block text-sm font-semibold mb-2" style={{ color: '#1a1a1a' }}>
                Bairro
              </label>
              <input
                type="text"
                value={neighborhood}
                onChange={(e) => setNeighborhood(e.target.value)}
                placeholder="Busque por bairro"
                className="w-full px-0 py-2 bg-transparent border-0 border-b-2 focus:outline-none focus:ring-0 placeholder-gray-400 text-gray-900"
                style={{ borderColor: '#e0e0e0' }}
              />
            </div>
          </div>
        </div>

        {/* Linha com Valor e Quartos */}
        <div className="grid grid-cols-2 gap-4">
          {/* Campo Valor */}
          <div className="relative">
            <div className="flex items-start gap-2">
              <svg className="w-5 h-5 mt-8 flex-shrink-0" style={{ color: '#6b6b6b' }} fill="none" viewBox="0 0 24 24">
                <path fill="currentColor" fillRule="evenodd" d="M12 9c-1.6569 0-3 1.3431-3 3s1.3431 3 3 3 3-1.3431 3-3-1.3431-3-3-3zm-1.5 3c0-.8284.6716-1.5 1.5-1.5s1.5.6716 1.5 1.5-.6716 1.5-1.5 1.5-1.5-.6716-1.5-1.5z" clipRule="evenodd"></path>
                <path fill="currentColor" d="M19.5 12c0 .8284-.6716 1.5-1.5 1.5s-1.5-.6716-1.5-1.5.6716-1.5 1.5-1.5 1.5.6716 1.5 1.5zM6 13.5c.8284 0 1.5-.6716 1.5-1.5s-.6716-1.5-1.5-1.5-1.5.6716-1.5 1.5.6716 1.5 1.5 1.5z"></path>
                <path fill="currentColor" fillRule="evenodd" d="M1.5 18.75V5.25h21v13.5h-21zm1.5-12v10.5h18V6.75H3z" clipRule="evenodd"></path>
              </svg>
              <div className="flex-1">
                <label className="block text-sm font-semibold mb-2" style={{ color: '#1a1a1a' }}>
                  Valor até
                </label>
                <select
                  value={maxPrice}
                  onChange={(e) => setMaxPrice(e.target.value)}
                  className="w-full px-0 py-2 bg-transparent border-0 border-b-2 focus:outline-none focus:ring-0 text-gray-500 cursor-pointer"
                  style={{ borderColor: '#e0e0e0' }}
                >
                  <option value="">Escolha</option>
                  <option value="1000">R$ 1.000</option>
                  <option value="2000">R$ 2.000</option>
                  <option value="3000">R$ 3.000</option>
                  <option value="4000">R$ 4.000</option>
                  <option value="5000">R$ 5.000</option>
                  <option value="6000">R$ 6.000</option>
                  <option value="10000">R$ 10.000</option>
                  <option value="15000">R$ 15.000</option>
                  <option value="20000">R$ 20.000</option>
                </select>
              </div>
            </div>
          </div>

          {/* Campo Quartos */}
          <div className="relative">
            <div className="flex items-start gap-2">
              <svg className="w-5 h-5 mt-8 flex-shrink-0" style={{ color: '#6b6b6b' }} fill="none" viewBox="0 0 24 24">
                <path fill="currentColor" fillRule="evenodd" d="M1.5 4.5H3v9h8.25V6.75H22.5V19.5H21V15H3v4.125H1.5V4.5zm19.5 9h-8.25V8.25H21v5.25z" clipRule="evenodd"></path>
                <path fill="currentColor" fillRule="evenodd" d="M7.125 6.75C5.6753 6.75 4.5 7.9253 4.5 9.375S5.6753 12 7.125 12 9.75 10.8247 9.75 9.375 8.5747 6.75 7.125 6.75zM6 9.375c0-.6213.5037-1.125 1.125-1.125s1.125.5037 1.125 1.125S7.7463 10.5 7.125 10.5 6 9.9963 6 9.375z" clipRule="evenodd"></path>
              </svg>
              <div className="flex-1">
                <label className="block text-sm font-semibold mb-2" style={{ color: '#1a1a1a' }}>
                  Quartos
                </label>
                <select
                  value={minRooms}
                  onChange={(e) => setMinRooms(e.target.value)}
                  className="w-full px-0 py-2 bg-transparent border-0 border-b-2 focus:outline-none focus:ring-0 text-gray-500 cursor-pointer"
                  style={{ borderColor: '#e0e0e0' }}
                >
                  <option value="">Nº de quartos</option>
                  <option value="1">1+</option>
                  <option value="2">2+</option>
                  <option value="3">3+</option>
                  <option value="4">4+</option>
                </select>
              </div>
            </div>
          </div>
        </div>

        {/* Botão Buscar */}
        <button
          type="submit"
          className="w-full py-3.5 rounded-lg text-white font-semibold text-base hover:opacity-90 transition-opacity mt-6"
          style={{ backgroundColor: primaryColor }}
        >
          Buscar imóveis
        </button>
      </form>
    </div>
  )
}
