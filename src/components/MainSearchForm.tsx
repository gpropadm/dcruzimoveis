'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useTheme } from '@/contexts/ThemeContext'

export default function MainSearchForm() {
  const router = useRouter()
  const { primaryColor } = useTheme()
  const [searchType, setSearchType] = useState<'venda' | 'aluguel' | ''>('')
  const [propertyType, setPropertyType] = useState('')
  const [location, setLocation] = useState('')
  const [showMoreFilters, setShowMoreFilters] = useState(false)
  const [types, setTypes] = useState<string[]>([])
  const [categories, setCategories] = useState<string[]>([])
  const [cities, setCities] = useState<string[]>([])
  const [neighborhoods, setNeighborhoods] = useState<string[]>([])
  const [filteredLocations, setFilteredLocations] = useState<string[]>([])
  const [showSuggestions, setShowSuggestions] = useState(false)
  const [showTypeDropdown, setShowTypeDropdown] = useState(false)
  const [showCategoryDropdown, setShowCategoryDropdown] = useState(false)
  const [headerTitle, setHeaderTitle] = useState('')
  const [headerSubtitle, setHeaderSubtitle] = useState('')

  // Carregar configurações (título e subtítulo)
  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const response = await fetch('/api/settings')
        if (response.ok) {
          const data = await response.json()
          if (data?.settings?.headerTitle) {
            setHeaderTitle(data.settings.headerTitle)
          }
          if (data?.settings?.headerSubtitle) {
            setHeaderSubtitle(data.settings.headerSubtitle)
          }
        }
      } catch (error) {
        console.error('Erro ao carregar configurações:', error)
      }
    }
    fetchSettings()
  }, [])

  // Carregar dados do banco (tipos, categorias, cidades e bairros)
  useEffect(() => {
    const fetchData = async () => {
      try {
        console.log('🔄 Iniciando busca de dados em /api/locations...')
        const response = await fetch('/api/locations')
        console.log('📡 Status da resposta:', response.status, response.statusText)

        if (response.ok) {
          const data = await response.json()
          console.log('✅ Dados carregados do banco:', data)
          console.log('  - Types:', data.types)
          console.log('  - Categories:', data.categories)
          console.log('  - Cities:', data.cities)

          setTypes(data.types || [])
          setCategories(data.categories || [])
          setCities(data.cities || [])
          setNeighborhoods(data.neighborhoods || [])

          console.log('✅ States atualizados!')
        } else {
          console.error('❌ Erro na API:', response.status)
        }
      } catch (error) {
        console.error('❌ Erro ao carregar dados:', error)
      }
    }
    fetchData()
  }, [])

  // Filtrar sugestões baseado no que o usuário digita
  useEffect(() => {
    if (location.length >= 2) {
      const allLocations = [...cities, ...neighborhoods]
      const filtered = allLocations.filter(loc =>
        loc.toLowerCase().includes(location.toLowerCase())
      )
      setFilteredLocations(filtered.slice(0, 5)) // Mostrar no máximo 5 sugestões
      setShowSuggestions(filtered.length > 0)
    } else {
      setFilteredLocations([])
      setShowSuggestions(false)
    }
  }, [location, cities, neighborhoods])

  const handleSearch = () => {
    const params = new URLSearchParams()
    params.set('type', searchType)
    if (propertyType) params.set('propertyType', propertyType)
    if (location) params.set('city', location)
    router.push(`/imoveis?${params.toString()}`)
  }

  return (
    <>
      <style jsx>{`
        .custom-dropdown {
          position: relative;
        }
        .dropdown-trigger {
          width: 100%;
          height: 52px;
          padding-top: 22px;
          padding-bottom: 6px;
          padding-left: 12px;
          padding-right: 28px;
          border: none;
          border-radius: 10px;
          outline: none;
          cursor: pointer;
          background-color: white;
          font-weight: 500;
          font-size: 14px;
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
          display: flex;
          align-items: center;
          justify-content: space-between;
        }
        .dropdown-trigger:hover {
          border-color: ${primaryColor};
          box-shadow: 0 2px 8px rgba(0,0,0,0.08);
        }
        .dropdown-trigger.active {
          border-color: ${primaryColor};
          box-shadow: 0 0 0 3px ${primaryColor}20;
        }
        .dropdown-menu {
          position: absolute;
          top: 100%;
          left: 0;
          right: 0;
          margin-top: 4px;
          background: white;
          border-radius: 10px;
          box-shadow: 0 10px 40px rgba(0,0,0,0.15);
          z-index: 1000;
          overflow: hidden;
          animation: slideDown 0.2s cubic-bezier(0.4, 0, 0.2, 1);
          max-height: 300px;
          overflow-y: auto;
        }
        @keyframes slideDown {
          from {
            opacity: 0;
            transform: translateY(-10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .dropdown-item {
          padding: 14px 16px;
          cursor: pointer;
          transition: all 0.2s ease;
          font-size: 14px;
          color: #1a1a1a;
          border-bottom: 1px solid #f5f5f5;
        }
        .dropdown-item:last-child {
          border-bottom: none;
        }
        .dropdown-item:hover {
          background: linear-gradient(90deg, ${primaryColor}10 0%, transparent 100%);
          padding-left: 20px;
          color: ${primaryColor};
        }
        .dropdown-item.selected {
          background-color: ${primaryColor}15;
          color: ${primaryColor};
          font-weight: 600;
        }
        select option {
          padding: 12px 16px;
          font-size: 14px;
          color: #1a1a1a;
          background-color: white;
          cursor: pointer;
        }
        select option:hover {
          background-color: #f5f5f5;
        }
        select:focus {
          border-color: ${primaryColor} !important;
          box-shadow: 0 0 0 3px ${primaryColor}20 !important;
        }
      `}</style>

      <section className="w-full text-center">
        {/* Título - Escondido em mobile */}
        <h1 className="hidden lg:block" style={{ fontSize: '3rem', fontWeight: 'bold', marginBottom: '1rem', lineHeight: '1.2', color: 'white', textShadow: '2px 2px 8px rgba(0,0,0,0.5)' }}>
          {headerTitle}
          <br />
          <small style={{ fontSize: '1.5rem', fontWeight: 'normal', opacity: 0.9, display: 'block', marginTop: '0.5rem' }}>
            {headerSubtitle}
          </small>
        </h1>

      {/* Formulário - Layout horizontal em uma linha */}
      <form
        onSubmit={(e) => { e.preventDefault(); handleSearch(); }}
        style={{
          marginTop: '1.5rem',
          backgroundColor: 'white',
          borderRadius: '16px',
          boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
          padding: '12px',
          display: 'flex',
          flexDirection: 'column',
          gap: '12px'
        }}
      >
        {/* Linha única com todos os campos - Responsivo */}
        <div className="flex flex-col lg:flex-row items-stretch gap-2 lg:gap-2">

          {/* Pretensão - Dropdown Customizado */}
          <div className="custom-dropdown w-full lg:w-auto lg:flex-none" style={{ position: 'relative', minWidth: '140px' }}>
            <span style={{ position: 'absolute', left: '12px', top: '6px', fontSize: '10px', fontWeight: '600', color: '#666', textTransform: 'uppercase', letterSpacing: '0.5px', zIndex: 1 }}>
              Pretensão
            </span>
            <div
              className={`dropdown-trigger ${showTypeDropdown ? 'active' : ''}`}
              onClick={() => setShowTypeDropdown(!showTypeDropdown)}
              onBlur={() => setTimeout(() => setShowTypeDropdown(false), 200)}
              tabIndex={0}
              style={{
                color: searchType ? '#1a1a1a' : '#999',
                paddingTop: '22px'
              }}
            >
              <span>{searchType ? searchType.charAt(0).toUpperCase() + searchType.slice(1) : 'Selecione'}</span>
            </div>
            <svg style={{ position: 'absolute', right: '12px', top: '50%', marginTop: '-4px', pointerEvents: 'none', color: '#999', transition: 'transform 0.3s', transform: showTypeDropdown ? 'rotate(180deg)' : 'rotate(0)' }} width="12" height="7" viewBox="0 0 16 9" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M0.292893 0.292893C0.683417 -0.0976311 1.31658 -0.0976311 1.70711 0.292893L8 6.58579L14.2929 0.292893C14.6834 -0.0976311 15.3166 -0.0976311 15.7071 0.292893C16.0976 0.683417 16.0976 1.31658 15.7071 1.70711L8.70711 8.70711C8.31658 9.09763 7.68342 9.09763 7.29289 8.70711L0.292893 1.70711C-0.0976311 1.31658 -0.0976311 0.683417 0.292893 0.292893Z" fill="currentColor"/>
            </svg>
            {showTypeDropdown && (
              <div className="dropdown-menu">
                {types.map((type) => (
                  <div
                    key={type}
                    className={`dropdown-item ${searchType === type ? 'selected' : ''}`}
                    onClick={() => {
                      setSearchType(type as 'venda' | 'aluguel')
                      setShowTypeDropdown(false)
                    }}
                  >
                    {type.charAt(0).toUpperCase() + type.slice(1)}
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Tipo Imóvel - Dropdown Customizado */}
          <div className="custom-dropdown w-full lg:w-auto lg:flex-none" style={{ position: 'relative', minWidth: '180px' }}>
            <svg style={{ position: 'absolute', left: '12px', top: '50%', marginTop: '-8px', pointerEvents: 'none', color: '#999', zIndex: 1 }} width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M1.75 1.5C1.61193 1.5 1.5 1.61193 1.5 1.75V14.25C1.5 14.3881 1.61193 14.5 1.75 14.5H7V16H1.75C0.783502 16 0 15.2165 0 14.25V1.75C0 0.783502 0.783502 0 1.75 0H7.25C8.2165 0 9 0.783502 9 1.75V4.75C9 4.88807 9.11193 5 9.25 5H10.25C11.2165 5 12 5.7835 12 6.75V6.82178L10.5 8.22178V6.75C10.5 6.61193 10.3881 6.5 10.25 6.5H9.25C8.2835 6.5 7.5 5.7165 7.5 4.75V1.75C7.5 1.61193 7.38807 1.5 7.25 1.5H1.75ZM4 3.75C4 4.16421 3.66421 4.5 3.25 4.5C2.83579 4.5 2.5 4.16421 2.5 3.75C2.5 3.33579 2.83579 3 3.25 3C3.66421 3 4 3.33579 4 3.75ZM3.25 7.5C3.66421 7.5 4 7.16421 4 6.75C4 6.33579 3.66421 6 3.25 6C2.83579 6 2.5 6.33579 2.5 6.75C2.5 7.16421 2.83579 7.5 3.25 7.5Z" fill="currentColor"/>
            </svg>
            <span style={{ position: 'absolute', left: '36px', top: '6px', fontSize: '10px', fontWeight: '600', color: '#666', textTransform: 'uppercase', letterSpacing: '0.5px', zIndex: 1 }}>
              Tipo imóvel
            </span>
            <div
              className={`dropdown-trigger ${showCategoryDropdown ? 'active' : ''}`}
              onClick={() => setShowCategoryDropdown(!showCategoryDropdown)}
              onBlur={() => setTimeout(() => setShowCategoryDropdown(false), 200)}
              tabIndex={0}
              style={{
                color: propertyType ? '#1a1a1a' : '#999',
                paddingTop: '22px',
                paddingLeft: '36px'
              }}
            >
              <span>{propertyType ? propertyType.charAt(0).toUpperCase() + propertyType.slice(1) : 'Selecione'}</span>
            </div>
            <svg style={{ position: 'absolute', right: '12px', top: '50%', marginTop: '-4px', pointerEvents: 'none', color: '#999', transition: 'transform 0.3s', transform: showCategoryDropdown ? 'rotate(180deg)' : 'rotate(0)' }} width="12" height="7" viewBox="0 0 16 9" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M0.292893 0.292893C0.683417 -0.0976311 1.31658 -0.0976311 1.70711 0.292893L8 6.58579L14.2929 0.292893C14.6834 -0.0976311 15.3166 -0.0976311 15.7071 0.292893C16.0976 0.683417 16.0976 1.31658 15.7071 1.70711L8.70711 8.70711C8.31658 9.09763 7.68342 9.09763 7.29289 8.70711L0.292893 1.70711C-0.0976311 1.31658 -0.0976311 0.683417 0.292893 0.292893Z" fill="currentColor"/>
            </svg>
            {showCategoryDropdown && (
              <div className="dropdown-menu">
                {categories.map((category) => (
                  <div
                    key={category}
                    className={`dropdown-item ${propertyType === category ? 'selected' : ''}`}
                    onClick={() => {
                      setPropertyType(category)
                      setShowCategoryDropdown(false)
                    }}
                  >
                    {category.charAt(0).toUpperCase() + category.slice(1)}
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Localização - campo que cresce */}
          <div className="w-full lg:flex-1" style={{ position: 'relative', minWidth: '200px' }}>
            {/* Ícone de localização */}
            <svg style={{ position: 'absolute', left: '16px', top: '50%', marginTop: '-10px', pointerEvents: 'none', color: '#999', zIndex: 1 }} width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M12 2C8.13 2 5 5.13 5 9C5 14.25 12 22 12 22C12 22 19 14.25 19 9C19 5.13 15.87 2 12 2ZM12 11.5C10.62 11.5 9.5 10.38 9.5 9C9.5 7.62 10.62 6.5 12 6.5C13.38 6.5 14.5 7.62 14.5 9C14.5 10.38 13.38 11.5 12 11.5Z" fill="currentColor"/>
            </svg>
            <input
              type="text"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              onFocus={() => location.length >= 2 && setShowSuggestions(true)}
              onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
              placeholder="Digite cidade ou bairro"
              style={{
                width: '100%',
                height: '52px',
                paddingLeft: '44px',
                paddingRight: '16px',
                border: 'none',
                borderBottom: '1px solid #e0e0e0',
                borderRadius: '10px',
                outline: 'none',
                backgroundColor: 'transparent',
                color: '#1a1a1a',
                fontSize: '14px'
              }}
            />

            {/* Dropdown de sugestões */}
            {showSuggestions && filteredLocations.length > 0 && (
              <div style={{
                position: 'absolute',
                top: '56px',
                left: 0,
                right: 0,
                backgroundColor: 'white',
                border: '1px solid #e0e0e0',
                borderRadius: '10px',
                boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
                zIndex: 1000,
                maxHeight: '200px',
                overflowY: 'auto'
              }}>
                {filteredLocations.map((loc, index) => (
                  <div
                    key={index}
                    onClick={() => {
                      setLocation(loc)
                      setShowSuggestions(false)
                    }}
                    style={{
                      padding: '12px 16px',
                      cursor: 'pointer',
                      borderBottom: index < filteredLocations.length - 1 ? '1px solid #f0f0f0' : 'none',
                      fontSize: '14px',
                      color: '#1a1a1a'
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.backgroundColor = '#f5f5f5'
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.backgroundColor = 'white'
                    }}
                  >
                    {loc}
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Mais Filtros */}
          <button
            type="button"
            onClick={() => setShowMoreFilters(!showMoreFilters)}
            className="w-full lg:w-auto"
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px',
              padding: '0 16px',
              borderRadius: '10px',
              border: 'none',
              backgroundColor: 'transparent',
              color: '#666',
              fontWeight: '500',
              fontSize: '14px',
              whiteSpace: 'nowrap',
              cursor: 'pointer',
              height: '52px'
            }}
          >
            Mais filtros
            <svg width="14" height="10" viewBox="0 0 18 12" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M10.5 10C10.9142 10 11.25 10.3358 11.25 10.75C11.25 11.1642 10.9142 11.5 10.5 11.5H7.5C7.08579 11.5 6.75 11.1642 6.75 10.75C6.75 10.3358 7.08579 10 7.5 10H10.5ZM13.5 5C13.9142 5 14.25 5.33579 14.25 5.75C14.25 6.16421 13.9142 6.5 13.5 6.5H4.5C4.08579 6.5 3.75 6.16421 3.75 5.75C3.75 5.33579 4.08579 5 4.5 5H13.5ZM16.5 0C16.9142 0 17.25 0.335786 17.25 0.75C17.25 1.16421 16.9142 1.5 16.5 1.5H1.5C1.08579 1.5 0.75 1.16421 0.75 0.75C0.75 0.335786 1.08579 0 1.5 0H16.5Z" fill="currentColor"/>
            </svg>
          </button>

          {/* Botão Buscar */}
          <button
            type="submit"
            className="w-full lg:w-auto"
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = primaryColor
              e.currentTarget.style.color = 'white'
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = '#eaeaea'
              e.currentTarget.style.color = '#666'
            }}
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px',
              padding: '0 32px',
              borderRadius: '26px',
              border: 'none',
              backgroundColor: '#eaeaea',
              color: '#666',
              fontWeight: '500',
              fontSize: '13px',
              textTransform: 'uppercase',
              letterSpacing: '0.5px',
              cursor: 'pointer',
              height: '52px',
              whiteSpace: 'nowrap',
              transition: 'all 0.3s ease'
            }}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M11 19C15.4183 19 19 15.4183 19 11C19 6.58172 15.4183 3 11 3C6.58172 3 3 6.58172 3 11C3 15.4183 6.58172 19 11 19Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M21 21L16.65 16.65" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            Encontrar imóvel
          </button>
        </div>
      </form>
    </section>
    </>
  )
}
