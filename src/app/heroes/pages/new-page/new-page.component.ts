import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { Hero, Publisher } from '../../interfaces/hero.interface';
import { HeroService } from '../../services/heroes.service';
import { ActivatedRoute, Router } from '@angular/router';
import { switchMap } from 'rxjs';

@Component({
  selector: 'app-new-page',
  templateUrl: './new-page.component.html',
  styles: [],
})
export class NewPageComponent implements OnInit {
  public publishers = [
    { id: 'DCComics', desc: 'DC Comics' },
    { id: 'MarvelComics', desc: 'Marvel Comics' },
  ];

  public heroForm = new FormGroup({
    id: new FormControl(''),
    superhero: new FormControl('', { nonNullable: true }),
    publisher: new FormControl<Publisher>(Publisher.DCComics),
    alter_ego: new FormControl(''),
    first_appearance: new FormControl(''),
    characters: new FormControl(''),
    altImg: new FormControl(''),
  });

  constructor(
    private heroService: HeroService,
    private activatedRoute: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {
    if (!this.router.url.includes('edit')) return;

    this.activatedRoute.params.pipe(
      switchMap(({ id }) => this.heroService.getHeroById(id))
    ).subscribe(hero=> {
      if(!hero) return this.router.navigateByUrl('/heroes/list');
      return this.heroForm.reset(hero);
    });
  }

  get currentHero() {
    const hero = this.heroForm.value as Hero;
    return hero;
  }

  onSubmit() {
    if (this.heroForm.invalid) return;
    if (this.currentHero.id) {
      this.heroService
        .updateHero(this.currentHero)
        .subscribe((hero) => console.log(hero));
      return;
    }

    this.heroService
      .addHero(this.currentHero)
      .subscribe((hero) => console.log(hero));
  }
}
