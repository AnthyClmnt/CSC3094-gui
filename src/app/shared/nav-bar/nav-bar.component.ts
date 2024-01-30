import {Component} from "@angular/core";
import {AuthService} from "../../services/auth-service";
import {Router} from "@angular/router";

@Component({
  selector: 'nav-bar',
  templateUrl: 'nav-bar.component.html',
  styleUrls: ['nav-bar.component.scss']
})
export class NavBarComponent {
  constructor(private authService: AuthService, private router: Router) {}

  private restrictedLinks = ['/github-connect', '/callback']

  signOut() {
    this.authService.logout();
  }

  showLink() {
    const currentRoute = this.router.url
    return !this.restrictedLinks.includes(currentRoute)
  }
}
