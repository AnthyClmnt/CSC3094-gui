import {Component, OnInit} from "@angular/core";
import {UserService} from "../services/user-service";
import {Observable, of} from "rxjs";
import {GitHubRepo} from "../shared/openapi";
import {Router} from "@angular/router";

@Component({
  selector: 'dashboard',
  templateUrl: 'dashboard.component.html',
  styleUrls: ['dashboard.component.scss']
})
export class DashboardComponent implements OnInit {
  constructor(private router: Router, private userService: UserService) {}
  userRepos$: Observable<GitHubRepo[]> = this.userService.getRepos();
  filteredRepos: GitHubRepo[] = [];

  ngOnInit(): void {
    // Initialize filteredRepos with the full list of repositories
    this.userRepos$.subscribe(repos => this.filteredRepos = repos);
  }

  navigateToCommits(repoOwner: string, repoName: string) {
    this.router.navigateByUrl(`/commit-history/${repoOwner}/${repoName}`).then()
  }

  onSearchResult(result: GitHubRepo[]): void {
    this.filteredRepos = result
  }
}
