const { PrismaClient } = require('@prisma/client')
const bcrypt = require('bcryptjs')

const prisma = new PrismaClient()

async function main() {
  console.log('🔍 Verificando usuários no banco...\n')
  
  // Listar todos os usuários
  const users = await prisma.user.findMany({
    select: {
      id: true,
      email: true,
      name: true,
      role: true
    }
  })
  
  console.log('📋 Usuários encontrados:', users.length)
  users.forEach(user => {
    console.log(`  - ${user.email} (${user.role})`)
  })
  
  console.log('\n🔐 Verificando emails específicos:')
  
  // Verificar dcruz.corretor@gmail.com
  const user1 = await prisma.user.findUnique({
    where: { email: 'dcruz.corretor@gmail.com' }
  })
  console.log('  dcruz.corretor@gmail.com:', user1 ? '✅ EXISTE' : '❌ NÃO EXISTE')
  
  // Verificar dacruz.corretor@gmail.com
  const user2 = await prisma.user.findUnique({
    where: { email: 'dacruz.corretor@gmail.com' }
  })
  console.log('  dacruz.corretor@gmail.com:', user2 ? '✅ EXISTE' : '❌ NÃO EXISTE')
  
  // Criar dacruz.corretor@gmail.com se não existir
  if (!user2) {
    console.log('\n👤 Criando usuário dacruz.corretor@gmail.com...')
    const hashedPassword = await bcrypt.hash('2020', 10)
    const newUser = await prisma.user.create({
      data: {
        email: 'dacruz.corretor@gmail.com',
        password: hashedPassword,
        name: 'D Cruz Imóveis',
        role: 'ADMIN'
      }
    })
    console.log('✅ Usuário criado com sucesso!')
  }
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect())
