/**
 * Script para enviar follow-ups automáticos
 * Envia mensagens para leads que não responderam em 3 dias
 *
 * Uso: node scripts/send-follow-ups.js
 * Ou configure um cron job para rodar diariamente
 */

require('dotenv').config({ path: '.env' });
const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function sendWhatsAppMessage(phoneNumber, message) {
  try {
    const accountSid = process.env.TWILIO_ACCOUNT_SID;
    const authToken = process.env.TWILIO_AUTH_TOKEN;
    const twilioWhatsAppNumber = process.env.TWILIO_WHATSAPP_NUMBER;

    if (!accountSid || !authToken || !twilioWhatsAppNumber) {
      console.log('⚠️ Variáveis Twilio não configuradas');
      return false;
    }

    // Normalizar número
    let cleanPhone = phoneNumber.replace(/\D/g, '');

    // Se começar com 55, remove para adicionar depois
    if (cleanPhone.startsWith('55')) {
      cleanPhone = cleanPhone.substring(2);
    }

    const formattedPhone = '55' + cleanPhone;
    const whatsappNumber = `whatsapp:+${formattedPhone}`;

    const url = `https://api.twilio.com/2010-04-01/Accounts/${accountSid}/Messages.json`;
    const auth = Buffer.from(`${accountSid}:${authToken}`).toString('base64');

    const params = new URLSearchParams({
      From: twilioWhatsAppNumber,
      To: whatsappNumber,
      Body: message
    });

    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Authorization': `Basic ${auth}`,
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      body: params
    });

    if (response.ok) {
      const data = await response.json();
      console.log(`✅ Mensagem enviada (SID: ${data.sid})`);
      return true;
    } else {
      const error = await response.text();
      console.error('❌ Erro Twilio:', error);
      return false;
    }
  } catch (error) {
    console.error('❌ Erro ao enviar:', error);
    return false;
  }
}

async function sendFollowUps() {
  console.log('🔔 Iniciando envio de follow-ups...\n');

  try {
    // Buscar leads criados há 3 dias que não têm follow-up
    const threeDaysAgo = new Date();
    threeDaysAgo.setDate(threeDaysAgo.getDate() - 3);
    threeDaysAgo.setHours(0, 0, 0, 0);

    const fourDaysAgo = new Date(threeDaysAgo);
    fourDaysAgo.setDate(fourDaysAgo.getDate() - 1);

    const leads = await prisma.lead.findMany({
      where: {
        createdAt: {
          gte: fourDaysAgo,
          lt: threeDaysAgo
        },
        status: 'novo' // Apenas leads que ainda não foram convertidos
      },
      include: {
        property: {
          select: {
            title: true,
            price: true,
            city: true,
            propertyType: true
          }
        }
      }
    });

    console.log(`📋 Encontrados ${leads.length} leads para follow-up\n`);

    if (leads.length === 0) {
      console.log('✅ Nenhum lead pendente de follow-up.');
      return;
    }

    const settings = await prisma.settings.findFirst();
    const siteName = settings?.siteName || 'BS Imóveis DF';
    const sitePhone = settings?.whatsappNumber || process.env.WHATSAPP_ADMIN_PHONE;

    for (const lead of leads) {
      // Verificar se já enviamos follow-up para este lead
      const existingFollowUp = await prisma.whatsAppMessage.findFirst({
        where: {
          to: lead.phone,
          source: 'follow_up',
          timestamp: {
            gte: fourDaysAgo
          }
        }
      });

      if (existingFollowUp) {
        console.log(`⏭️ Follow-up já enviado para ${lead.name}\n`);
        continue;
      }

      const propertyTitle = lead.property?.title || 'o imóvel';
      const propertyPrice = lead.property?.price
        ? new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(lead.property.price)
        : '';

      const followUpMessage = `Olá ${lead.name}! 👋

Vi que você demonstrou interesse em ${propertyTitle}${propertyPrice ? ` por ${propertyPrice}` : ''}.

Ainda está procurando imóvel? 🏠

Posso te ajudar com:
✅ Mais informações sobre este imóvel
✅ Agendar uma visita
✅ Mostrar opções similares
✅ Condições especiais de pagamento

Responda esta mensagem e vamos conversar! 😊

📱 ${sitePhone}
${siteName}`;

      console.log(`📱 Enviando follow-up para ${lead.name} (${lead.phone})...`);

      const sent = await sendWhatsAppMessage(lead.phone, followUpMessage);

      if (sent) {
        // Salvar follow-up no banco
        await prisma.whatsAppMessage.create({
          data: {
            messageId: `followup-${Date.now()}`,
            from: 'twilio',
            to: lead.phone,
            body: followUpMessage,
            type: 'text',
            timestamp: new Date(),
            fromMe: true,
            status: 'sent',
            source: 'follow_up',
            contactName: lead.name
          }
        });

        console.log(`✅ Follow-up enviado para ${lead.name}\n`);
      } else {
        console.log(`❌ Falha ao enviar follow-up para ${lead.name}\n`);
      }

      // Aguardar 2 segundos entre mensagens
      await new Promise(resolve => setTimeout(resolve, 2000));
    }

    console.log('\n🎉 Processo de follow-ups concluído!');

  } catch (error) {
    console.error('❌ Erro ao enviar follow-ups:', error);
  } finally {
    await prisma.$disconnect();
  }
}

// Executar
sendFollowUps();
