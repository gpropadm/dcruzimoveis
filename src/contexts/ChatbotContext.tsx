'use client'

import { createContext, useContext, useState, ReactNode } from 'react'

interface ChatbotContextType {
  selectedPropertySlugs: string[]
  setSelectedPropertySlugs: (slugs: string[]) => void
}

const ChatbotContext = createContext<ChatbotContextType | undefined>(undefined)

export function ChatbotProvider({ children }: { children: ReactNode }) {
  const [selectedPropertySlugs, setSelectedPropertySlugs] = useState<string[]>([])

  return (
    <ChatbotContext.Provider value={{ selectedPropertySlugs, setSelectedPropertySlugs }}>
      {children}
    </ChatbotContext.Provider>
  )
}

export function useChatbot() {
  const context = useContext(ChatbotContext)
  if (context === undefined) {
    throw new Error('useChatbot must be used within a ChatbotProvider')
  }
  return context
}
