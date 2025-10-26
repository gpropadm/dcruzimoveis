'use client'

import { useState, useEffect } from 'react'
import { Session } from 'next-auth'
import Link from 'next/link'
import ChatbotDashboard from './ChatbotDashboard'
import AdminLayout from './AdminLayout'

interface AdminDashboardProps {
  session: Session
}

interface DashboardStats {
  totalProperties: number
  saleProperties: number
  rentalProperties: number
  featuredProperties: number
}

export default function AdminDashboard({ session }: AdminDashboardProps) {
  const [stats, setStats] = useState<DashboardStats>({
    totalProperties: 0,
    saleProperties: 0,
    rentalProperties: 0,
    featuredProperties: 0
  })

  useEffect(() => {
    fetchStats()
  }, [])

  const fetchStats = async () => {
    try {
      const response = await fetch('/api/admin/stats')
      if (response.ok) {
        const data = await response.json()
        setStats(data)
      }
    } catch (error) {
      console.error('Erro ao carregar estatísticas:', error)
    }
  }

  return (
    <AdminLayout
      title="Dashboard"
      subtitle={`Bem-vindo de volta, ${session.user?.name}`}
      currentPage="dashboard"
    >
      <div className="p-6">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">

          {/* Total Imóveis */}
          <div className="bg-[#1c75ce] p-6 rounded-lg shadow">
            <div className="flex items-center">
              <div className="p-3 rounded-full bg-white/20">
                <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z"></path>
                </svg>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-white/90">Total Imóveis</p>
                <p className="text-2xl font-bold text-white">{stats.totalProperties}</p>
              </div>
            </div>
          </div>

          {/* Imóveis à Venda */}
          <div className="bg-[#ea8f5d] p-6 rounded-lg shadow">
            <div className="flex items-center">
              <div className="p-3 rounded-full bg-white/20">
                <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M4 4a2 2 0 00-2 2v4a2 2 0 002 2V6h10a2 2 0 00-2-2H4zm2 6a2 2 0 012-2h8a2 2 0 012 2v4a2 2 0 01-2 2H8a2 2 0 01-2-2v-4zm6 4a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd"></path>
                </svg>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-white/90">À Venda</p>
                <p className="text-2xl font-bold text-white">{stats.saleProperties}</p>
              </div>
            </div>
          </div>

          {/* Imóveis para Aluguel */}
          <div className="bg-[#9ab742] p-6 rounded-lg shadow">
            <div className="flex items-center">
              <div className="p-3 rounded-full bg-white/20">
                <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                </svg>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-white/90">Para Aluguel</p>
                <p className="text-2xl font-bold text-white">{stats.rentalProperties}</p>
              </div>
            </div>
          </div>

          {/* Imóveis em Destaque */}
          <div className="bg-[#b65cf2] p-6 rounded-lg shadow">
            <div className="flex items-center">
              <div className="p-3 rounded-full bg-white/20">
                <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path>
                </svg>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-white/90">Em Destaque</p>
                <p className="text-2xl font-bold text-white">{stats.featuredProperties}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Dashboard do Chatbot IA */}
        <div className="mb-8">
          <ChatbotDashboard />
        </div>

        {/* Ações Rápidas */}
        <div className="p-6 rounded-lg shadow bg-white">
          <h3 className="text-lg font-medium mb-6 text-gray-900">
            Ações Rápidas
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Link
              href="/admin/properties/new"
              className="group relative overflow-hidden bg-[#7360ee] p-6 rounded-xl shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition-all duration-300"
            >
              <div className="flex items-center space-x-4">
                <div className="flex-shrink-0 w-12 h-12 bg-white/20 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                  <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd"></path>
                  </svg>
                </div>
                <div className="flex-1">
                  <p className="font-semibold text-white text-lg">Novo Imóvel</p>
                  <p className="text-sm text-white/80 mt-1">Cadastrar propriedade</p>
                </div>
              </div>
              <div className="absolute top-0 right-0 w-20 h-20 bg-white/10 rounded-full -mr-10 -mt-10"></div>
            </Link>

            <Link
              href="/admin/properties"
              className="group relative overflow-hidden bg-[#1c75ce] p-6 rounded-xl shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition-all duration-300"
            >
              <div className="flex items-center space-x-4">
                <div className="flex-shrink-0 w-12 h-12 bg-white/20 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                  <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z"></path>
                  </svg>
                </div>
                <div className="flex-1">
                  <p className="font-semibold text-white text-lg">Meus Imóveis</p>
                  <p className="text-sm text-white/80 mt-1">Gerenciar portfólio</p>
                </div>
              </div>
              <div className="absolute top-0 right-0 w-20 h-20 bg-white/10 rounded-full -mr-10 -mt-10"></div>
            </Link>

            <Link
              href="/admin/settings"
              className="group relative overflow-hidden bg-[#ea8f5d] p-6 rounded-xl shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition-all duration-300"
            >
              <div className="flex items-center space-x-4">
                <div className="flex-shrink-0 w-12 h-12 bg-white/20 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                  <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M11.49 3.17c-.38-1.56-2.6-1.56-2.98 0a1.532 1.532 0 01-2.286.948c-1.372-.836-2.942.734-2.106 2.106.54.886.061 2.042-.947 2.287-1.561.379-1.561 2.6 0 2.978a1.532 1.532 0 01.947 2.287c-.836 1.372.734 2.942 2.106 2.106a1.532 1.532 0 012.287.947c.379 1.561 2.6 1.561 2.978 0a1.533 1.533 0 012.287-.947c1.372.836 2.942-.734 2.106-2.106a1.533 1.533 0 01.947-2.287c1.561-.379 1.561-2.6 0-2.978a1.532 1.532 0 01-.947-2.287c.836-1.372-.734-2.942-2.106-2.106a1.532 1.532 0 01-2.287-.947zM10 13a3 3 0 100-6 3 3 0 000 6z" clipRule="evenodd"></path>
                  </svg>
                </div>
                <div className="flex-1">
                  <p className="font-semibold text-white text-lg">Configurações</p>
                  <p className="text-sm text-white/80 mt-1">Ajustes do sistema</p>
                </div>
              </div>
              <div className="absolute top-0 right-0 w-20 h-20 bg-white/10 rounded-full -mr-10 -mt-10"></div>
            </Link>
          </div>
        </div>
      </div>
    </AdminLayout>
  )
}
