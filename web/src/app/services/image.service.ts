// Serviço de gerenciamento de imagens com lazy loading
import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ImageService {
  private loadedImages = new BehaviorSubject<Set<string>>(new Set());

  constructor() {
    this.initializeImageObserver();
  }

  private initializeImageObserver(): void {
    // Lazy loading para imagens com data-src
    if ('IntersectionObserver' in window) {
      const imageObserver = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const img = entry.target as HTMLImageElement;
            if (img.dataset['src']) {
              img.src = img.dataset['src'];
              img.classList.add('loaded');
              imageObserver.unobserve(img);
            }
          }
        });
      });

      // Observar todas as imagens com lazy-load class
      setTimeout(() => {
        document.querySelectorAll('img.lazy-load').forEach((img) => {
          imageObserver.observe(img);
        });
      }, 500);
    }
  }

  // Pré-carregar imagens críticas
  preloadImages(urls: string[]): Promise<void> {
    return Promise.all(
      urls.map(
        (url) =>
          new Promise<void>((resolve) => {
            const img = new Image();
            img.onload = () => {
              this.loadedImages.value.add(url);
              resolve();
            };
            img.onerror = () => resolve(); // Continue mesmo se falhar
            img.src = url;
          }),
      ),
    ).then(() => undefined);
  }

  getImageUrl(imageName: string): string {
    return `/assets/images/${imageName}`;
  }

  getExternalImageUrl(unsplashId: string, width = 1200, height = 600): string {
    return `https://images.unsplash.com/${unsplashId}?w=${width}&h=${height}&fit=crop`;
  }
}
