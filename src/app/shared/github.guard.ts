import { Injectable } from "@angular/core";
import {Router, CanActivate, RouterStateSnapshot, ActivatedRouteSnapshot} from '@angular/router';
import {AuthService} from "../services/auth-service";
import {map} from "rxjs/operators";
import {Observable, take} from "rxjs";

@Injectable()
export class GithubGuard implements CanActivate {
  constructor(public auth: AuthService, public router: Router) {}

  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean> {
    return this.auth.isGithubConnected().pipe(
      take(1),
      map((connected: boolean) => {
        console.log('connected')
        if (!connected) {
          this.router.navigate(['/github-connect']).then();
        }
        return connected;
      })
    );
  }
}
