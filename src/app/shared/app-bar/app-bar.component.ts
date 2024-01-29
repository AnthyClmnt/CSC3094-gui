import {Component} from "@angular/core";
import {UserService} from "../../services/user-service";
import {Observable} from "rxjs";
import {User} from "../openapi";

@Component({
  selector: 'app-bar',
  templateUrl: '/app-bar.component.html',
  styleUrls: ['app-bar.component.scss']
})
export class AppBarComponent {
  constructor(private userService: UserService) {}

  userInfo$: Observable<User> = this.userService.getUserInfo();
}
