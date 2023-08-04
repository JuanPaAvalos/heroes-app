import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { User } from '../interfaces/user.interface';
import { Observable, catchError, map, of, tap } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private baseUrl = environment.baseUrl;
  private user?: User;

  constructor(private httpClient: HttpClient) {}

  get currentUser(): User | undefined {
    if (!this.user) return undefined;
    // return structuredClone(this.user);
    return this.user;
  }

  login(email: string, password: string): Observable<User> {
    return this.httpClient.get<User>(`${this.baseUrl}/users/1`).pipe(
      tap((user) => (this.user = user)),
      tap((user) => {
        localStorage.setItem('token', 'sdfsfsfsf.23f2f32f234f.sdfvsSDRsdvty')
      })
    );
  }

  logout() {
    this.user = undefined;
    localStorage.clear();
  }

  checkAuth(): Observable<boolean> {
    if (!localStorage.getItem('token')) return of(false);
    const token = localStorage.getItem('token');

    return this.httpClient.get<User>(`${this.baseUrl}/users/1`).pipe(
      tap((user) => (this.user = user)),
      map((user) => !!this.user),
      catchError((err) => of(false))
    );
  }
}
