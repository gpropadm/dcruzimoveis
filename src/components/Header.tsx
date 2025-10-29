'use client'

import Link from 'next/link'
import { useState, useEffect } from 'react'
import { usePathname } from 'next/navigation'
import { useFavorites } from '@/hooks/useFavorites'
import { useTheme } from '@/contexts/ThemeContext'
import AnunciarImovelModal from './AnunciarImovelModal'

export default function Header() {
  const [isScrolled, setIsScrolled] = useState(false)
  const [showAnunciarModal, setShowAnunciarModal] = useState(false)
  const pathname = usePathname()
  const { favoritesCount } = useFavorites()
  const { primaryColor } = useTheme()

  // Determinar se estamos numa página que não tem hero section (fundo escuro)
  const isOnPageWithoutHero = pathname !== '/'

  useEffect(() => {
    const handleScroll = () => {
      const scrolled = window.scrollY > 50
      setIsScrolled(scrolled)
    }

    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <>
      <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${(isScrolled || isOnPageWithoutHero) ? 'bg-white shadow-md' : 'bg-transparent'}`}>
        <nav className={`container mx-auto px-4 transition-all duration-300 ${isScrolled ? 'py-4' : 'py-6'}`}>
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex-shrink-0">
            {/* Desktop: só nome */}
            <span
              className={`hidden lg:block text-3xl font-semibold transition-colors ${(isScrolled || isOnPageWithoutHero) ? '' : 'text-white'}`}
              style={{ color: (isScrolled || isOnPageWithoutHero) ? primaryColor : '' }}
            >
              DCruz Imóveis
            </span>

            {/* Mobile: ícone + nome horizontal */}
            <div className="lg:hidden flex items-center gap-2">
              <i
                className={`fas fa-home text-2xl transition-colors ${(isScrolled || isOnPageWithoutHero) ? '' : 'text-white'}`}
                style={{ color: (isScrolled || isOnPageWithoutHero) ? primaryColor : '' }}
              ></i>
              <span
                className={`text-xl font-semibold transition-colors ${(isScrolled || isOnPageWithoutHero) ? '' : 'text-white'}`}
                style={{ color: (isScrolled || isOnPageWithoutHero) ? primaryColor : '' }}
              >
                DCruz Imóveis
              </span>
            </div>
          </Link>


          {/* Botões do lado direito */}
          <div className="hidden lg:flex items-center space-x-4">
            <button
              onClick={() => setShowAnunciarModal(true)}
              className="px-6 py-2.5 border rounded-full font-normal text-sm transition-all duration-300 hover:bg-opacity-20 cursor-pointer"
              style={{
                color: (isScrolled || isOnPageWithoutHero) ? primaryColor : 'white',
                borderColor: (isScrolled || isOnPageWithoutHero) ? '#e0e0e0' : 'white'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = (isScrolled || isOnPageWithoutHero) ? primaryColor : 'rgba(255,255,255,0.2)'
                e.currentTarget.style.color = (isScrolled || isOnPageWithoutHero) ? 'white' : 'white'
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = 'transparent'
                e.currentTarget.style.color = (isScrolled || isOnPageWithoutHero) ? primaryColor : 'white'
              }}
            >
              Anuncie seu Imóvel
            </button>

            {/* Botão de Favoritos */}
            <Link
              href="/meus-favoritos"
              className="relative font-normal text-sm transition-colors flex items-center space-x-1"
              style={{
                color: (isScrolled || isOnPageWithoutHero) ? primaryColor : 'white'
              }}
              onMouseEnter={(e) => {
                if (isScrolled || isOnPageWithoutHero) e.currentTarget.style.color = primaryColor
              }}
              onMouseLeave={(e) => {
                if (isScrolled || isOnPageWithoutHero) e.currentTarget.style.color = primaryColor
              }}
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
              </svg>
              <span>Favoritos</span>
              {favoritesCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                  {favoritesCount}
                </span>
              )}
            </Link>

            <Link
              href="https://www.bsimoveisdf.com.br/admin/login"
              target="_blank"
              rel="noopener noreferrer"
              className="font-normal text-sm transition-colors"
              style={{
                color: (isScrolled || isOnPageWithoutHero) ? primaryColor : 'white'
              }}
              onMouseEnter={(e) => {
                if (isScrolled || isOnPageWithoutHero) e.currentTarget.style.color = primaryColor
              }}
              onMouseLeave={(e) => {
                if (isScrolled || isOnPageWithoutHero) e.currentTarget.style.color = primaryColor
              }}
            >
              Entrar
            </Link>
          </div>

          {/* Mobile Menu Button - REMOVIDO - Agora usamos Bottom Nav */}
        </div>
      </nav>

      {/* Modal de Anunciar Imóvel */}
      <AnunciarImovelModal
        isOpen={showAnunciarModal}
        onClose={() => setShowAnunciarModal(false)}
      />
    </header>
    </>
  )
}