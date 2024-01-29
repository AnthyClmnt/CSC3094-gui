import { Injectable } from "@angular/core";
import {Router, CanActivate, RouterStateSnapshot, ActivatedRouteSnapshot} from '@angular/router';
import {AuthService} from "../services/auth-service";
import {map} from "rxjs/operators";
import {Observable, take} from "rxjs";

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(public auth: AuthService, public router: Router) {}

  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean> {
    return this.auth.isAuthenticated().pipe(
      take(1),
      map((authenticated: boolean) => {
        if (!authenticated) {
          this.router.navigate(['/login']).then();
        }
        return authenticated;
      })
    );
  }
}
