/**
 * Script para enviar lembretes de visitas agendadas
 * Envia lembrete 1 dia antes da visita
 *
 * Uso: node scripts/send-appointment-reminders.js
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

async function sendReminders() {
  console.log('🔔 Iniciando envio de lembretes de visitas...\n');

  try {
    // Buscar visitas agendadas para amanhã
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    tomorrow.setHours(0, 0, 0, 0);

    const dayAfterTomorrow = new Date(tomorrow);
    dayAfterTomorrow.setDate(dayAfterTomorrow.getDate() + 1);

    const appointments = await prisma.appointment.findMany({
      where: {
        scheduledDate: {
          gte: tomorrow,
          lt: dayAfterTomorrow
        },
        status: 'agendado'
      },
      include: {
        property: {
          select: {
            title: true,
            address: true,
            city: true
          }
        }
      }
    });

    console.log(`📋 Encontradas ${appointments.length} visitas agendadas para amanhã\n`);

    if (appointments.length === 0) {
      console.log('✅ Nenhuma visita agendada para amanhã.');
      return;
    }

    const settings = await prisma.settings.findFirst();
    const siteName = settings?.siteName || 'BS Imóveis DF';
    const sitePhone = settings?.whatsappNumber || process.env.WHATSAPP_ADMIN_PHONE;

    for (const appointment of appointments) {
      const formattedDate = appointment.scheduledDate.toLocaleDateString('pt-BR');
      const formattedTime = appointment.scheduledDate.toLocaleTimeString('pt-BR', {
        hour: '2-digit',
        minute: '2-digit'
      });

      const propertyTitle = appointment.property?.title || 'Imóvel agendado';
      const propertyAddress = appointment.property?.address || 'Endereço será informado';

      const reminderMessage = `🔔 Lembrete de Visita

Olá ${appointment.clientName}!

Sua visita ao imóvel está agendada para AMANHÃ:

📅 Data: ${formattedDate}
⏰ Horário: ${formattedTime}
🏠 Imóvel: ${propertyTitle}
📍 Local: ${propertyAddress}

Nos vemos lá! 😊

Dúvidas? Entre em contato:
📱 ${sitePhone}

${siteName}`;

      console.log(`📱 Enviando lembrete para ${appointment.clientName} (${appointment.clientPhone})...`);

      const sent = await sendWhatsAppMessage(appointment.clientPhone, reminderMessage);

      if (sent) {
        // Salvar lembrete enviado no banco
        await prisma.whatsAppMessage.create({
          data: {
            messageId: `reminder-${Date.now()}`,
            from: 'twilio',
            to: appointment.clientPhone,
            body: reminderMessage,
            type: 'text',
            timestamp: new Date(),
            fromMe: true,
            status: 'sent',
            source: 'appointment_reminder',
            contactName: appointment.clientName
          }
        });

        console.log(`✅ Lembrete enviado para ${appointment.clientName}\n`);
      } else {
        console.log(`❌ Falha ao enviar lembrete para ${appointment.clientName}\n`);
      }

      // Aguardar 2 segundos entre mensagens para não sobrecarregar
      await new Promise(resolve => setTimeout(resolve, 2000));
    }

    console.log('\n🎉 Processo de lembretes concluído!');

  } catch (error) {
    console.error('❌ Erro ao enviar lembretes:', error);
  } finally {
    await prisma.$disconnect();
  }
}

// Executar
sendReminders();
