'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useState } from 'react'
import { useTheme } from '@/contexts/ThemeContext'
import { useFavorites } from '@/hooks/useFavorites'
import AnunciarImovelModal from './AnunciarImovelModal'

export default function MobileBottomNav() {
  const pathname = usePathname()
  const { primaryColor } = useTheme()
  const { favoritesCount } = useFavorites()
  const [showAnunciarModal, setShowAnunciarModal] = useState(false)

  const isActive = (path: string) => pathname === path

  const menuItems = [
    {
      label: 'Início',
      path: '/',
      icon: (active: boolean) => (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M3 9L12 2L21 9V20C21 20.5304 20.7893 21.0391 20.4142 21.4142C20.0391 21.7893 19.5304 22 19 22H5C4.46957 22 3.96086 21.7893 3.58579 21.4142C3.21071 21.0391 3 20.5304 3 20V9Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" fill={active ? 'currentColor' : 'none'}/>
          <path d="M9 22V12H15V22" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      )
    },
    {
      label: 'Buscar',
      path: '/imoveis',
      icon: (active: boolean) => (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M11 19C15.4183 19 19 15.4183 19 11C19 6.58172 15.4183 3 11 3C6.58172 3 3 6.58172 3 11C3 15.4183 6.58172 19 11 19Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" fill={active ? 'currentColor' : 'none'}/>
          <path d="M21 21L16.65 16.65" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      )
    },
    {
      label: 'Anunciar',
      path: null,
      onClick: () => setShowAnunciarModal(true),
      icon: (active: boolean) => (
        <svg width="28" height="28" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <circle cx="12" cy="12" r="10" fill={primaryColor}/>
          <path d="M12 8V16M8 12H16" stroke="white" strokeWidth="2" strokeLinecap="round"/>
        </svg>
      ),
      isMainAction: true
    },
    {
      label: 'Favoritos',
      path: '/meus-favoritos',
      badge: favoritesCount,
      icon: (active: boolean) => (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M20.84 4.61C20.3292 4.099 19.7228 3.69364 19.0554 3.41708C18.3879 3.14052 17.6725 2.99817 16.95 2.99817C16.2275 2.99817 15.5121 3.14052 14.8446 3.41708C14.1772 3.69364 13.5708 4.099 13.06 4.61L12 5.67L10.94 4.61C9.9083 3.57831 8.50903 2.99871 7.05 2.99871C5.59096 2.99871 4.19169 3.57831 3.16 4.61C2.1283 5.64169 1.54871 7.04097 1.54871 8.5C1.54871 9.95903 2.1283 11.3583 3.16 12.39L4.22 13.45L12 21.23L19.78 13.45L20.84 12.39C21.351 11.8792 21.7563 11.2728 22.0329 10.6053C22.3095 9.93789 22.4518 9.22248 22.4518 8.5C22.4518 7.77752 22.3095 7.06211 22.0329 6.39464C21.7563 5.72718 21.351 5.12075 20.84 4.61Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" fill={active ? 'currentColor' : 'none'}/>
        </svg>
      )
    },
    {
      label: 'Contato',
      path: '/contato',
      icon: (active: boolean) => (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M21 15C21 15.5304 20.7893 16.0391 20.4142 16.4142C20.0391 16.7893 19.5304 17 19 17H7L3 21V5C3 4.46957 3.21071 3.96086 3.58579 3.58579C3.96086 3.21071 4.46957 3 5 3H19C19.5304 3 20.0391 3.21071 20.4142 3.58579C20.7893 3.96086 21 4.46957 21 5V15Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" fill={active ? 'currentColor' : 'none'}/>
        </svg>
      )
    }
  ]

  return (
    <>
      {/* Bottom Navigation - Apenas em mobile */}
      <nav className="lg:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 z-50 safe-area-bottom">
        <div className="grid grid-cols-5 h-16">
          {menuItems.map((item, index) => {
            const active = item.path ? isActive(item.path) : false

            return item.path ? (
              <Link
                key={index}
                href={item.path}
                className={`flex flex-col items-center justify-center transition-all duration-300 ${
                  item.isMainAction ? 'relative -mt-6' : ''
                }`}
                style={{
                  color: active ? primaryColor : '#666'
                }}
              >
                {item.isMainAction ? (
                  <div className="bg-white rounded-full p-2 shadow-lg">
                    {item.icon(active)}
                  </div>
                ) : (
                  <>
                    <div className="relative">
                      {item.icon(active)}
                      {item.badge && item.badge > 0 && (
                        <span
                          className="absolute -top-1 -right-1 text-white text-xs rounded-full w-4 h-4 flex items-center justify-center"
                          style={{ backgroundColor: primaryColor, fontSize: '10px' }}
                        >
                          {item.badge > 9 ? '9+' : item.badge}
                        </span>
                      )}
                    </div>
                    <span className="text-xs mt-1 font-medium">{item.label}</span>
                  </>
                )}
              </Link>
            ) : (
              <button
                key={index}
                onClick={item.onClick}
                className={`flex flex-col items-center justify-center transition-all duration-300 ${
                  item.isMainAction ? 'relative -mt-6' : ''
                }`}
                style={{
                  color: active ? primaryColor : '#666'
                }}
              >
                {item.isMainAction ? (
                  <div className="bg-white rounded-full p-2 shadow-lg">
                    {item.icon(active)}
                  </div>
                ) : (
                  <>
                    {item.icon(active)}
                    <span className="text-xs mt-1 font-medium">{item.label}</span>
                  </>
                )}
              </button>
            )
          })}
        </div>
      </nav>

      {/* Modal de Anunciar */}
      {showAnunciarModal && (
        <AnunciarImovelModal
          isOpen={showAnunciarModal}
          onClose={() => setShowAnunciarModal(false)}
        />
      )}

      {/* Espaçamento inferior para compensar o bottom nav */}
      <div className="lg:hidden h-16"></div>
    </>
  )
}
