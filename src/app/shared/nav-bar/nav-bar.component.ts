import {Component, OnDestroy, OnInit} from "@angular/core";
import {AuthService} from "../../services/auth-service";
import {NavigationEnd, Router} from "@angular/router";
import {filter, Subscription} from "rxjs";

@Component({
  selector: 'nav-bar',
  templateUrl: 'nav-bar.component.html',
  styleUrls: ['nav-bar.component.scss']
})
export class NavBarComponent implements OnInit, OnDestroy {
  public repoOwner: string | undefined
  public repoName: string | undefined
  private routeChangeSubscription: Subscription | undefined;
  private restrictedLinks = ['/github-connect', '/callback']
  constructor(private authService: AuthService, private router: Router) {}

  ngOnInit() {
    this.routeChangeSubscription = this.router.events.pipe(
      filter((event) => event instanceof NavigationEnd)
    ).subscribe((event: any) => {
      const location = window.location.pathname.replace('/', '').split('/')
      this.repoOwner = location[1]
      this.repoName = location[2]
    });
  }

  signOut() {
    this.authService.logout();
  }

  hideLinksOnGithubPages(): boolean {
    const currentRoute = this.router.url
    return !this.restrictedLinks.includes(currentRoute)
  }

  hideLinks(): boolean {
    const currentRoute = this.router.url
    return currentRoute.replace('/', '').split('/')[0] == 'repository'
  }

  navigateHome() {
    this.router.navigateByUrl('/').then()
  }

  ngOnDestroy() {
    if (this.routeChangeSubscription) {
      this.routeChangeSubscription.unsubscribe();
    }
  }
}
