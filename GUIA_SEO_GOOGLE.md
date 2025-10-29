# 🚀 GUIA COMPLETO DE SEO - BS IMÓVEIS DF

## ✅ O QUE JÁ FOI IMPLEMENTADO

### 1. **Arquivos Essenciais**
- ✅ `robots.txt` - Criado em `/public/robots.txt`
- ✅ `sitemap.xml` - Geração dinâmica em `/src/app/sitemap.ts`
- ✅ Metadata otimizada no layout principal
- ✅ Metadata dinâmica para cada imóvel

### 2. **Meta Tags Implementadas**
```typescript
✅ Title (SEO-friendly com palavras-chave)
✅ Description (com emojis e call-to-action)
✅ Keywords (palavras-chave estratégicas)
✅ Canonical URLs (evita conteúdo duplicado)
✅ Open Graph (Facebook/WhatsApp)
✅ Twitter Cards
✅ Schema.org (dados estruturados)
✅ Robots (index/follow)
```

### 3. **URLs Amigáveis**
Formato implementado:
```
/imovel/[tipo]/[categoria]/[estado]/[cidade]/[slug]

Exemplo:
/imovel/venda/apartamento/df/brasilia/apartamento-asa-sul-2-quartos
```

---

## 📝 PRÓXIMOS PASSOS - CONECTAR AO GOOGLE

### **PASSO 1: Google Search Console**

1. **Acessar**: https://search.google.com/search-console

2. **Adicionar propriedade**:
   - Escolher: "Prefixo do URL"
   - Digitar: `https://www.bsimoveisdf.com.br`

3. **Verificar propriedade** (escolha 1 método):

#### **Método 1: Tag HTML** (Recomendado)
```typescript
// Já está no código (src/app/layout.tsx linha 72-74)
verification: {
  google: 'seu-codigo-aqui', // ⚠️ TROCAR pelo código real
}
```
- Google vai dar um código tipo: `abc123def456`
- Cole esse código no lugar de `'seu-codigo-google-search-console-aqui'`

#### **Método 2: Arquivo HTML**
- Google vai pedir para criar arquivo tipo: `google1234567890abcdef.html`
- Criar em: `/public/google1234567890abcdef.html`
- Conteúdo: `google-site-verification: google1234567890abcdef.html`

### **PASSO 2: Enviar Sitemap**

No Google Search Console:
1. Menu lateral → **Sitemaps**
2. Adicionar sitemap: `https://www.bsimoveisdf.com.br/sitemap.xml`
3. Clicar em **Enviar**

### **PASSO 3: Solicitar Indexação**

1. Menu **Inspeção de URL**
2. Colar URL: `https://www.bsimoveisdf.com.br`
3. Clicar em **Solicitar indexação**

Repetir para URLs importantes:
- `/imoveis`
- `/venda`
- `/aluguel`
- `/contato`

---

## 🎯 OTIMIZAÇÕES ADICIONAIS (FAÇA DEPOIS)

### 1. **Criar Imagem OG (Open Graph)**
Criar arquivo: `/public/og-image.jpg`
- Tamanho: 1200x630px
- Incluir logo + texto: "BS Imóveis DF - Imóveis em Brasília"
- Usar no Canva ou Photoshop

### 2. **Google Analytics 4**
```typescript
// Adicionar em src/app/layout.tsx dentro do <head>
<Script
  src="https://www.googletagmanager.com/gtag/js?id=G-XXXXXXXXXX"
  strategy="afterInteractive"
/>
<Script id="google-analytics" strategy="afterInteractive">
  {`
    window.dataLayer = window.dataLayer || [];
    function gtag(){dataLayer.push(arguments);}
    gtag('js', new Date());
    gtag('config', 'G-XXXXXXXXXX');
  `}
</Script>
```

### 3. **Google My Business**
- Cadastrar imobiliária em: https://business.google.com
- Adicionar:
  - Endereço
  - Telefone
  - Horário de funcionamento
  - Fotos da fachada
  - Categoria: "Imobiliária"

