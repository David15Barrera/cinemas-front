import { Pipe, type PipeTransform } from '@angular/core';
import { Snack } from '../models/snack.interface';

@Pipe({
  name: 'FilterSnackActive',
})
export class FilterSnackActivePipe implements PipeTransform {

  transform(snacks: Snack[], filter: boolean | undefined): Snack[] {
    if (filter === undefined) return snacks;

    return snacks.filter(
      (snack) => snack.active === filter
    );
  }

}
