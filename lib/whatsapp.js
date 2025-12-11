// lib/whatsapp.js

import twilio from 'twilio';

let twilioClient = null;

// Initialize Twilio client if credentials are available
if (process.env.TWILIO_ACCOUNT_SID && process.env.TWILIO_AUTH_TOKEN) {
  twilioClient = twilio(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN);
}

export const sendWhatsAppMessage = async ({ to, message }) => {
  // If Twilio is not configured, log the message instead
  if (!twilioClient) {
    console.log('WhatsApp notification (Twilio not configured):', { to, message });
    return { success: false, error: 'WhatsApp service not configured' };
  }

  try {
    // Your Twilio WhatsApp number (format: whatsapp:+14155238886)
    const fromNumber = process.env.TWILIO_WHATSAPP_FROM || 'whatsapp:+14155238886';
    
    // Format the recipient number (must include country code, no +)
    const formattedTo = to.replace(/\+/g, '').replace(/\s/g, '');
    const toNumber = formattedTo.startsWith('whatsapp:') ? formattedTo : `whatsapp:${formattedTo}`;

    const result = await twilioClient.messages.create({
      from: fromNumber,
      to: toNumber,
      body: message,
    });

    console.log('WhatsApp message sent:', result.sid);
    return { success: true, sid: result.sid };
  } catch (error) {
    console.error('WhatsApp sending failed:', error);
    return { success: false, error: error.message };
  }
};

export const sendInquiryWhatsApp = async ({ name, email, message }) => {
  const whatsappMessage = `🚀 New Contact Form Inquiry\n\nName: ${name}\nEmail: ${email}\n\nMessage:\n${message}\n\n---\nFrom HenryMo Technologies Website`;

  return sendWhatsAppMessage({
    to: '+2349015718484',
    message: whatsappMessage,
  });
};

