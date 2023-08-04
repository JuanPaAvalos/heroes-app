import { Injectable } from '@angular/core';
import {
  ActivatedRouteSnapshot,
  CanActivate,
  CanMatch,
  Route,
  UrlSegment,
  UrlTree,
  RouterStateSnapshot,
  Router,
  CanActivateFn,
  CanMatchFn,
} from '@angular/router';
import { Observable, map, tap } from 'rxjs';
import { AuthService } from '../services/auth.service';


// export const canActivateGuard: CanActivateFn = ( //Hay que tener en cuenta el tipado CanActiveFn
//   route: ActivatedRouteSnapshot,
//   state: RouterStateSnapshot
// ) => {
//   console.log('CanActivate');
//   console.log({ route, state });

//   return false;
// };

// export const canMatchGuard: CanMatchFn = ( //Tipado CanMatchFN
//   route: Route,
//   segments: UrlSegment[]
// ) => {
//   console.log('CanMatch');
//   console.log({ route, segments });

//   return false;
// };

@Injectable({ providedIn: 'root' })


export class PublicGuard implements CanMatch, CanActivate {
  constructor(private authService: AuthService, private router: Router) {}

  private chechAuthStatus(): boolean | Observable<boolean> {
    return this.authService.checkAuth().pipe(
      tap((isAuth) => console.log(isAuth)),
      tap((isAuth) => {
        if (isAuth) this.router.navigateByUrl(`/`);
      }),
      map(isAuth => !isAuth)
    );
  }

  canMatch(
    route: Route,
    segments: UrlSegment[]
  ): boolean | Observable<boolean> {
    return this.chechAuthStatus();
  }

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): boolean | Observable<boolean> {
    return this.chechAuthStatus();
  }
}
