import { Injectable } from '@angular/core';
import { Camera, CameraResultType, CameraSource } from '@capacitor/camera';

@Injectable({
  providedIn: 'root'
})
export class CameraService {
  private imageHistory: string[] = [];

  constructor() {
    // Recuperar historial de imágenes de localStorage al iniciar
    const savedImages = localStorage.getItem('imageHistory');
    this.imageHistory = savedImages ? JSON.parse(savedImages) : [];
  }

  private async checkPermissions(): Promise<void> {
    try {
      const permissions = await Camera.checkPermissions();
      
      if (permissions.camera === 'prompt') {
        await Camera.requestPermissions();
      }
    } catch (error) {
      console.log('Verificación de permisos omitida en web:', error);
    }
  }

  async takePicture(): Promise<string> {
    try {
      await this.checkPermissions();
      
      const image = await Camera.getPhoto({
        quality: 90,
        allowEditing: false,
        resultType: CameraResultType.DataUrl,
        source: CameraSource.Camera,
        webUseInput: true
      });

      if (image.dataUrl) {
        // Agregar imagen al historial
        this.imageHistory.push(image.dataUrl);
        
        // Guardar historial en localStorage
        localStorage.setItem('imageHistory', JSON.stringify(this.imageHistory));
        
        return image.dataUrl;
      } else {
        throw new Error("No se obtuvo una imagen válida");
      }
    } catch (error) {
      console.error('Error en el servicio de cámara:', error);
      throw error;
    }
  }

  // Método para obtener el historial de imágenes
  getImageHistory(): string[] {
    return this.imageHistory;
  }

  // Método para limpiar el historial de imágenes
  clearImageHistory(): void {
    this.imageHistory = [];
    localStorage.removeItem('imageHistory');
  }
}