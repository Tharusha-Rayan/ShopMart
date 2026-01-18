const sharp = require('sharp');
const path = require('path');
const fs = require('fs');

// Process and optimize image
exports.processImage = async (filePath, options = {}) => {
  const {
    width = 1200,
    height = null,
    quality = 80,
    format = 'webp'
  } = options;

  try {
    const outputPath = filePath.replace(path.extname(filePath), `.${format}`);
    
    let sharpInstance = sharp(filePath);

    // Resize if dimensions provided
    if (width || height) {
      sharpInstance = sharpInstance.resize(width, height, {
        fit: 'inside',
        withoutEnlargement: true
      });
    }

    // Convert and compress
    if (format === 'webp') {
      await sharpInstance.webp({ quality }).toFile(outputPath);
    } else if (format === 'jpeg' || format === 'jpg') {
      await sharpInstance.jpeg({ quality }).toFile(outputPath);
    } else if (format === 'png') {
      await sharpInstance.png({ quality }).toFile(outputPath);
    }

    // Delete original file if format changed
    if (outputPath !== filePath) {
      fs.unlinkSync(filePath);
    }

    return outputPath;
  } catch (error) {
    console.error('Image processing error:', error);
    throw new Error('Failed to process image');
  }
};

// Process multiple images
exports.processMultipleImages = async (files, options = {}) => {
  const processedImages = [];

  for (const file of files) {
    try {
      const processedPath = await this.processImage(file.path, options);
      processedImages.push({
        url: processedPath.replace(/\\/g, '/'),
        public_id: path.basename(processedPath, path.extname(processedPath))
      });
    } catch (error) {
      console.error(`Failed to process ${file.path}:`, error);
    }
  }

  return processedImages;
};

// Generate thumbnails
exports.generateThumbnails = async (filePath) => {
  const sizes = [
    { width: 100, suffix: 'thumb' },
    { width: 300, suffix: 'small' },
    { width: 800, suffix: 'medium' }
  ];

  const thumbnails = [];
  const ext = path.extname(filePath);
  const baseName = path.basename(filePath, ext);
  const dir = path.dirname(filePath);

  for (const size of sizes) {
    const outputPath = path.join(dir, `${baseName}-${size.suffix}.webp`);
    
    await sharp(filePath)
      .resize(size.width, null, {
        fit: 'inside',
        withoutEnlargement: true
      })
      .webp({ quality: 80 })
      .toFile(outputPath);

    thumbnails.push({
      size: size.suffix,
      url: outputPath.replace(/\\/g, '/')
    });
  }

  return thumbnails;
};

// Delete image file
exports.deleteImage = (filePath) => {
  try {
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
      return true;
    }
    return false;
  } catch (error) {
    console.error('Error deleting image:', error);
    return false;
  }
};
