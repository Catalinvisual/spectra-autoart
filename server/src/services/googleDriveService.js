import { google } from 'googleapis';
import fs from 'fs';
import path from 'path';

class GoogleDriveService {
  constructor() {
    // Clean the private key by removing quotes and fixing newlines
    let privateKey = process.env.GOOGLE_PRIVATE_KEY || '';
    
    // Remove surrounding quotes if present
    privateKey = privateKey.replace(/^["']|["']$/g, '');
    
    // Fix newlines - handle both \n and actual newline characters
    privateKey = privateKey.replace(/\\n/g, '\n');
    
    // Ensure proper PEM format
    if (!privateKey.includes('-----BEGIN PRIVATE KEY-----')) {
      privateKey = '-----BEGIN PRIVATE KEY-----\n' + privateKey;
    }
    if (!privateKey.includes('-----END PRIVATE KEY-----')) {
      privateKey = privateKey + '\n-----END PRIVATE KEY-----';
    }
    
    this.auth = new google.auth.GoogleAuth({
      credentials: {
        client_email: process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL,
        private_key: privateKey,
      },
      scopes: ['https://www.googleapis.com/auth/drive.file'],
    });
    
    this.drive = google.drive({ version: 'v3', auth: this.auth });
  }

  async uploadImage(imagePath, imageName, folderId = process.env.GOOGLE_DRIVE_FOLDER_ID) {
    try {
      // Check if folderId is provided
      if (!folderId) {
        throw new Error('Google Drive folder ID is not configured');
      }

      const fileMetadata = {
        name: imageName,
        parents: [folderId],
        // Use shared drive support
        driveId: folderId,
        supportsAllDrives: true,
      };

      const media = {
        mimeType: 'image/jpeg',
        body: fs.createReadStream(imagePath),
      };

      const file = await this.drive.files.create({
        resource: fileMetadata,
        media: media,
        fields: 'id',
        supportsAllDrives: true,
      });

      const fileId = file.data.id;

      // Set file as public
      await this.drive.permissions.create({
        fileId: fileId,
        requestBody: {
          role: 'reader',
          type: 'anyone',
        },
        supportsAllDrives: true,
      });

      const publicLink = `https://drive.google.com/uc?id=${fileId}`;
      console.log('✅ Image uploaded to Google Drive:', publicLink);
      
      return {
        id: fileId,
        url: publicLink,
        success: true
      };
    } catch (error) {
      console.error('❌ Error uploading to Google Drive:', error);
      
      // Handle specific Google Drive errors
      if (error.code === 403 && error.errors?.[0]?.reason === 'storageQuotaExceeded') {
        return {
          success: false,
          error: 'Google Drive storage quota exceeded. Please check your Google Drive storage or use a shared drive.',
          originalError: error.message
        };
      }
      
      return {
        success: false,
        error: error.message
      };
    }
  }

  async deleteImage(fileId) {
    try {
      await this.drive.files.delete({
        fileId: fileId,
      });
      
      console.log('✅ Image deleted from Google Drive:', fileId);
      return { success: true };
    } catch (error) {
      console.error('❌ Error deleting from Google Drive:', error);
      return { success: false, error: error.message };
    }
  }

  async uploadImageFromBuffer(buffer, imageName, mimeType = 'image/jpeg') {
    try {
      // Create temporary file from buffer
      const tempPath = path.join('uploads', 'temp', `temp-${Date.now()}-${imageName}`);
      
      // Ensure temp directory exists
      const tempDir = path.dirname(tempPath);
      if (!fs.existsSync(tempDir)) {
        fs.mkdirSync(tempDir, { recursive: true });
      }
      
      fs.writeFileSync(tempPath, buffer);
      
      const result = await this.uploadImage(tempPath, imageName);
      
      // Clean up temp file
      try {
        fs.unlinkSync(tempPath);
      } catch (cleanupError) {
        console.warn('⚠️ Could not delete temp file:', cleanupError.message);
      }
      
      return result;
    } catch (error) {
      console.error('❌ Error uploading from buffer:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }

  extractFileIdFromUrl(url) {
    const match = url.match(/id=([a-zA-Z0-9_-]+)/);
    return match ? match[1] : null;
  }
}

export default new GoogleDriveService();