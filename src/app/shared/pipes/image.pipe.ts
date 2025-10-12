import { Pipe, PipeTransform } from '@angular/core';
import { environment } from '@environment/environment';

@Pipe({
  name: 'image',
  standalone: true
})
export class ImagePipe implements PipeTransform {
  readonly BUCKET_URL = environment.BUCKET_URL
  
  transform(value: string | null | undefined): string {
      if (!value) {
        return 'assets/no-image.jpg';
      }

      const base = this.BUCKET_URL.endsWith('/')
        ? this.BUCKET_URL.slice(0, -1)
        : this.BUCKET_URL;

      const cleanValue = value.startsWith('/')
        ? value.substring(1)
        : value;

      return `${base}/${cleanValue}`;
  }

}