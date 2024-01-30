import { Injectable } from "@angular/core";
import {Router, CanActivate, RouterStateSnapshot, ActivatedRouteSnapshot} from '@angular/router';
import {AuthService} from "../services/auth-service";
import {map} from "rxjs/operators";
import {Observable, take} from "rxjs";
import {LoadingService} from "../services/loading.service";

@Injectable()
export class GithubGuard implements CanActivate {
  constructor(private auth: AuthService, private router: Router, private loadingService: LoadingService) {}

  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean> {
    this.loadingService.setLoading({
      active: true,
      text: 'Loading...',
      overlay: true
    });
    return this.auth.isGithubConnected().pipe(
      take(1),
      map((connected: boolean) => {
        if (!connected) {
          this.loadingService.deactivateLoading();
          this.router.navigate(['/github-connect']).then();
        }
        this.loadingService.deactivateLoading();
        return connected;
      })
    );
  }
}
