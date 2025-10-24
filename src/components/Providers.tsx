'use client'

import { SessionProvider } from 'next-auth/react'
import { ToastProvider } from '@/contexts/ToastContext'
import { ThemeProvider } from '@/contexts/ThemeContext'
import { ChatbotProvider } from '@/contexts/ChatbotContext'

export default function Providers({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <SessionProvider>
      <ThemeProvider>
        <ToastProvider>
          <ChatbotProvider>
            {children}
          </ChatbotProvider>
        </ToastProvider>
      </ThemeProvider>
    </SessionProvider>
  )
}