### 4. **Otimizar Imagens**
Adicionar ALT text em todas as imagens:
```tsx
<Image
  src={image}
  alt="Apartamento 2 quartos à venda na Asa Sul, Brasília - BS Imóveis"
  // NÃO: alt="imagem1.jpg"
/>
```

### 5. **Velocidade do Site**
Testar em: https://pagespeed.web.dev/
- Meta: Score > 90
- Otimizar imagens (WebP)
- Lazy loading implementado

---

## 📊 MONITORAMENTO

### **Métricas para Acompanhar (Search Console)**

1. **Impressões**: Quantas vezes o site apareceu no Google
2. **Cliques**: Quantas pessoas clicaram
3. **CTR**: Taxa de clique (ideal > 3%)
4. **Posição Média**: Ranking no Google (meta: Top 3)

### **Palavras-chave para Rankear**

```
Prioritárias (Alta intenção de compra):
✅ "apartamento à venda brasília"
✅ "casa aluguel asa sul"
✅ "imóveis brasília"
✅ "imobiliária brasília df"

Long-tail (Específicas):
✅ "apartamento 2 quartos águas claras"
✅ "casa 3 quartos taguatinga venda"
✅ "aluguel apartamento asa norte mobiliado"
```

---

## 🔗 LINK BUILDING (SEO OFF-PAGE)

### **Estratégias**

1. **Diretórios**:
   - OLX Imóveis
   - VivaReal
   - ZapImóveis
   - Google My Business

2. **Parcerias Locais**:
   - Sites de notícias de Brasília
   - Blogs de decoração/arquitetura
   - Portais de condomínios

3. **Redes Sociais**:
   - Instagram (postar imóveis diariamente)
   - Facebook (grupos de Brasília)
   - YouTube (tours virtuais)

---

## ⚠️ ERROS COMUNS A EVITAR

❌ **NÃO fazer:**
- Keyword stuffing (repetir palavra-chave demais)
- Comprar links (Google penaliza)
- Conteúdo duplicado
- Páginas sem meta description
- URLs com ID numérico (ex: /imovel/123456)

✅ **FAZER:**
- Conteúdo original e útil
- Descrições únicas para cada imóvel
- URLs amigáveis (ex: /imovel/venda/casa-taguatinga)
- Atualizar site regularmente
- Mobile-friendly (já está!)

---

## 📅 CRONOGRAMA SUGERIDO

### **Semana 1: Setup Google**
- [ ] Verificar Google Search Console
- [ ] Enviar sitemap
- [ ] Solicitar indexação das páginas principais

### **Semana 2: Otimização**
- [ ] Criar imagem OG (og-image.jpg)
- [ ] Adicionar Google Analytics
- [ ] Cadastrar Google My Business

### **Semana 3: Conteúdo**
- [ ] Escrever descrições únicas para top 20 imóveis
- [ ] Adicionar ALT text nas imagens
- [ ] Criar página de blog (opcional)

### **Semana 4: Monitoramento**
- [ ] Analisar primeiras métricas
- [ ] Ajustar keywords com baixo desempenho
- [ ] Começar link building

---

## 🎓 RECURSOS ÚTEIS

- **Google Search Console**: https://search.google.com/search-console
- **Google Analytics**: https://analytics.google.com
- **PageSpeed Insights**: https://pagespeed.web.dev/
- **Teste Mobile-Friendly**: https://search.google.com/test/mobile-friendly
- **Schema Markup Validator**: https://validator.schema.org/

---

## 🆘 SUPORTE

Dúvidas? Comandos úteis:

```bash
# Ver sitemap gerado
npm run build
npm run start
# Acessar: http://localhost:3000/sitemap.xml

# Ver robots.txt
# Acessar: http://localhost:3000/robots.txt
```

---

**Última atualização**: Outubro 2025
**Próxima revisão**: 3 meses
