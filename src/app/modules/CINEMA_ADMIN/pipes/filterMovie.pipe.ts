import { Pipe, type PipeTransform } from '@angular/core';
import { ShowTime } from '../models/showtimes.interface';

@Pipe({
  name: 'FilterMovie',
})
export class FilterMoviePipe implements PipeTransform {
  transform(showTimes: ShowTime[], filter: string): ShowTime[] {
    if (!filter) return showTimes;

    filter = filter.toLowerCase();

    return showTimes.filter(
      (showtime) => showtime.movie?.id.toLocaleLowerCase() === filter
    );
  }
}
