import {Component, OnInit} from "@angular/core";
import {UserService} from "../../../services/user-service";
import {Observable} from "rxjs";
import {User} from "../../../shared/openapi";
import {NavigationEnd, Router} from "@angular/router";

interface RouteSegment {
  link: string;
  displayText: string;
}

@Component({
  selector: 'app-bar',
  templateUrl: '/app-bar.component.html',
  styleUrls: ['app-bar.component.scss']
})
export class AppBarComponent implements OnInit {
  public currentRouteSegments: RouteSegment[] = [];
  private filtersEnabled: boolean = false;
  constructor(private userService: UserService, private router: Router) {}

  userInfo$: Observable<User> = this.userService.getUserInfo();

  ngOnInit(): void {
    this.router.events.subscribe((event) => {
      if (event instanceof NavigationEnd) {
        this.currentRouteSegments = this.parseRouteSegments(event.url);
      }
    });
  }

  parseRouteSegments(url: string): RouteSegment[] {
    const segments = url.split('/').filter(segment => segment !== '');
    let routeSegments: RouteSegment[] = [];

    for (let i = 0; i < segments.length; i++) {
      if (segments[i] === 'repository') {

        let displayName = `${this.capitalizeFirstLetter(segments[i+2])}`;
        routeSegments.push({
          link: '/' + segments.slice(0, i + 3).join('/'),
          displayText: displayName
        })
        i += 2;
        continue;
      }

      let displayName = this.capitalizeFirstLetter(segments[i]);
      if (i < segments.length - 2 && segments[i + 1] !== 'repository') {
        displayName += ' ' + this.capitalizeFirstLetter(segments[i + 1]);
        i++;
      }

      routeSegments.push({
        link: '/' + segments.slice(0, i + 1).join('/'),
        displayText: displayName
      });
    }

    return routeSegments;
  }

  capitalizeFirstLetter(str: string): string {
    return str.charAt(0).toUpperCase() + str.slice(1);
  }
}
