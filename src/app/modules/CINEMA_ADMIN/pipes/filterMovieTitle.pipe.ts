import { Pipe, type PipeTransform } from '@angular/core';
import { Movie } from '../models/movie.interface';

@Pipe({
  name: 'FilterMovieTitle',
})
export class FilterMovieTitlePipe implements PipeTransform {
  transform(movies: Movie[], filter: string): Movie[] {
    if (!filter) return movies;

    filter = filter.toLowerCase();

    return movies.filter((movie) =>
      movie.title.toLocaleLowerCase().includes(filter)
    );
  }
}
