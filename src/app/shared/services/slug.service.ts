import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class SlugService {

  constructor() { }

  generateSlug(text: string): string {
    return text
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9]+/g, '-') 
      .replace(/^-+|-+$/g, '');
  }
}