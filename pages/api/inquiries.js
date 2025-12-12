// pages/api/inquiries.js

import { PrismaClient } from '@prisma/client';
import { verifyToken } from '../../lib/auth';
import { sendInquiryNotification } from '../../lib/email';
import { sendInquiryWhatsApp } from '../../lib/whatsapp';

const prisma = new PrismaClient();

function requireAdmin(req, res) {
  const token = req.cookies.token || req.headers.authorization?.replace('Bearer ', '');
  const payload = verifyToken(token);

  if (!payload || !['ADMIN', 'SUPERADMIN'].includes(payload.role)) {
    res.status(403).json({ error: 'Admin access required.' });
    return false;
  }
  return true;
}

export default async function handler(req, res) {
  try {
    if (req.method === 'POST') {
      // Public endpoint - anyone can submit inquiries
      const { name, email, message } = req.body;

      // Validate required fields
      if (!name || !email || !message) {
        return res.status(400).json({ error: 'Name, email, and message are required.' });
      }

      // Save to database
      let inquiry;
      try {
        inquiry = await prisma.inquiry.create({
          data: { name, email, message }
        });
      } catch (dbError) {
        console.error('Database error creating inquiry:', dbError);
        // If the model doesn't exist in Prisma Client, provide a helpful error
        if (dbError.code === 'P2001' || dbError.message?.includes('model') || dbError.message?.includes('Inquiry')) {
          return res.status(500).json({ 
            error: 'Database model not found. Please restart the server after running: npm run prisma:generate'
          });
        }
        throw dbError; // Re-throw if it's a different error
      }

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

      return res.status(200).json({ 
        success: true, 
        message: 'Inquiry received successfully. We will get back to you soon!' 
      });
    }

    if (req.method === 'GET') {
      // Admin only - list all inquiries
      if (!requireAdmin(req, res)) return;

      const inquiries = await prisma.inquiry.findMany({
        orderBy: { createdAt: 'desc' }
      });

      return res.json(inquiries);
    }

    if (req.method === 'PUT') {
      // Admin only - update inquiry status
      if (!requireAdmin(req, res)) return;

      const { id, status } = req.body;

      if (!id || !status) {
        return res.status(400).json({ error: 'ID and status are required.' });
      }

      const validStatuses = ['NEW', 'READ', 'IN_PROGRESS', 'RESOLVED'];
      if (!validStatuses.includes(status)) {
        return res.status(400).json({ error: 'Invalid status.' });
      }

      const inquiry = await prisma.inquiry.update({
        where: { id: Number(id) },
        data: { status }
      });

      return res.json(inquiry);
    }

    if (req.method === 'DELETE') {
      // Admin only - delete inquiry
      if (!requireAdmin(req, res)) return;

      const { id } = req.body;
      await prisma.inquiry.delete({ where: { id: Number(id) } });
      return res.json({ success: true });
    }

    res.setHeader('Allow', ['GET', 'POST', 'PUT', 'DELETE']);
    res.status(405).end();
  } catch (err) {
    console.error('Error processing inquiry:', err);
    console.error('Error details:', {
      message: err.message,
      code: err.code,
      meta: err.meta
    });
    return res.status(500).json({ 
      error: 'Failed to process inquiry.',
      details: process.env.NODE_ENV === 'development' ? err.message : undefined
    });
  } finally {
    await prisma.$disconnect();
  }
}

