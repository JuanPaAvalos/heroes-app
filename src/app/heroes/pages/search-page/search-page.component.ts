import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { Hero } from '../../interfaces/hero.interface';
import { HeroService } from '../../services/heroes.service';
import { MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';

@Component({
  selector: 'app-search-page',
  templateUrl: './search-page.component.html',
  styles: [],
})
export class SearchPageComponent implements OnInit {
  public searchInput = new FormControl('');
  public heroes: Hero[] = [];
  public selectedHero?: Hero;

  constructor(private heroService: HeroService) {}

  ngOnInit(): void {}

  searchHero() {
    const inputValue: string = this.searchInput.value || '';
    this.heroService
      .getSugestions(inputValue)
      .subscribe((heroes) => (this.heroes = heroes));
  }

  onSelectedOption(event: MatAutocompleteSelectedEvent) {
    if (!event.option.value) this.selectedHero = undefined;

    const hero: Hero = event.option.value;

    this.searchInput.setValue(hero.superhero);
    //TODO: cambiar esta asignacion por una peticion de get Hero By Id
    this.selectedHero = hero;
  }
}
