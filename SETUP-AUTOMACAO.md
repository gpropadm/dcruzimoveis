# 🤖 Setup de Automações - BS Imóveis DF

## 📋 Opções de Configuração

Você tem **3 opções** para rodar os scripts de lembretes e follow-ups automaticamente:

---

## ✅ OPÇÃO 1: GitHub Actions (RECOMENDADO - GRÁTIS!)

### Vantagens:
- Totalmente grátis
- Não precisa de servidor próprio
- Fácil de configurar
- Já incluído no repositório

### Como configurar:

#### 1. Adicionar secrets no GitHub

Vá em: `https://github.com/gpropadm/bsimoveisdf/settings/secrets/actions`

Adicione os seguintes secrets:

```
DATABASE_URL = sua_database_url_completa
TWILIO_ACCOUNT_SID = seu_account_sid
TWILIO_AUTH_TOKEN = seu_auth_token
TWILIO_WHATSAPP_NUMBER = whatsapp:+14155238886
WHATSAPP_ADMIN_PHONE = 5561996900444
```

#### 2. Ativar GitHub Actions

1. Vá em `https://github.com/gpropadm/bsimoveisdf/actions`
2. Clique em "I understand my workflows, go ahead and enable them"
3. Pronto! Os workflows vão rodar automaticamente:
   - **Lembretes de Visita**: Todo dia às 9h (Brasília)
   - **Follow-ups**: Todo dia às 10h (Brasília)

#### 3. Testar manualmente (opcional)

1. Vá em `https://github.com/gpropadm/bsimoveisdf/actions`
2. Clique em "Enviar Lembretes de Visita" ou "Enviar Follow-ups"
3. Clique em "Run workflow" → "Run workflow"
4. Acompanhe a execução em tempo real

---

## 🖥️ OPÇÃO 2: Servidor Linux/VPS (Cron)

### Se você tem servidor próprio:

#### 1. Conectar no servidor
```bash
ssh usuario@seu-servidor.com
cd /var/www/bsimoveisdf
```

#### 2. Criar pasta de logs
```bash
mkdir -p logs
```

#### 3. Testar scripts manualmente
```bash
node scripts/send-appointment-reminders.js
node scripts/send-follow-ups.js
```

#### 4. Configurar crontab
```bash
crontab -e
```

Adicionar:
```bash
# Lembretes de visita - todo dia às 9h
0 9 * * * cd /var/www/bsimoveisdf && node scripts/send-appointment-reminders.js >> logs/reminders.log 2>&1

# Follow-ups - todo dia às 10h
0 10 * * * cd /var/www/bsimoveisdf && node scripts/send-follow-ups.js >> logs/followups.log 2>&1
```

Salvar: `Ctrl+X` → `Y` → `Enter`

#### 5. Verificar se foi agendado
```bash
crontab -l
```

---

## ☁️ OPÇÃO 3: Vercel Cron Jobs

### Se hospedado na Vercel:

#### 1. Criar arquivo vercel.json
```json
{
  "crons": [
    {
      "path": "/api/cron/send-reminders",
      "schedule": "0 12 * * *"
    },
    {
      "path": "/api/cron/send-followups",
      "schedule": "0 13 * * *"
    }
  ]
}
```

#### 2. Criar rotas API
```typescript
// src/app/api/cron/send-reminders/route.ts
import { NextResponse } from 'next/server';
import { exec } from 'child_process';
import { promisify } from 'util';

const execAsync = promisify(exec);

export async function GET() {
  try {
    const { stdout } = await execAsync('node scripts/send-appointment-reminders.js');
    return NextResponse.json({ success: true, output: stdout });
  } catch (error) {
    return NextResponse.json({ success: false, error }, { status: 500 });
  }
}
```

---

## 🎯 Qual opção escolher?

| Opção | Quando usar | Custo |
|-------|-------------|-------|
| **GitHub Actions** | Qualquer situação (recomendado) | Grátis |
| **Servidor VPS** | Já tem servidor próprio | Custo do servidor |
| **Vercel Cron** | Hospedado na Vercel | Grátis (com limites) |

---

## 📊 Monitoramento

### GitHub Actions:
- Acesse: `https://github.com/gpropadm/bsimoveisdf/actions`
- Veja logs de cada execução
- Receba email se falhar

### Servidor Linux:
```bash
# Ver logs de lembretes
tail -f logs/reminders.log

# Ver logs de follow-ups
tail -f logs/followups.log
```

---

## 🔧 Troubleshooting

### GitHub Actions não roda:
1. Verificar se Actions estão habilitadas
2. Confirmar que secrets estão configurados
3. Verificar logs de execução

### Cron no servidor não funciona:
```bash
# Ver logs do cron
grep CRON /var/log/syslog

# Testar script manualmente
node scripts/send-appointment-reminders.js
```

### Mensagens não chegam:
1. Verificar logs no Twilio: https://console.twilio.com/
2. Confirmar que `DATABASE_URL` está correto
3. Verificar se números estão no formato correto

---

## ⏰ Horários (Brasília - UTC-3)

- **Lembretes de Visita**: 9h da manhã
- **Follow-ups**: 10h da manhã

Para alterar, edite os arquivos `.github/workflows/*.yml`

```yaml
# Exemplo: mudar para 8h
- cron: '0 11 * * *'  # 8h Brasília = 11h UTC
```

---

## 📞 Suporte

Dúvidas? Verifique os logs de execução primeiro!

- GitHub Actions: aba "Actions" no repositório
- Servidor: arquivos em `logs/`
- Twilio: https://console.twilio.com/
