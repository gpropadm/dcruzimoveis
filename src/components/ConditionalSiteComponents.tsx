'use client'

import { usePathname } from 'next/navigation'
import WhatsAppButton from './WhatsAppButton'
import ChatbotSimple from './ChatbotSimple'
import MobileBottomNav from './MobileBottomNav'

export default function ConditionalSiteComponents() {
  const pathname = usePathname()

  // Não renderizar componentes do site nas páginas do admin
  const isAdminPage = pathname?.startsWith('/admin')

  if (isAdminPage) {
    return null
  }

  return (
    <>
      <WhatsAppButton />
      <ChatbotSimple />
      <MobileBottomNav />
    </>
  )
}
