import { MetadataRoute } from 'next'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = 'https://www.bsimoveisdf.com.br'

  // Páginas estáticas
  const routes = [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: 'daily' as const,
      priority: 1.0,
    },
    {
      url: `${baseUrl}/imoveis`,
      lastModified: new Date(),
      changeFrequency: 'daily' as const,
      priority: 0.9,
    },
    {
      url: `${baseUrl}/venda`,
      lastModified: new Date(),
      changeFrequency: 'daily' as const,
      priority: 0.9,
    },
    {
      url: `${baseUrl}/aluguel`,
      lastModified: new Date(),
      changeFrequency: 'daily' as const,
      priority: 0.9,
    },
    {
      url: `${baseUrl}/contato`,
      lastModified: new Date(),
      changeFrequency: 'monthly' as const,
      priority: 0.7,
    },
    {
      url: `${baseUrl}/anunciar`,
      lastModified: new Date(),
      changeFrequency: 'monthly' as const,
      priority: 0.6,
    },
  ]

  try {
    // Buscar imóveis do banco de dados
    const response = await fetch(`${baseUrl}/api/properties?limit=1000`, {
      next: { revalidate: 3600 } // Revalidar a cada 1 hora
    })

    if (response.ok) {
      const properties = await response.json()

      // Adicionar cada imóvel ao sitemap
      const propertyRoutes = properties.map((property: any) => {
        // Usar o formato de URL correto do seu sistema
        const slug = property.slug || property.id
        const category = property.category || 'imovel'
        const type = property.type === 'venda' ? 'venda' : 'aluguel'
        const state = property.state?.toLowerCase() || 'df'
        const city = property.city?.toLowerCase().replace(/\s+/g, '-') || 'brasilia'

        return {
          url: `${baseUrl}/imovel/${type}/${category}/${state}/${city}/${slug}`,
          lastModified: property.updatedAt ? new Date(property.updatedAt) : new Date(),
          changeFrequency: 'weekly' as const,
          priority: 0.8,
        }
      })

      return [...routes, ...propertyRoutes]
    }
  } catch (error) {
    console.error('Erro ao gerar sitemap:', error)
  }

  // Se der erro, retorna só as rotas estáticas
  return routes
}
