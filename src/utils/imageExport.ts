
/**
 * Export a canvas element as a JPEG image file that can be downloaded
 * 
 * @param canvas The canvas element to export
 * @param filename The name for the downloaded file
 * @param quality JPEG image quality (0-1)
 */
export const exportCanvasAsJpeg = (
  canvas: HTMLCanvasElement,
  filename: string,
  quality = 0.9
): void => {
  // Convert canvas to JPEG data URL
  const dataUrl = canvas.toDataURL('image/jpeg', quality);
  
  // Create a temporary link element
  const link = document.createElement('a');
  link.href = dataUrl;
  link.download = filename;
  
  // Append to body, click, and remove
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};

/**
 * Export the Peace2Hearts logo in common social media sizes
 */
export const exportLogoForSocialMedia = (
  canvas: HTMLCanvasElement,
  type: 'profile' | 'cover'
): void => {
  const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
  const filename = `peace2hearts-${type}-${timestamp}.jpg`;
  exportCanvasAsJpeg(canvas, filename, 0.95);
};
