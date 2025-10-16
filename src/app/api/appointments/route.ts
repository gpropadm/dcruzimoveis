import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { sendWhatsAppMessage } from '@/lib/whatsapp-twilio';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const propertyId = searchParams.get('propertyId');
    const date = searchParams.get('date');

    if (propertyId && date) {
      // Buscar agendamentos para um imóvel específico em uma data
      const appointments = await prisma.appointment.findMany({
        where: {
          propertyId,
          scheduledDate: {
            gte: new Date(`${date}T00:00:00`),
            lte: new Date(`${date}T23:59:59`)
          },
          status: {
            not: 'cancelado'
          }
        },
        include: {
          property: {
            select: {
              title: true,
              address: true
            }
          }
        },
        orderBy: {
          scheduledDate: 'asc'
        }
      });

      return NextResponse.json(appointments);
    }

    // Buscar todos os agendamentos (para admin)
    const appointments = await prisma.appointment.findMany({
      include: {
        property: {
          select: {
            title: true,
            address: true,
            slug: true
          }
        }
      },
      orderBy: {
        scheduledDate: 'desc'
      }
    });

    return NextResponse.json(appointments);
  } catch (error) {
    console.error('Erro ao buscar agendamentos:', error);
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      propertyId,
      clientName,
      clientEmail,
      clientPhone,
      scheduledDate,
      duration = 60
    } = body;

    // Validações básicas
    if (!propertyId || !clientName || !clientEmail || !clientPhone || !scheduledDate) {
      return NextResponse.json(
        { error: 'Dados obrigatórios faltando' },
        { status: 400 }
      );
    }

    // Verificar se o imóvel existe
    const property = await prisma.property.findUnique({
      where: { id: propertyId }
    });

    if (!property) {
      return NextResponse.json(
        { error: 'Imóvel não encontrado' },
        { status: 404 }
      );
    }

    // Verificar disponibilidade do horário
    const appointmentDate = new Date(scheduledDate);
    const endTime = new Date(appointmentDate.getTime() + duration * 60000);
    
    const conflictingAppointments = await prisma.appointment.findMany({
      where: {
        propertyId,
        status: {
          not: 'cancelado'
        },
        OR: [
          {
            AND: [
              { scheduledDate: { lte: appointmentDate } },
              { scheduledDate: { gte: new Date(appointmentDate.getTime() - 60 * 60000) } }
            ]
          },
          {
            AND: [
              { scheduledDate: { gte: appointmentDate } },
              { scheduledDate: { lte: endTime } }
            ]
          }
        ]
      }
    });

    if (conflictingAppointments.length > 0) {
      return NextResponse.json(
        { error: 'Horário não disponível' },
        { status: 409 }
      );
    }

    // Criar ou buscar lead
    let lead = await prisma.lead.findFirst({
      where: {
        email: clientEmail,
        propertyId
      }
    });

    if (!lead) {
      lead = await prisma.lead.create({
        data: {
          name: clientName,
          email: clientEmail,
          phone: clientPhone,
          propertyId,
          propertyTitle: property.title,
          propertyPrice: property.price,
          propertyType: property.type,
          source: 'agendamento_visita',
          status: 'interessado'
        }
      });
    }

    // Criar agendamento
    const appointment = await prisma.appointment.create({
      data: {
        propertyId,
        leadId: lead.id,
        clientName,
        clientEmail,
        clientPhone,
        scheduledDate: appointmentDate,
        duration,
        status: 'agendado'
      },
      include: {
        property: {
          select: {
            title: true,
            address: true,
            slug: true
          }
        }
      }
    });

    // Enviar notificação via WhatsApp usando Twilio (igual ao de leads)
    try {
      const phoneAdmin = process.env.WHATSAPP_ADMIN_PHONE || '5561996900444';

      const formattedDate = new Intl.DateTimeFormat('pt-BR', {
        dateStyle: 'full',
        timeStyle: 'short'
      }).format(appointmentDate);

      const whatsappMessage = `🏠 *NOVA VISITA AGENDADA*

📋 Imóvel: ${property.title}
📍 Endereço: ${property.address}

👤 Cliente: ${clientName}
📞 Telefone: ${clientPhone}
📧 Email: ${clientEmail}

📅 Data/Hora: ${formattedDate}
⏱️ Duração: ${duration} minutos

🔗 Ver imóvel: ${process.env.NEXT_PUBLIC_BASE_URL || 'https://imobiliaria-six-tau.vercel.app'}/imovel/${property.slug}

🆔 Agendamento ID: ${appointment.id}`;

      // Enviar via Twilio
      const sent = await sendWhatsAppMessage(phoneAdmin, whatsappMessage);

      if (sent) {
        console.log('✅ WhatsApp de agendamento enviado via Twilio');

        // Salvar mensagem no banco
        await prisma.whatsAppMessage.create({
          data: {
            messageId: `appointment-${Date.now()}`,
            from: 'twilio',
            to: phoneAdmin,
            body: whatsappMessage,
            type: 'text',
            timestamp: new Date(),
            fromMe: true,
            status: 'sent',
            source: 'twilio_api',
            propertyId: propertyId,
            contactName: clientName
          }
        });
      } else {
        console.log('❌ Falha ao enviar WhatsApp de agendamento via Twilio');
      }
    } catch (whatsappError) {
      console.error('❌ Erro ao enviar notificação WhatsApp:', whatsappError);
      // Não falhar a requisição se o WhatsApp falhar
    }

    return NextResponse.json(appointment, { status: 201 });
  } catch (error) {
    console.error('Erro ao criar agendamento:', error);
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    );
  }
}