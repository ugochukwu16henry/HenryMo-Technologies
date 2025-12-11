// lib/email.js

import nodemailer from 'nodemailer';

const createTransporter = () => {
  // Use Gmail SMTP (requires app-specific password)
  // Or use SendGrid/Resend if configured
  if (process.env.SENDGRID_API_KEY) {
    return nodemailer.createTransport({
      service: 'SendGrid',
      auth: {
        user: 'apikey',
        pass: process.env.SENDGRID_API_KEY,
      },
    });
  }

  if (process.env.RESEND_API_KEY) {
    return nodemailer.createTransport({
      host: 'smtp.resend.com',
      port: 465,
      secure: true,
      auth: {
        user: 'resend',
        pass: process.env.RESEND_API_KEY,
      },
    });
  }

  // Gmail SMTP (default)
  return nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL_USER || 'ugochukwuhenry16@gmail.com',
      pass: process.env.EMAIL_PASSWORD, // App-specific password required
    },
  });
};

export const sendEmail = async ({ to, subject, text, html }) => {
  try {
    const transporter = createTransporter();
    
    const mailOptions = {
      from: process.env.EMAIL_FROM || 'ugochukwuhenry16@gmail.com',
      to,
      subject,
      text,
      html,
    };

    const info = await transporter.sendMail(mailOptions);
    console.log('Email sent:', info.messageId);
    return { success: true, messageId: info.messageId };
  } catch (error) {
    console.error('Email sending failed:', error);
    throw error;
  }
};

export const sendInquiryNotification = async ({ name, email, message }) => {
  const subject = `New Contact Form Inquiry from ${name}`;
  const text = `
New inquiry received:

Name: ${name}
Email: ${email}
Message:
${message}

---
Sent from HenryMo Technologies Contact Form
  `.trim();

  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <h2 style="color: #007BFF;">New Contact Form Inquiry</h2>
      <div style="background-color: #f5f5f5; padding: 20px; border-radius: 5px; margin: 20px 0;">
        <p><strong>Name:</strong> ${name}</p>
        <p><strong>Email:</strong> <a href="mailto:${email}">${email}</a></p>
        <p><strong>Message:</strong></p>
        <p style="white-space: pre-wrap; background-color: white; padding: 15px; border-left: 4px solid #007BFF; margin-top: 10px;">
          ${message.replace(/\n/g, '<br>')}
        </p>
      </div>
      <p style="color: #666; font-size: 12px;">
        Sent from HenryMo Technologies Contact Form
      </p>
    </div>
  `;

  return sendEmail({
    to: 'ugochukwuhenry16@gmail.com',
    subject,
    text,
    html,
  });
};

