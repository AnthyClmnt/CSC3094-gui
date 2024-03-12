import {Component, OnInit} from "@angular/core";
import {UserService} from "../../../services/user-service";
import {RepoCommit} from "../../../shared/openapi";
import {ActivatedRoute, Router} from "@angular/router";
import {Observable, switchMap} from "rxjs";

@Component({
  selector: 'repo-commit-history',
  templateUrl: 'repo-commit-history.component.html',
  styleUrls: ['repo-commit-history.component.scss']
})
export class RepoCommitHistoryComponent implements OnInit {
  commits$!: Observable<RepoCommit[]>
  repoOwner: string = '';
  repoName: string = '';
  constructor(private route: ActivatedRoute, private userService: UserService, private router: Router) {}

  ngOnInit(): void {
    this.commits$ = this.route.params
      .pipe(
        switchMap((params) => {
          this.repoOwner = params['repoOwner'];
          this.repoName = params['repoName'];

          return this.userService.getCommits({
            repoOwner: this.repoOwner,
            repoName: this.repoName
          });
        })
      )
  }

  navigateToCommitDetails(sha: string) {
    this.router.navigateByUrl(`/repository/${this.repoOwner}/${this.repoName}/commits/${sha}`)
  }
}
