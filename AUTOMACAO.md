# 🤖 Automações WhatsApp - BS Imóveis DF

## Scripts Disponíveis

### 1️⃣ Lembretes de Visita
**Script:** `scripts/send-appointment-reminders.js`

Envia lembrete automático 1 dia antes da visita agendada.

**Como executar manualmente:**
```bash
node scripts/send-appointment-reminders.js
```

**Configurar para rodar diariamente (Cron):**
```bash
# Editar crontab
crontab -e

# Adicionar linha (executa todo dia às 9h da manhã)
0 9 * * * cd /caminho/para/bsimoveisdf && node scripts/send-appointment-reminders.js >> logs/reminders.log 2>&1
```

---

### 2️⃣ Follow-ups Automáticos
**Script:** `scripts/send-follow-ups.js`

Envia mensagem de follow-up para leads que não responderam em 3 dias.

**Como executar manualmente:**
```bash
node scripts/send-follow-ups.js
```

**Configurar para rodar diariamente (Cron):**
```bash
# Editar crontab
crontab -e

# Adicionar linha (executa todo dia às 10h da manhã)
0 10 * * * cd /caminho/para/bsimoveisdf && node scripts/send-follow-ups.js >> logs/followups.log 2>&1
```

---

## 📋 Funcionalidades Automáticas

### ✅ Já Funcionam Automaticamente (Via API)

1. **Confirmação de Lead**
   - Quando: Cliente preenche formulário de interesse
   - O que faz: Envia confirmação automática via WhatsApp
   - Arquivo: `src/app/api/leads/route.ts`

2. **Confirmação de Agendamento**
   - Quando: Cliente agenda visita
   - O que faz: Envia confirmação da visita via WhatsApp
   - Arquivo: `src/app/api/appointments/book/route.ts`

3. **Alerta de Preço**
   - Quando: Preço de imóvel é reduzido no painel admin
   - O que faz: Avisa automaticamente clientes interessados
   - Arquivo: `src/app/api/admin/properties/[id]/update-price/route.ts`

### 🔄 Precisam de Agendamento (Cron Jobs)

4. **Lembretes de Visita**
   - Quando: 1 dia antes da visita
   - Script: `send-appointment-reminders.js`
   - Agendar: Diariamente às 9h

5. **Follow-ups**
   - Quando: 3 dias após lead sem resposta
   - Script: `send-follow-ups.js`
   - Agendar: Diariamente às 10h

---

## 🚀 Setup Completo

### 1. Criar pasta de logs
```bash
mkdir -p logs
```

### 2. Configurar crontab
```bash
crontab -e
```

Adicionar:
```
# Lembretes de visita - todo dia às 9h
0 9 * * * cd /home/alex/bsimoveisdf && node scripts/send-appointment-reminders.js >> logs/reminders.log 2>&1

# Follow-ups - todo dia às 10h
0 10 * * * cd /home/alex/bsimoveisdf && node scripts/send-follow-ups.js >> logs/followups.log 2>&1
```

### 3. Testar manualmente antes
```bash
node scripts/send-appointment-reminders.js
node scripts/send-follow-ups.js
```

---

## 📊 Monitoramento

### Ver logs de execução:
```bash
# Lembretes
tail -f logs/reminders.log

# Follow-ups
tail -f logs/followups.log
```

### Ver mensagens enviadas no banco:
```sql
SELECT * FROM WhatsAppMessage
WHERE source IN ('appointment_reminder', 'follow_up')
ORDER BY timestamp DESC
LIMIT 10;
```

---

## 💡 Dicas

- Os scripts usam as mesmas variáveis de ambiente do `.env`
- Mensagens são salvas na tabela `WhatsAppMessage` para histórico
- Aguarda 2 segundos entre cada mensagem para não sobrecarregar
- Evita enviar duplicatas verificando histórico no banco
- Todos os envios são logados para auditoria

---

## 🔧 Troubleshooting

**Script não roda:**
- Verifique se o `.env` está configurado
- Confirme que `TWILIO_ACCOUNT_SID`, `TWILIO_AUTH_TOKEN` e `TWILIO_WHATSAPP_NUMBER` estão presentes

**Cron não executa:**
- Verifique os logs: `grep CRON /var/log/syslog`
- Confirme que o caminho absoluto está correto
- Teste o script manualmente primeiro

**Mensagens não chegam:**
- Verifique logs do Twilio no painel deles
- Confirme que números estão no formato correto (+5561999999999)
- Verifique se sandbox do Twilio está ativo
