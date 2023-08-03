import { Pipe, PipeTransform } from '@angular/core';
import { Hero } from '../interfaces/hero.interface';

@Pipe({
  name: 'heroImage',
})
export class HeroImagePipe implements PipeTransform {
  transform(hero: Hero): string {
    if (!hero.id && !hero.altImg) return '/assets/no-image.png';
    if (hero.altImg) return hero.altImg;
    return `assets/heroes/${hero.id}.jpg`;
  }
}
