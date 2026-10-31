import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { storage } from './firebase';

export async function compressImageToBlob(
  file: File,
  maxWidth = 1200,
  maxHeight = 1200,
  quality = 0.85
): Promise<Blob> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onerror = reject;
    reader.onload = () => {
      const img = new Image();
      img.onerror = reject;
      img.onload = () => {
        let width = img.width;
        let height = img.height;

        if (width > maxWidth || height > maxHeight) {
          const ratio = Math.min(maxWidth / width, maxHeight / height);
          width = Math.round(width * ratio);
          height = Math.round(height * ratio);
        }

        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        if (!ctx) {
          reject(new Error('Failed to get canvas 2D context'));
          return;
        }

        ctx.fillStyle = '#FFFFFF';
        ctx.fillRect(0, 0, width, height);
        ctx.drawImage(img, 0, 0, width, height);

        canvas.toBlob(
          (blob) => {
            if (blob) {
              resolve(blob);
            } else {
              reject(new Error('Canvas toBlob conversion failed'));
            }
          },
          'image/jpeg',
          quality
        );
      };
      img.src = reader.result as string;
    };
    reader.readAsDataURL(file);
  });
}

export async function uploadImageToStorage(
  fileOrBlob: File | Blob,
  folder: 'banners' | 'dishes' | 'profile_photos' | 'reviews',
  customPrefix?: string
): Promise<string> {
  if (!storage) {
    throw new Error('Firebase Storage is not initialized');
  }

  const cleanPrefix = (customPrefix || 'img').replace(/[^a-zA-Z0-9_-]/g, '_');
  const filename = `${cleanPrefix}_${Date.now()}_${Math.random().toString(36).substring(2, 7)}.jpg`;
  const storageRef = ref(storage, `${folder}/${filename}`);

  const metadata = {
    contentType: 'image/jpeg',
    cacheControl: 'public, max-age=31536000',
  };

  const snapshot = await uploadBytes(storageRef, fileOrBlob, metadata);
  const downloadUrl = await getDownloadURL(snapshot.ref);
  return downloadUrl;
}
