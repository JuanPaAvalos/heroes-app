import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Hero } from '../interfaces/hero.interface';
import { Observable, catchError, of } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({ providedIn: 'root' })
export class HeroService {
  private baseUrl: string = environment.baseUrl;

  constructor(private httpClient: HttpClient) {}

  getHeroes(): Observable<Hero[]> {
    return this.httpClient.get<Hero[]>(`${this.baseUrl}/heroes`);
  }

  getHeroById(id: string): Observable<Hero | undefined> {
    return this.httpClient
      .get<Hero | undefined>(`${this.baseUrl}/heroes/${id}`)
      .pipe(
        catchError( error => of (undefined)) //* Se utiliza "of (undefined)" para retornar un observable undefined y solo el valor undefined
      );
  }

  getSugestions(query: string): Observable<Hero[]>{
    return this.httpClient.get<Hero[]>(`${this.baseUrl}/heroes?q=${query}&_limit=6`);
  }
}
