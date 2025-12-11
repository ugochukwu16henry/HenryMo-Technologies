# Contact Form Setup Guide

The contact form now sends notifications to your email and WhatsApp when someone submits a message.

## ✅ What's Configured

- **Email notifications** → `ugochukwuhenry16@gmail.com`
- **WhatsApp notifications** → `+2349015718484`

## 📧 Email Setup (Required)

You have 3 options for email:

### Option 1: Gmail SMTP (Recommended - Easiest)

1. **Enable 2-Factor Authentication** on your Gmail account
2. **Generate an App Password**:
   - Go to: https://myaccount.google.com/apppasswords
   - Select "Mail" and "Other (Custom name)"
   - Enter "HenryMo Contact Form"
   - Copy the 16-character password
3. **Add to your `.env` file**:
   ```env
   EMAIL_USER="ugochukwuhenry16@gmail.com"
   EMAIL_PASSWORD="your-16-character-app-password"
   EMAIL_FROM="ugochukwuhenry16@gmail.com"
   ```

### Option 2: SendGrid

1. Sign up at https://sendgrid.com
2. Create an API key
3. Add to `.env`:
   ```env
   SENDGRID_API_KEY="your-sendgrid-api-key"
   EMAIL_FROM="ugochukwuhenry16@gmail.com"
   ```

### Option 3: Resend

1. Sign up at https://resend.com
2. Create an API key
3. Add to `.env`:
   ```env
   RESEND_API_KEY="your-resend-api-key"
   EMAIL_FROM="ugochukwuhenry16@gmail.com"
   ```

## 📱 WhatsApp Setup (Optional)

To enable WhatsApp notifications, you need a Twilio account:

1. **Sign up** at https://www.twilio.com (free trial available)
2. **Get your credentials** from https://www.twilio.com/console
3. **Activate WhatsApp Sandbox** (for testing) or use production number
4. **Add to your `.env` file**:
   ```env
   TWILIO_ACCOUNT_SID="your-account-sid"
   TWILIO_AUTH_TOKEN="your-auth-token"
   TWILIO_WHATSAPP_FROM="whatsapp:+14155238886"  # Twilio WhatsApp number
   ```

**Note**: If WhatsApp is not configured, the system will still work and just log the message instead of sending WhatsApp notification.

## 🚀 Installation

1. **Install required packages**:
   ```bash
   npm install nodemailer twilio
   ```

2. **Configure your `.env` file** (copy from `env.example` and fill in values)

3. **Restart your server**:
   ```bash
   npm run dev
   ```

## 🧪 Testing

1. Go to `/contact` page
2. Fill out the contact form
3. Submit it
4. Check your email (`ugochukwuhenry16@gmail.com`)
5. Check your WhatsApp (`+2349015718484`) if configured

## 📝 What Gets Sent

When someone submits the contact form, you'll receive:

**Email:**
- Subject: "New Contact Form Inquiry from [Name]"
- Contains: Name, Email, and Message

**WhatsApp:**
- Message with inquiry details formatted for easy reading

Both notifications are sent asynchronously (non-blocking), so the form submission remains fast even if email/WhatsApp delivery takes a moment.

