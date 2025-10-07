import { Pipe, type PipeTransform } from '@angular/core';

@Pipe({
  name: 'appTimeFormatPipe',
})
export class TimeFormatPipePipe implements PipeTransform {
  transform(value: string | undefined): string {
    if (!value) return '';

    // divide HH:mm:ss
    const [hours, minutes] = value.split(':');
    return `${hours}:${minutes} hrs`; // muestra solo HH:mm
  }
}
