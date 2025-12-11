// pages/api/upload.js

import { verifyToken } from '../../lib/auth';
import { PrismaClient } from '@prisma/client';
import formidable from 'formidable';
import fs from 'fs';
import path from 'path';

const prisma = new PrismaClient();

// Disable default body parser for file uploads
export const config = {
  api: {
    bodyParser: false,
  },
};

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', ['POST']);
    return res.status(405).end(`Method ${req.method} Not Allowed`);
  }

  const token = req.cookies.token || req.headers.authorization?.replace('Bearer ', '');
  const payload = verifyToken(token);

  if (!payload || !['ADMIN', 'SUPERADMIN'].includes(payload.role)) {
    return res.status(403).json({ error: 'Admin access required' });
  }

  try {
    // Parse form data
    const form = formidable({
      uploadDir: '/tmp',
      keepExtensions: true,
      maxFileSize: 10 * 1024 * 1024, // 10MB
    });

    const [fields, files] = await form.parse(req);
    const file = Array.isArray(files.file) ? files.file[0] : files.file;

    if (!file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }

    // Option 1: Upload to Cloudflare R2
    if (process.env.CLOUDFLARE_R2_ACCESS_KEY_ID) {
      const { S3Client, PutObjectCommand } = await import('@aws-sdk/client-s3');
      
      const s3Client = new S3Client({
        region: 'auto',
        endpoint: `https://${process.env.CLOUDFLARE_ACCOUNT_ID}.r2.cloudflarestorage.com`,
        credentials: {
          accessKeyId: process.env.CLOUDFLARE_R2_ACCESS_KEY_ID,
          secretAccessKey: process.env.CLOUDFLARE_R2_SECRET_ACCESS_KEY,
        },
      });

      const fileBuffer = fs.readFileSync(file.filepath);
      const fileName = `${Date.now()}-${file.originalFilename || 'upload'}`;

      await s3Client.send(
        new PutObjectCommand({
          Bucket: process.env.CLOUDFLARE_R2_BUCKET_NAME,
          Key: fileName,
          Body: fileBuffer,
          ContentType: file.mimetype,
        })
      );

      // Clean up temp file
      fs.unlinkSync(file.filepath);

      const fileUrl = `https://${process.env.CLOUDFLARE_R2_PUBLIC_URL}/${fileName}`;
      return res.json({ url: fileUrl, fileName });
    }

    // Option 2: Upload to AWS S3
    if (process.env.AWS_ACCESS_KEY_ID) {
      const { S3Client, PutObjectCommand } = await import('@aws-sdk/client-s3');
      
      const s3Client = new S3Client({
        region: process.env.AWS_REGION || 'us-east-1',
        credentials: {
          accessKeyId: process.env.AWS_ACCESS_KEY_ID,
          secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
        },
      });

      const fileBuffer = fs.readFileSync(file.filepath);
      const fileName = `${Date.now()}-${file.originalFilename || 'upload'}`;

      await s3Client.send(
        new PutObjectCommand({
          Bucket: process.env.AWS_S3_BUCKET_NAME,
          Key: fileName,
          Body: fileBuffer,
          ContentType: file.mimetype,
        })
      );

      // Clean up temp file
      fs.unlinkSync(file.filepath);

      const fileUrl = `https://${process.env.AWS_S3_BUCKET_NAME}.s3.${process.env.AWS_REGION || 'us-east-1'}.amazonaws.com/${fileName}`;
      return res.json({ url: fileUrl, fileName });
    }

    // Option 3: Local storage (development only)
    const uploadDir = path.join(process.cwd(), 'public', 'uploads');
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }

    const fileName = `${Date.now()}-${file.originalFilename || 'upload'}`;
    const filePath = path.join(uploadDir, fileName);

    fs.copyFileSync(file.filepath, filePath);
    fs.unlinkSync(file.filepath);

    const fileUrl = `/uploads/${fileName}`;
    return res.json({ url: fileUrl, fileName });
  } catch (err) {
    console.error('Upload error:', err);
    return res.status(500).json({ error: 'File upload failed' });
  } finally {
    await prisma.$disconnect();
  }
}

