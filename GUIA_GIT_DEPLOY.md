# 📚 Guia Completo: Git Commit + Deploy Vercel

## 1️⃣ Verificar o que foi alterado

```bash
cd /home/alex/modelo-site
git status
```

Isso mostra todos os arquivos modificados, novos ou deletados.

---

## 2️⃣ Ver detalhes das mudanças

```bash
# Ver resumo das mudanças
git diff --stat

# Ver mudanças detalhadas de um arquivo específico
git diff src/components/Header.tsx

# Ver todas as mudanças linha por linha
git diff
```

---

## 3️⃣ Adicionar arquivos ao commit

Você tem 3 opções:

### Opção A - Adicionar arquivos específicos
```bash
git add src/components/Header.tsx
git add src/components/Footer.tsx
```

### Opção B - Adicionar uma pasta inteira
```bash
git add src/components/
```

### Opção C - Adicionar TUDO que foi alterado
```bash
git add .
# OU
git add -A
```

---

## 4️⃣ Verificar o que está pronto para commit

```bash
git status
```

Os arquivos em **verde** estão prontos para commit (staged).
Os arquivos em **vermelho** ainda não foram adicionados.

---

## 5️⃣ Criar o commit

```bash
git commit -m "Sua mensagem aqui descrevendo as mudanças"
```

### Exemplo de boas mensagens:
```bash
git commit -m "Atualizar logo e marca para BS Imóveis"
git commit -m "Corrigir bug no formulário de contato"
git commit -m "Adicionar nova página de serviços"
git commit -m "Alterar cor do botão de WhatsApp"
```

### ❌ Evite mensagens vagas:
- "fix"
- "update"
- "changes"

---

## 6️⃣ Enviar para o GitHub

```bash
# Para o repositório bsimoveisdf
git push bsimoveisdf main

# OU para origin (padrão)
git push origin main
```

---

## 7️⃣ Como funciona o Deploy na Vercel

A Vercel está conectada ao seu repositório GitHub. Quando você faz o push:

1. **Automático:** A Vercel detecta a mudança no GitHub
2. **Build:** Ela automaticamente inicia o build do projeto
3. **Deploy:** Se o build for bem-sucedido, faz o deploy automaticamente
4. **Live:** Seu site fica live em poucos minutos!

---

## 📊 Acompanhar o Deploy na Vercel

1. Acesse: https://vercel.com
2. Faça login
3. Vá em "Deployments"
4. Você verá o status do deploy em tempo real:
   - 🟡 Building... (construindo)
   - 🟢 Ready (pronto e online)
   - 🔴 Error (erro - clique para ver logs)

---

## 🎯 Comandos Úteis Extras

### Desfazer mudanças não commitadas
```bash
git restore src/components/Header.tsx  # Desfaz um arquivo específico
git restore .                          # Desfaz tudo
```

### Remover arquivos do stage (antes de commit)
```bash
git reset src/components/Header.tsx    # Remove arquivo específico
git reset                              # Remove tudo do stage
```

### Ver histórico de commits
```bash
git log                    # Histórico completo
git log --oneline          # Resumido
git log -3                 # Últimos 3 commits
git log --graph            # Ver branches visualmente
```

### Ver diferença entre commits
```bash
git diff HEAD~1            # Comparar com commit anterior
git diff HEAD~2            # Comparar com 2 commits atrás
```

### Ver quais branches existem
```bash
git branch                 # Branches locais
git branch -a              # Todos os branches
```

### Ver repositórios remotos configurados
```bash
git remote -v
```

---

## 🔄 Fluxo Completo Resumido

```bash
# 1. Veja o que mudou
git status

# 2. Adicione o que quer commitar
git add src/components/    # Pasta específica
# OU
git add .                  # Tudo

# 3. Faça o commit
git commit -m "Descrição clara das mudanças"

# 4. Envie para o GitHub
git push bsimoveisdf main

# 5. Aguarde o deploy automático na Vercel (1-3 minutos)
# Acesse https://vercel.com para acompanhar
```

---

## ⚠️ Dicas Importantes

### 1. Sempre veja o que está commitando
```bash
git status
git diff
```

### 2. Commits pequenos e frequentes
São melhores que um commit gigante. Facilita:
- Encontrar bugs
- Reverter mudanças específicas
- Entender o histórico

### 3. Mensagens descritivas
- ✅ "Corrigir cor do botão de contato no Header"
- ✅ "Adicionar validação de email no formulário"
- ❌ "fix"
- ❌ "update"

### 4. Verifique o branch antes de fazer push
```bash
git branch  # Mostra em qual branch você está (main, develop, etc)
```

### 5. Se der erro no push
Pode ser que precise fazer pull primeiro:
```bash
git pull bsimoveisdf main
```

### 6. Não commite arquivos sensíveis
- ❌ `.env` (senhas, chaves API)
- ❌ `node_modules/`
- ❌ Arquivos com dados pessoais
- ✅ Use `.gitignore` para ignorar automaticamente

---

## 🎓 Exemplo Prático Completo

Você alterou Header.tsx e Footer.tsx e quer fazer deploy:

```bash
# 1. Ver o que mudou
cd /home/alex/modelo-site
git status

# 2. Ver detalhes das mudanças
git diff src/components/Header.tsx
git diff src/components/Footer.tsx

# 3. Adicionar apenas esses 2 arquivos
git add src/components/Header.tsx src/components/Footer.tsx

# 4. Verificar se está tudo certo
git status

# 5. Criar commit
git commit -m "Atualizar logo e informações de contato no Header e Footer"

# 6. Enviar para GitHub
git push bsimoveisdf main

# 7. Acessar vercel.com para ver o deploy acontecendo
# Seu site estará atualizado em 1-3 minutos!
```

---

## 🆘 Problemas Comuns e Soluções

### "Your branch is behind"
```bash
git pull bsimoveisdf main
# Depois faça o push novamente
git push bsimoveisdf main
```

### "fatal: not a git repository"
```bash
# Você não está na pasta do projeto
cd /home/alex/modelo-site
```

### "Please tell me who you are"
```bash
git config --global user.email "seu@email.com"
git config --global user.name "Seu Nome"
```

### Commitou arquivo errado
```bash
# Desfazer o último commit (mas manter as mudanças)
git reset HEAD~1

# Agora adicione os arquivos corretos e commite novamente
```

### Quer desfazer o último commit completamente
```bash
# CUIDADO: isso apaga as mudanças!
git reset --hard HEAD~1
```

---

## 📱 Atalhos Rápidos

```bash
# Status + Diff em um comando
git status && git diff --stat

# Add + Commit em um comando (só para arquivos já tracked)
git commit -am "mensagem"

# Ver últimos 5 commits de forma resumida
git log -5 --oneline --graph

# Ver o que mudou nos últimos 3 commits
git log -3 -p
```

---

## 🔗 Links Úteis

- **Vercel Dashboard:** https://vercel.com
- **GitHub:** https://github.com/gpropadm/bsimoveisdf
- **Documentação Git:** https://git-scm.com/doc
- **Documentação Vercel:** https://vercel.com/docs

---

## 📝 Notas

- Este projeto está configurado com deploy automático na Vercel
- O repositório principal é: `bsimoveisdf`
- Branch de produção: `main`
- Sempre teste localmente antes de fazer push (`npm run dev`)

---

**Última atualização:** 2025-10-20
**Projeto:** BS Imóveis (modelo-site)
