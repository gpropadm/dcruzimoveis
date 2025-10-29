import { notFound } from 'next/navigation'
import { Metadata } from 'next'
import PropertyDetailClient from '@/components/PropertyDetailClient'
import { getFirstImage } from '@/lib/imageUtils'
import prisma from '@/lib/prisma'

interface PropertyDetailProps {
  params: Promise<{
    segments: string[]
  }>
}

interface Property {
  id: string
  title: string
  seoTitle: string | null
  description: string | null
  seoDescription: string | null
  price: number
  previousPrice?: number | null
  priceReduced?: boolean
  priceReducedAt?: string | null
  type: string
  category: string
  address: string
  city: string
  state: string
  bedrooms: number | null
  bathrooms: number | null
  parking: number | null
  area: number | null
  images: string | null
  video: string | null
  slug: string
  amenities: string | null
  condoFee: number | null
  floor: number | null
  suites: number | null
  iptu: number | null
  apartmentTotalArea: number | null
  apartmentUsefulArea: number | null
  acceptsFinancing: boolean
  acceptsTrade: boolean
  acceptsCar: boolean
  createdAt: string
  updatedAt: string
}

async function getProperty(segments: string[]): Promise<Property | null> {
  try {
    let slug: string

    // Formato antigo: /imovel/[slug]
    if (segments.length === 1) {
      slug = segments[0]
      console.log(`🔍 [PAGE] Buscando por slug simples: ${slug}`)
    }
    // Formato novo: /imovel/[category]/[type]/[state]/[city]/[slug]
    else if (segments.length === 5) {
      slug = segments[4]
      console.log(`🔍 [PAGE] Buscando por slug SEO: ${slug}`)
    } else {
      console.log(`❌ [PAGE] Formato de URL inválido - segmentos: ${segments.length}`)
      return null
    }

    const property = await prisma.property.findUnique({
      where: { slug },
      select: {
        id: true,
        title: true,
        seoTitle: true,
        description: true,
        seoDescription: true,
        price: true,
        previousPrice: true,
        priceReduced: true,
        priceReducedAt: true,
        type: true,
        category: true,
        address: true,
        city: true,
        state: true,
        bedrooms: true,
        bathrooms: true,
        parking: true,
        area: true,
        images: true,
        video: true,
        slug: true,
        amenities: true,
        condoFee: true,
        floor: true,
        suites: true,
        iptu: true,
        apartmentTotalArea: true,
        apartmentUsefulArea: true,
        acceptsFinancing: true,
        acceptsTrade: true,
        acceptsCar: true,
        createdAt: true,
        updatedAt: true
      }
    })

    if (!property) {
      console.log(`❌ [PAGE] Propriedade não encontrada`)
      return null
    }

    console.log(`✅ [PAGE] Propriedade encontrada: ${property.title}`)
    return {
      ...property,
      createdAt: property.createdAt.toISOString(),
      updatedAt: property.updatedAt.toISOString(),
      priceReducedAt: property.priceReducedAt?.toISOString() || null
    }
  } catch (error) {
    console.error('Error fetching property:', error)
    return null
  }
}

export async function generateMetadata({ params }: PropertyDetailProps): Promise<Metadata> {
  const resolvedParams = await params
  const property = await getProperty(resolvedParams.segments)

  if (!property) {
    return {
      title: 'Imóvel não encontrado',
    }
  }

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(price)
  }

  const firstImage = getFirstImage(property.images)

  // Usar seoTitle se existir, senão gera automaticamente
  const title = property.seoTitle ||
    `${property.category} ${property.bedrooms ? `${property.bedrooms} quartos` : ''} ${property.type === 'venda' ? 'à venda' : 'para alugar'} ${property.city} - ${formatPrice(property.price)}`

  // Usar seoDescription se existir, senão usa description normal ou gera
  const description = property.seoDescription ||
    property.description ||
    `${property.category} para ${property.type} em ${property.city}, ${property.state}. ${property.bedrooms ? `${property.bedrooms} quartos` : ''} ${property.bathrooms ? `${property.bathrooms} banheiros` : ''} ${property.area ? `${property.area}m²` : ''}. Confira na BS Imóveis DF.`

  // Gerar URL canônica no formato SEO-friendly
  const categorySlug = property.category.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/[^a-z0-9\s-]/g, '').replace(/\s+/g, '-')
  const stateSlug = property.state.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/[^a-z0-9\s-]/g, '').replace(/\s+/g, '-')
  const citySlug = property.city.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/[^a-z0-9\s-]/g, '').replace(/\s+/g, '-')
  const canonicalUrl = `https://www.bsimoveisdf.com.br/imovel/${categorySlug}/${property.type}/${stateSlug}/${citySlug}/${property.slug}`

  return {
    title,
    description,
    keywords: [
      property.category,
      property.type,
      property.city,
      property.state,
      'imóvel brasília',
      'imóveis df',
      property.type === 'venda' ? 'venda brasília' : 'aluguel brasília',
      'bs imóveis'
    ],
    openGraph: {
      title,
      description,
      images: [
        {
          url: firstImage.startsWith('http') ? firstImage : `https://www.bsimoveisdf.com.br${firstImage}`,
          width: 1200,
          height: 630,
          alt: property.title,
        },
      ],
      type: 'website',
      locale: 'pt_BR',
      siteName: 'BS Imóveis DF',
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [firstImage.startsWith('http') ? firstImage : `https://www.bsimoveisdf.com.br${firstImage}`],
    },
    alternates: {
      canonical: canonicalUrl,
    },
  }
}

export default async function PropertyDetail({ params }: PropertyDetailProps) {
  const resolvedParams = await params
  const property = await getProperty(resolvedParams.segments)

  if (!property) {
    notFound()
  }

  return <PropertyDetailClient property={property} />
}
