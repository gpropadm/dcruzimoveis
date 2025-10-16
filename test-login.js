const { PrismaClient } = require('@prisma/client')
const bcrypt = require('bcryptjs')

const prisma = new PrismaClient()

async function main() {
  const email = 'dcruz.corretor@gmail.com'
  const password = '2020'
  
  console.log('🧪 Testando fluxo de login...\n')
  
  // 1. Buscar usuário
  console.log('1️⃣ Buscando usuário:', email)
  const user = await prisma.user.findUnique({
    where: { email }
  })
  
  if (!user) {
    console.log('❌ Usuário não encontrado!')
    return
  }
  
  console.log('✅ Usuário encontrado:')
  console.log('   ID:', user.id)
  console.log('   Email:', user.email)
  console.log('   Nome:', user.name)
  console.log('   Role:', user.role)
  console.log('   Hash da senha:', user.password)
  
  // 2. Testar senha
  console.log('\n2️⃣ Testando senha:', password)
  const isValid = await bcrypt.compare(password, user.password)
  console.log(isValid ? '✅ Senha VÁLIDA!' : '❌ Senha INVÁLIDA!')
  
  // 3. Verificar NEXTAUTH_SECRET
  console.log('\n3️⃣ Verificando NEXTAUTH_SECRET:')
  console.log(process.env.NEXTAUTH_SECRET ? '✅ Configurado' : '❌ NÃO configurado')
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect())
