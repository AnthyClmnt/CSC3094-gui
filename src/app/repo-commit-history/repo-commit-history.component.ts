import {Component, OnInit} from "@angular/core";
import {UserService} from "../services/user-service";
import {RepoCommit} from "../shared/openapi";
import {ActivatedRoute, Router} from "@angular/router";
import {Observable, switchMap} from "rxjs";

@Component({
  selector: 'repo-commit-history',
  templateUrl: 'repo-commit-history.component.html',
  styleUrls: ['repo-commit-history.component.scss']
})
export class RepoCommitHistoryComponent implements OnInit {
  commits$!: Observable<RepoCommit[]>
  private repoOwner: string = '';
  private repoName: string = '';
  constructor(private route: ActivatedRoute, private userService: UserService, private router: Router) {}

  ngOnInit(): void {
    // Use switchMap to handle the nested observables
    this.commits$ = this.route.params
      .pipe(
        switchMap((params) => {
          this.repoOwner = params['repoOwner'];
          this.repoName = params['repoName'];

          // Call your service function and return the observable
          return this.userService.getCommits({
            repoOwner: this.repoOwner,
            repoName: this.repoName
          });
        })
      )
  }

  navigateToCommitDetails(sha: string) {
    this.router.navigateByUrl(`/commit-history/${this.repoOwner}/${this.repoName}/${sha}`).then()
  }
}
