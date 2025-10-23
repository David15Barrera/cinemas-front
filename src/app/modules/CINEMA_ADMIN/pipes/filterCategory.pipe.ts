import { Pipe, type PipeTransform } from '@angular/core';
import { Movie } from '../models/movie.interface';

@Pipe({
  name: 'FilterCategory',
})
export class FilterCategoryPipe implements PipeTransform {
  transform(movies: Movie[], filter: string): Movie[] {
    if (!filter) return movies;

    filter = filter.toLowerCase();

    return movies.filter(
      (movie) => movie.categories.some((category) => category.id.toLocaleLowerCase() === filter)
    );
  }
}
