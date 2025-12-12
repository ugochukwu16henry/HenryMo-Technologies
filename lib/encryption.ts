// lib/encryption.ts

import crypto from 'crypto';

const ALGORITHM = 'aes-256-gcm';
const KEY_LENGTH = 32; // 256 bits
const IV_LENGTH = 16; // 128 bits
// TAG_LENGTH is implicitly 16 bytes for GCM mode - defined by algorithm

// Get encryption key from environment or generate one
function getEncryptionKey(): Buffer {
  const key = process.env.ENCRYPTION_KEY;
  if (!key) {
    throw new Error('ENCRYPTION_KEY is not set in environment variables.');
  }
  
  // If key is hex string, convert to buffer
  if (key.length === 64) {
    return Buffer.from(key, 'hex');
  }
  
  // Otherwise, derive key from password using PBKDF2
  const salt = process.env.ENCRYPTION_SALT || 'default-salt-change-in-production';
  return crypto.pbkdf2Sync(key, salt, 100000, KEY_LENGTH, 'sha512');
}

/**
 * Encrypts a string value
 */
export function encrypt(text: string): string {
  const key = getEncryptionKey();
  const iv = crypto.randomBytes(IV_LENGTH);
  
  const cipher = crypto.createCipheriv(ALGORITHM, key, iv);
  
  let encrypted = cipher.update(text, 'utf8', 'hex');
  encrypted += cipher.final('hex');
  
  const tag = cipher.getAuthTag();
  
  // Return iv:tag:encrypted as hex strings
  return `${iv.toString('hex')}:${tag.toString('hex')}:${encrypted}`;
}

/**
 * Decrypts an encrypted string
 */
export function decrypt(encryptedData: string): string {
  const key = getEncryptionKey();
  const parts = encryptedData.split(':');
  
  if (parts.length !== 3) {
    throw new Error('Invalid encrypted data format');
  }
  
  const iv = Buffer.from(parts[0], 'hex');
  const tag = Buffer.from(parts[1], 'hex');
  const encrypted = parts[2];
  
  const decipher = crypto.createDecipheriv(ALGORITHM, key, iv);
  decipher.setAuthTag(tag);
  
  let decrypted = decipher.update(encrypted, 'hex', 'utf8');
  decrypted += decipher.final('utf8');
  
  return decrypted;
}

/**
 * AWS KMS encryption (if AWS credentials are available)
 */
export async function encryptWithKMS(text: string, _kmsKeyId?: string): Promise<string> {
  // This requires AWS SDK - uncomment if using AWS KMS
  /*
  const AWS = require('aws-sdk');
  const kms = new AWS.KMS({ region: process.env.AWS_REGION || 'us-east-1' });
  
  const keyId = kmsKeyId || process.env.AWS_KMS_KEY_ID;
  if (!keyId) {
    throw new Error('AWS_KMS_KEY_ID is not set');
  }
  
  const params = {
    KeyId: keyId,
    Plaintext: text,
  };
  
  const result = await kms.encrypt(params).promise();
  return result.CiphertextBlob.toString('base64');
  */
  
  // Fallback to AES encryption if KMS not configured
  return encrypt(text);
}

/**
 * AWS KMS decryption
 */
export async function decryptWithKMS(encryptedData: string): Promise<string> {
  // This requires AWS SDK - uncomment if using AWS KMS
  /*
  const AWS = require('aws-sdk');
  const kms = new AWS.KMS({ region: process.env.AWS_REGION || 'us-east-1' });
  
  const params = {
    CiphertextBlob: Buffer.from(encryptedData, 'base64'),
  };
  
  const result = await kms.decrypt(params).promise();
  return result.Plaintext.toString('utf8');
  */
  
  // Fallback to AES decryption if KMS not configured
  return decrypt(encryptedData);
}

