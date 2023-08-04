import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { Hero, Publisher } from '../../interfaces/hero.interface';
import { HeroService } from '../../services/heroes.service';
import { ActivatedRoute, Router } from '@angular/router';
import { filter, switchMap, tap } from 'rxjs';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatDialog } from '@angular/material/dialog';
import { ConfirmDialogComponent } from '../../components/confirm-dialog/confirm-dialog.component';

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
    private router: Router,
    private snackBar: MatSnackBar,
    public dialog: MatDialog
  ) {}

  ngOnInit(): void {
    if (!this.router.url.includes('edit')) return;

    this.activatedRoute.params
      .pipe(switchMap(({ id }) => this.heroService.getHeroById(id)))
      .subscribe((hero) => {
        if (!hero) return this.router.navigateByUrl('/heroes/list');
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
      this.heroService.updateHero(this.currentHero).subscribe((hero) => {
        this.openSnackBar(`${hero.superhero} Updated`);
      });
      return;
    }

    this.heroService.addHero(this.currentHero).subscribe((hero) => {
      this.router.navigateByUrl(`/heroes/edit/${hero.id}`);
      this.openSnackBar(`${hero.superhero} Added`);
    });
  }

  onDeleteHero() {
    if (!this.currentHero.id) return this.openSnackBar('hero is required');

    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      data: this.heroForm.value,
    });

    dialogRef
      .afterClosed()
      .pipe(
        filter((result) => result === true), //* Filter if dialog result is true
        switchMap(() => this.heroService.deleteHero(this.currentHero.id)), //* Call delete functions & change promise return value
        filter((wasDeleted) => wasDeleted === true) //* Continues only if heroService.deleteHero response is true
      )
      .subscribe((result) => {
        // if (!result) return; ///*old filter

        // this.heroService
        //   .deleteHero(this.currentHero.id)
        //   .subscribe((response) => { //!promise hell
        //     if (!response)
        //       return this.openSnackBar(
        //         `There was an error deleting ${this.currentHero.superhero}`
        //       );

        this.router.navigateByUrl(`/heroes/list`);
        this.openSnackBar(`${this.currentHero.superhero} Deleted`);
        // });
      });
  }

  openSnackBar(message: string): void {
    this.snackBar.open(message, 'done', {
      duration: 2500,
    });
  }
}
