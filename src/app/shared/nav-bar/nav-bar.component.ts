import {Component} from "@angular/core";
import {AuthService} from "../../services/auth-service";

@Component({
  selector: 'nav-bar',
  templateUrl: 'nav-bar.component.html',
  styleUrls: ['nav-bar.component.scss']
})
export class NavBarComponent {
  constructor(private authService: AuthService) {}

  signOut() {
    this.authService.logout();
  }
}
