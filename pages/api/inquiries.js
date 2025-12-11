// pages/api/inquiries.js

import { PrismaClient } from '@prisma/client';
import { sendInquiryNotification } from '../../lib/email';
import { sendInquiryWhatsApp } from '../../lib/whatsapp';

const prisma = new PrismaClient();

export default async function handler(req, res) {
  if (req.method === 'POST') {
    try {
      const { name, email, message } = req.body;

      // Validate required fields
      if (!name || !email || !message) {
        return res.status(400).json({ error: 'Name, email, and message are required.' });
      }

      // Log the inquiry
      console.log('New inquiry received:', { name, email, message, timestamp: new Date() });

      // Send email notification (non-blocking)
      sendInquiryNotification({ name, email, message })
        .then(() => console.log('Email notification sent successfully'))
        .catch((err) => console.error('Failed to send email notification:', err));

      // Send WhatsApp notification (non-blocking)
      sendInquiryWhatsApp({ name, email, message })
        .then((result) => {
          if (result.success) {
            console.log('WhatsApp notification sent successfully');
          } else {
            console.log('WhatsApp notification skipped:', result.error);
          }
        })
        .catch((err) => console.error('Failed to send WhatsApp notification:', err));

      // TODO: Add Inquiry model to Prisma schema and save to database
      // const inquiry = await prisma.inquiry.create({
      //   data: { name, email, message }
      // });

      return res.status(200).json({ 
        success: true, 
        message: 'Inquiry received successfully. We will get back to you soon!' 
      });
    } catch (err) {
      console.error('Error processing inquiry:', err);
      return res.status(500).json({ error: 'Failed to process inquiry.' });
    } finally {
      await prisma.$disconnect();
    }
  }

  res.setHeader('Allow', ['POST']);
  res.status(405).end();
}

