import { NgIf, NgFor } from '@angular/common';
import { Component, inject } from '@angular/core';
import { CameraService } from '../../services/camera.service';

@Component({
  selector: 'app-camera',
  standalone: true,
  imports: [NgIf, NgFor],
  templateUrl: './camera.component.html',
  styleUrl: './camera.component.css'
})
export class CameraComponent {
  cameraService: CameraService = inject(CameraService);
  imgUrl: string = '';
  imageHistory: string[] = [];
  errorMessage: string = '';
  loading: boolean = false;
  
  constructor() {
    // Cargar historial de imágenes al iniciar el componente
    this.imageHistory = this.cameraService.getImageHistory();
  }

  async takePicture() {
    this.errorMessage = ''; // Limpiar mensajes de error anteriores
    
    try {
      this.loading = true;
      
      try {
        this.imgUrl = await this.cameraService.takePicture();
        // Actualizar historial de imágenes después de tomar una foto
        this.imageHistory = this.cameraService.getImageHistory();
      } catch (error) {
        if (String(error).includes('Not implemented on web')) {
          throw new Error('Esta función no está disponible en navegadores web. Por favor, usa la aplicación móvil.');
        } else {
          throw error;
        }
      }
      
      if (!this.imgUrl) {
        throw new Error('No se obtuvo una imagen válida');
      }
      
      this.loading = false;
    } catch (error) {
      console.error('Error al capturar imagen:', error);
      this.errorMessage = String(error);
      this.imgUrl = ''; 
      this.loading = false;
    }
  }

  // Método para limpiar todo el historial de imágenes
  clearHistory() {
    this.cameraService.clearImageHistory();
    this.imageHistory = [];
    this.imgUrl = '';
  }
}