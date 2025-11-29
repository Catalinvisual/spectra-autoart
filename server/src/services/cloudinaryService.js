import cloudinary from 'cloudinary';
import fs from 'fs';

class CloudinaryService {
  constructor() {
    console.log('☁️ Cloudinary service initialized');
    this.configured = false;
  }

  ensureConfigured() {
    if (!this.configured) {
      const config = {
        cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
        api_key: process.env.CLOUDINARY_API_KEY,
        api_secret: process.env.CLOUDINARY_API_SECRET,
      };

      console.log('🔧 Configuring Cloudinary:', {
        cloud_name: config.cloud_name,
        api_key: config.api_key ? '***' + config.api_key.slice(-4) : 'MISSING',
        api_secret: config.api_secret ? '***' + config.api_secret.slice(-4) : 'MISSING'
      });

      if (!config.cloud_name || !config.api_key || !config.api_secret) {
        throw new Error('Cloudinary configuration missing. Please check CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, and CLOUDINARY_API_SECRET environment variables.');
      }

      cloudinary.v2.config(config);
      this.configured = true;
    }
  }

  async uploadImage(imagePath, imageName, options = {}) {
    try {
      this.ensureConfigured();
      console.log(`📤 Uploading ${imageName} to Cloudinary...`);
      
      // Opțiuni default pentru optimizare
      const uploadOptions = {
        folder: 'spectra-autoart/gallery', // Organizare în foldere
        public_id: imageName.replace(/\.[^/.]+$/, ""), // Fără extensie
        resource_type: 'image',
        overwrite: true,
        invalidate: true,
        ...options
      };

      const result = await cloudinary.v2.uploader.upload(imagePath, uploadOptions);
      
      console.log(`✅ Image uploaded to Cloudinary:`);
      console.log(`📋 URL: ${result.secure_url}`);
      console.log(`📋 Public ID: ${result.public_id}`);
      console.log(`📋 Width: ${result.width}px`);
      console.log(`📋 Height: ${result.height}px`);
      console.log(`📋 Format: ${result.format}`);

      return {
        success: true,
        fileId: result.public_id,
        webViewLink: result.secure_url,
        webContentLink: result.secure_url,
        name: imageName,
        width: result.width,
        height: result.height,
        format: result.format,
        bytes: result.bytes,
        cloudinaryData: result
      };
    } catch (error) {
      console.error('❌ Cloudinary upload error:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }

  async uploadImageFromBuffer(buffer, imageName, mimeType = 'image/jpeg', options = {}) {
    try {
      this.ensureConfigured();
      console.log(`📤 Uploading buffer ${imageName} to Cloudinary...`);
      
      // Opțiuni pentru upload din buffer
      const uploadOptions = {
        folder: 'spectra-autoart/gallery',
        public_id: imageName.replace(/\.[^/.]+$/, ""),
        resource_type: 'image',
        overwrite: true,
        invalidate: true,
        ...options
      };

      return new Promise((resolve, reject) => {
        cloudinary.v2.uploader.upload_stream(uploadOptions, (error, result) => {
          if (error) {
            console.error('❌ Cloudinary buffer upload error:', error);
            reject({
              success: false,
              error: error.message
            });
          } else {
            console.log(`✅ Buffer uploaded to Cloudinary:`);
            console.log(`📋 URL: ${result.secure_url}`);
            console.log(`📋 Public ID: ${result.public_id}`);
            
            resolve({
              success: true,
              fileId: result.public_id,
              webViewLink: result.secure_url,
              webContentLink: result.secure_url,
              name: imageName,
              width: result.width,
              height: result.height,
              format: result.format,
              bytes: result.bytes,
              cloudinaryData: result
            });
          }
        }).end(buffer);
      });
    } catch (error) {
      console.error('❌ Cloudinary buffer upload error:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }

  async deleteImage(publicId) {
    try {
      this.ensureConfigured();
      console.log(`🗑️ Deleting image from Cloudinary: ${publicId}`);
      
      const result = await cloudinary.v2.uploader.destroy(publicId);
      
      if (result.result === 'ok') {
        console.log(`✅ Image deleted successfully: ${publicId}`);
        return {
          success: true,
          message: 'Image deleted successfully'
        };
      } else {
        console.log(`⚠️ Cloudinary delete result: ${result.result}`);
        return {
          success: false,
          error: result.result
        };
      }
    } catch (error) {
      console.error('❌ Cloudinary delete error:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }

  // Transformă URL-ul Cloudinary pentru diferite dimensiuni
  getTransformedUrl(secureUrl, transformation = '') {
    if (!secureUrl) return null;
    
    // Exemplu: w_800,h_600,c_fill pentru resize
    if (transformation) {
      const parts = secureUrl.split('/');
      const uploadIndex = parts.findIndex(part => part === 'upload');
      if (uploadIndex !== -1) {
        parts.splice(uploadIndex + 1, 0, transformation);
        return parts.join('/');
      }
    }
    
    return secureUrl;
  }

  // Generează URL pentru thumbnail
  getThumbnailUrl(secureUrl, width = 300, height = 200) {
    return this.getTransformedUrl(secureUrl, `w_${width},h_${height},c_fill,q_auto`);
  }

  // Generează URL pentru imagine full size cu optimizare
  getOptimizedUrl(secureUrl, width = 1200) {
    return this.getTransformedUrl(secureUrl, `w_${width},q_auto,f_auto`);
  }

  // Obține toate imaginile dintr-un folder Cloudinary
  async getImagesFromFolder(folder = 'gallery', maxResults = 100) {
    try {
      this.ensureConfigured();
      console.log(`📁 Getting images from Cloudinary folder: ${folder}`);
      
      const result = await cloudinary.v2.api.resources({
        type: 'upload',
        prefix: folder,
        max_results: maxResults,
        context: true // Include metadata
      });
      
      console.log(`✅ Found ${result.resources.length} images in folder ${folder}`);
      
      return {
        success: true,
        data: result.resources.map(resource => ({
          id: resource.public_id,
          url: resource.secure_url,
          title: resource.context?.caption || resource.public_id.split('/').pop(),
          description: resource.context?.alt || '',
          category: resource.folder || 'general',
          active: true,
          created_date: resource.created_at,
          updated_date: resource.created_at,
          format: resource.format,
          width: resource.width,
          height: resource.height,
          size: resource.bytes
        }))
      };
      
    } catch (error) {
      console.error('❌ Cloudinary get images error:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }

  // Caută imagini după tag sau folder
  async searchImages(query, maxResults = 50) {
    try {
      this.ensureConfigured();
      console.log(`🔍 Searching images in Cloudinary with query: ${query}`);
      
      const result = await cloudinary.v2.search
        .expression(query)
        .max_results(maxResults)
        .execute();
      
      console.log(`✅ Found ${result.resources.length} images matching query: ${query}`);
      
      return {
        success: true,
        data: result.resources.map(resource => ({
          id: resource.public_id,
          url: resource.secure_url,
          title: resource.public_id.split('/').pop(),
          description: '',
          category: resource.folder || 'general',
          active: true,
          created_date: resource.created_at,
          updated_date: resource.created_at,
          format: resource.format,
          width: resource.width,
          height: resource.height,
          size: resource.bytes
        }))
      };
      
    } catch (error) {
      console.error('❌ Cloudinary search images error:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }
}

// Exportă o instanță singleton
export default new CloudinaryService();