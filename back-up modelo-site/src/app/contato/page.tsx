'use client'

import { useState, useEffect } from 'react'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import MobileBottomNav from '@/components/MobileBottomNav'
import { useTheme } from '@/contexts/ThemeContext'

interface Settings {
  contactPhone?: string
  contactEmail?: string
  contactWhatsapp?: string
  address?: string
  city?: string
  state?: string
  socialFacebook?: string
  socialInstagram?: string
  socialTwitter?: string
}

export default function ContatoPage() {
  const { primaryColor } = useTheme()
  const [settings, setSettings] = useState<Settings>({})
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadSettings()
  }, [])

  const loadSettings = async () => {
    try {
      const response = await fetch('/api/settings')
      if (response.ok) {
        const data = await response.json()
        setSettings(data.settings || {})
      }
    } catch (error) {
      console.error('Erro ao carregar configurações:', error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen" style={{ backgroundColor: '#ffffff' }}>
        <Header />
        <div className="flex items-center justify-center py-24">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 mx-auto" style={{ borderColor: primaryColor }}></div>
            <p className="mt-4 text-gray-600">Carregando informações...</p>
          </div>
        </div>
        <Footer />
        <MobileBottomNav />
      </div>
    )
  }

  return (
    <div className="min-h-screen" style={{ backgroundColor: '#ffffff' }}>
      <Header />

      {/* Barra de título abaixo do header */}
      <div className="py-8 pt-24" style={{ backgroundColor: primaryColor }}>
        <div className="max-w-6xl mx-auto px-4 text-left">
          <h4 className="title col-12 my-0 text-xl md:text-2xl font-bold text-white">
            Entre em Contato
          </h4>
          <p className="col-12 my-0 text-white opacity-90">
            Estamos aqui para te ajudar
          </p>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-6xl mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {/* Telefone */}
          {settings.contactPhone && (
            <div className="bg-white rounded-lg shadow-md p-8 text-center hover:shadow-lg transition-shadow">
              <div className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4" style={{ backgroundColor: `${primaryColor}20` }}>
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke={primaryColor} strokeWidth="2">
                  <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/>
                </svg>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Telefone</h3>
              <a href={`tel:${settings.contactPhone}`} className="text-gray-600 hover:text-gray-900 text-lg">
                {settings.contactPhone}
              </a>
            </div>
          )}

          {/* Email */}
          {settings.contactEmail && (
            <div className="bg-white rounded-lg shadow-md p-8 text-center hover:shadow-lg transition-shadow">
              <div className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4" style={{ backgroundColor: `${primaryColor}20` }}>
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke={primaryColor} strokeWidth="2">
                  <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/>
                  <polyline points="22,6 12,13 2,6"/>
                </svg>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Email</h3>
              <a href={`mailto:${settings.contactEmail}`} className="text-gray-600 hover:text-gray-900 text-lg break-all">
                {settings.contactEmail}
              </a>
            </div>
          )}

          {/* WhatsApp */}
          {settings.contactWhatsapp && (
            <div className="bg-white rounded-lg shadow-md p-8 text-center hover:shadow-lg transition-shadow">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor" className="text-green-600">
                  <path d="M12.04 2c-5.46 0-9.91 4.45-9.91 9.91 0 1.75.46 3.45 1.32 4.95L2.05 22l5.25-1.38c1.45.79 3.08 1.21 4.74 1.21 5.46 0 9.91-4.45 9.91-9.91S17.5 2 12.04 2zm5.8 14.24c-.23.64-1.15 1.18-1.79 1.32-.43.09-.99.16-2.89-.63-2.29-.96-3.74-3.27-3.86-3.42-.11-.15-.95-1.26-.95-2.41s.59-1.71.8-1.94c.2-.23.44-.29.59-.29.15 0 .29 0 .42.01.13.01.31-.05.48.37.18.44.61 1.49.66 1.6.05.11.08.23.02.38-.06.15-.09.25-.18.38-.09.13-.19.29-.27.39-.09.1-.18.21-.08.41.1.2.45.74.96 1.2.66.6 1.21.79 1.39.88.18.09.29.08.39-.05.1-.13.43-.5.54-.68.11-.18.23-.15.38-.09.15.06.96.45 1.12.53.16.08.27.12.31.19.04.07.04.39-.19 1.03z"/>
                </svg>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">WhatsApp</h3>
              <a
                href={`https://api.whatsapp.com/send?phone=${settings.contactWhatsapp.replace(/\D/g, '')}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-green-600 hover:text-green-700 text-lg font-semibold"
              >
                {settings.contactWhatsapp}
              </a>
            </div>
          )}

          {/* Endereço */}
          {(settings.address || settings.city) && (
            <div className="bg-white rounded-lg shadow-md p-8 text-center hover:shadow-lg transition-shadow">
              <div className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4" style={{ backgroundColor: `${primaryColor}20` }}>
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke={primaryColor} strokeWidth="2">
                  <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/>
                  <circle cx="12" cy="10" r="3"/>
                </svg>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Endereço</h3>
              <p className="text-gray-600 text-lg">
                {settings.address && <>{settings.address}<br /></>}
                {settings.city && settings.state ? `${settings.city} - ${settings.state}` : settings.city || settings.state}
              </p>
            </div>
          )}

          {/* Redes Sociais */}
          {(settings.socialFacebook || settings.socialInstagram || settings.socialTwitter) && (
            <div className="bg-white rounded-lg shadow-md p-8 text-center hover:shadow-lg transition-shadow md:col-span-2 lg:col-span-1">
              <div className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4" style={{ backgroundColor: `${primaryColor}20` }}>
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke={primaryColor} strokeWidth="2">
                  <path d="M17 2H7C4.23858 2 2 4.23858 2 7V17C2 19.7614 4.23858 22 7 22H17C19.7614 22 22 19.7614 22 17V7C22 4.23858 19.7614 2 17 2Z"/>
                  <path d="M16 11.37C16.1234 12.2022 15.9813 13.0522 15.5938 13.799C15.2063 14.5458 14.5931 15.1514 13.8416 15.5297C13.0901 15.9079 12.2384 16.0396 11.4077 15.9059C10.5771 15.7723 9.80976 15.3801 9.21484 14.7852C8.61992 14.1902 8.22773 13.4229 8.09407 12.5923C7.9604 11.7616 8.09207 10.9099 8.47033 10.1584C8.84859 9.40685 9.45419 8.79374 10.201 8.40624C10.9478 8.01874 11.7978 7.87658 12.63 8C13.4789 8.12588 14.2648 8.52146 14.8717 9.1283C15.4785 9.73515 15.8741 10.5211 16 11.37Z"/>
                </svg>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-4">Redes Sociais</h3>
              <div className="flex justify-center gap-4">
                {settings.socialFacebook && (
                  <a href={settings.socialFacebook} target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-full bg-blue-600 flex items-center justify-center hover:bg-blue-700 transition-colors">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="white">
                      <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                    </svg>
                  </a>
                )}
                {settings.socialInstagram && (
                  <a href={settings.socialInstagram} target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-600 to-pink-500 flex items-center justify-center hover:from-purple-700 hover:to-pink-600 transition-colors">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="white">
                      <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                    </svg>
                  </a>
                )}
                {settings.socialTwitter && (
                  <a href={settings.socialTwitter} target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-full bg-sky-500 flex items-center justify-center hover:bg-sky-600 transition-colors">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="white">
                      <path d="M23 3a10.9 10.9 0 01-3.14 1.53 4.48 4.48 0 00-7.86 3v1A10.66 10.66 0 013 4s-4 9 5 13a11.64 11.64 0 01-7 2c9 5 20 0 20-11.5a4.5 4.5 0 00-.08-.83A7.72 7.72 0 0023 3z"/>
                    </svg>
                  </a>
                )}
              </div>
            </div>
          )}

          {/* Horário de Atendimento */}
          <div className="bg-white rounded-lg shadow-md p-8 hover:shadow-lg transition-shadow md:col-span-2 lg:col-span-3">
            <div className="text-center mb-6">
              <div className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4" style={{ backgroundColor: `${primaryColor}20` }}>
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke={primaryColor} strokeWidth="2">
                  <circle cx="12" cy="12" r="10"/>
                  <path d="M12 6v6l4 2"/>
                </svg>
              </div>
              <h3 className="text-2xl font-bold text-gray-900">Horário de Atendimento</h3>
            </div>
            <div className="max-w-md mx-auto space-y-3">
              <div className="flex justify-between items-center py-2 border-b border-gray-200">
                <span className="text-gray-600 font-medium">Segunda a Sexta</span>
                <span className="font-semibold text-gray-900">8h às 18h</span>
              </div>
              <div className="flex justify-between items-center py-2 border-b border-gray-200">
                <span className="text-gray-600 font-medium">Sábado</span>
                <span className="font-semibold text-gray-900">8h às 12h</span>
              </div>
              <div className="flex justify-between items-center py-2">
                <span className="text-gray-600 font-medium">Domingo</span>
                <span className="font-semibold text-gray-900">Fechado</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <Footer />
      <MobileBottomNav />
    </div>
  )
}
