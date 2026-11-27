const CLOUDINARY_URL = `https://api.cloudinary.com/v1_1/${
  import.meta.env.VITE_CLOUDINARY_CLOUD_NAME
}/image/upload`;

const UPLOAD_PRESET = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET;

export async function uploadImage(file) {
  const formData = new FormData();
  formData.append('file', file);
  formData.append('upload_preset', UPLOAD_PRESET);
  formData.append('folder', 'davi-nicolly'); // Organiza as fotos no Cloudinary

  try {
    const response = await fetch(CLOUDINARY_URL, {
      method: 'POST',
      body: formData,
    });

    if (!response.ok) {
      throw new Error('Erro ao fazer upload da imagem');
    }

    const data = await response.json();

    return {
      url: data.secure_url,
      publicId: data.public_id,
    };
  } catch (error) {
    console.error('Erro no upload:', error);
    throw error;
  }
}

// Função útil: gera URL otimizada (menor, carrega mais rápido)
export function getOptimizedImageUrl(url, width = 800) {
  if (!url) return url;
  return url.replace(
    '/upload/',
    `/upload/w_${width},q_auto,f_auto/`
  );
}