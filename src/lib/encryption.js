import crypto from 'crypto';

const RAW_KEY = "9d6a48362ac31fd73e77be8ac4ee64d1"
const ENCRYPTION_KEY = crypto.createHash('sha256').update(RAW_KEY).digest();

export function encryptData(text) {
    try {
        const iv = crypto.randomBytes(16);
        const cipher = crypto.createCipheriv(
            'aes-256-cbc',
            ENCRYPTION_KEY,
            iv
        );
        let encrypted = cipher.update(text);
        encrypted = Buffer.concat([encrypted, cipher.final()]);
        return `${iv.toString('hex')}:${encrypted.toString('hex')}`;
    } catch (error) {
        throw error;
    }
}

export function decryptData(text) {
    try {
        const textParts = text.split(':');
        const iv = Buffer.from(textParts.shift(), 'hex');
        const encryptedText = Buffer.from(textParts.join(':'), 'hex');
        const decipher = crypto.createDecipheriv(
            'aes-256-cbc',
            ENCRYPTION_KEY,
            iv
        );
        let decrypted = decipher.update(encryptedText);
        decrypted = Buffer.concat([decrypted, decipher.final()]);
        return decrypted.toString();
    } catch {
        return null;
    }
}