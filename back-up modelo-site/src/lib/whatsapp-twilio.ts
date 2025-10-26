/**
 * Twilio WhatsApp Integration (via REST API - sem SDK)
 *
 * Custo: ~USD 0.005 por mensagem (~R$ 0.025)
 * Funciona 100% na Vercel
 */

export async function sendWhatsAppMessage(
  phoneNumber: string,
  message: string,
  mediaUrl?: string
): Promise<boolean> {
  try {
    const accountSid = process.env.TWILIO_ACCOUNT_SID;
    const authToken = process.env.TWILIO_AUTH_TOKEN;
    const twilioWhatsAppNumber = process.env.TWILIO_WHATSAPP_NUMBER; // Ex: whatsapp:+14155238886

    console.log('🔍 DEBUG Twilio:');
    console.log('  ACCOUNT_SID:', accountSid ? `${accountSid.substring(0, 10)}...` : '❌ FALTANDO');
    console.log('  AUTH_TOKEN:', authToken ? '✅ Configurado' : '❌ FALTANDO');
    console.log('  WHATSAPP_NUMBER:', twilioWhatsAppNumber || '❌ FALTANDO');

    if (!accountSid || !authToken || !twilioWhatsAppNumber) {
      console.log('⚠️ Variáveis Twilio não configuradas');
      return false;
    }

    // Normalizar número (remove TUDO que não é número)
    let cleanPhone = phoneNumber.replace(/\D/g, '');

    // Se começar com 55, remove para adicionar depois (evita duplicação)
    if (cleanPhone.startsWith('55')) {
      cleanPhone = cleanPhone.substring(2);
    }

    const formattedPhone = '55' + cleanPhone;
    const whatsappNumber = `whatsapp:+${formattedPhone}`;

    console.log('📞 Número original:', phoneNumber);
    console.log('📞 Número limpo:', cleanPhone);
    console.log('📞 Número formatado:', whatsappNumber);

    console.log(`📱 Enviando WhatsApp via Twilio para ${whatsappNumber}...`);

    // Twilio REST API (sem SDK)
    const url = `https://api.twilio.com/2010-04-01/Accounts/${accountSid}/Messages.json`;
    const auth = Buffer.from(`${accountSid}:${authToken}`).toString('base64');

    const params: Record<string, string> = {
      From: twilioWhatsAppNumber,
      To: whatsappNumber,
      Body: message
    };

    // Se tiver imagem, adiciona MediaUrl
    if (mediaUrl) {
      params.MediaUrl = mediaUrl;
      console.log(`📷 Enviando com imagem: ${mediaUrl}`);
    }

    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Authorization': `Basic ${auth}`,
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      body: new URLSearchParams(params)
    });

    if (response.ok) {
      const data = await response.json();
      console.log(`✅ Mensagem enviada via Twilio (SID: ${data.sid})`);
      return true;
    } else {
      const error = await response.text();
      console.error('❌ Erro Twilio:', error);
      return false;
    }

  } catch (error) {
    console.error('❌ Erro ao enviar via Twilio:', error);
    return false;
  }
}

export default {
  sendWhatsAppMessage
};
