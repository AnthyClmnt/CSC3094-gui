import {Component} from "@angular/core";
import {UserService} from "../services/user-service";
import {Observable} from "rxjs";
import {GitHubRepo} from "../shared/openapi";
import {Router} from "@angular/router";

@Component({
  selector: 'dashboard',
  templateUrl: 'dashboard.component.html',
  styleUrls: ['dashboard.component.scss']
})
export class DashboardComponent {
  constructor(private router: Router, private userService: UserService) {}
  userRepos$: Observable<GitHubRepo[]> = this.userService.getRepos();

  navigateToCommits(repoOwner: string, repoName: string) {
    this.router.navigateByUrl(`/commit-history/${repoOwner}/${repoName}`).then()
  }
}
