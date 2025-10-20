import { Pipe, type PipeTransform } from '@angular/core';
import { ShowTime } from '../models/showtimes.interface';

@Pipe({
  name: 'FilterRoom',
})
export class FilterRoomPipe implements PipeTransform {

  transform(showTimes: ShowTime[], filter: string): ShowTime[] {
    if (!filter) return showTimes;

    filter = filter.toLowerCase();

    return showTimes.filter(
      (showtime) => showtime.roomId.toLocaleLowerCase() === filter
    );
  }

}
