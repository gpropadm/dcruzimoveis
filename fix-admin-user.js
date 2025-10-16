const { PrismaClient } = require('@prisma/client')
const bcrypt = require('bcryptjs')

const prisma = new PrismaClient()

async function main() {
  const email = 'dcruz.corretor@gmail.com'
  const password = '2020'
  
  console.log('🔍 Verificando usuário existente...')
  
  // Deletar se já existe
  const existing = await prisma.user.findUnique({
    where: { email }
  })

  if (existing) {
    console.log('🗑️  Deletando usuário existente...')
    await prisma.user.delete({
      where: { email }
    })
  }

  // Hash da senha
  console.log('🔐 Gerando hash da senha...')
  const hashedPassword = await bcrypt.hash(password, 10)
  console.log('Hash gerado:', hashedPassword)

  // Criar novo usuário
  console.log('👤 Criando novo usuário...')
  const user = await prisma.user.create({
    data: {
      email,
      password: hashedPassword,
      name: 'D Cruz Imóveis',
      role: 'ADMIN'
    }
  })

  console.log('✅ Usuário admin criado com sucesso!')
  console.log('📧 Email:', user.email)
  console.log('👤 Nome:', user.name)
  console.log('🔑 Role:', user.role)
  console.log('🔒 Senha: 2020')
  
  // Testar se a senha funciona
  console.log('\n🧪 Testando validação da senha...')
  const isValid = await bcrypt.compare(password, user.password)
  console.log('Senha válida?', isValid ? '✅ SIM' : '❌ NÃO')
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect())
