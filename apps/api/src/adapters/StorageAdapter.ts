import fs from 'fs';
import path from 'path';

const UPLOAD_DIR = path.join(__dirname, '../../../uploads');

// Ensure upload directory exists
if (!fs.existsSync(UPLOAD_DIR)) {
  fs.mkdirSync(UPLOAD_DIR, { recursive: true });
}

export const StorageAdapter = {
  saveFile: async (file: Express.Multer.File): Promise<string> => {
    const filename = `${Date.now()}-${file.originalname}`;
    const filepath = path.join(UPLOAD_DIR, filename);
    
    // In a real app with S3, this would be an S3 upload call.
    // For local MVP, multer already saves it to memory or disk.
    // If using multer.memoryStorage, we write it here:
    fs.writeFileSync(filepath, file.buffer);
    
    return filename; // Return an object key/reference
  },
  
  getFileUrl: (filename: string): string => {
    // In MVP, we might serve this via a static route, or return a mock URL
    return `/uploads/${filename}`;
  }
};
