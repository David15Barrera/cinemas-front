import { Pipe, type PipeTransform } from '@angular/core';
import { Snack } from '../models/snack.interface';

@Pipe({
  name: 'FilterSnackName',
})
export class FilterSnackNamePipe implements PipeTransform {

  transform(snacks: Snack[], filter: string): Snack[] {
    if (!filter) return snacks;

    filter = filter.toLowerCase();

    return snacks.filter(
      (snack) => snack.name.toLocaleLowerCase().includes(filter)
    );
  }
}
