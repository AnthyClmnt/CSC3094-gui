import {Component, OnInit} from "@angular/core";
import {UserService} from "../services/user-service";
import {RepoCommit} from "../shared/openapi";
import {ActivatedRoute} from "@angular/router";
import {Observable, switchMap} from "rxjs";

@Component({
  selector: 'repo-commit-history',
  templateUrl: 'repo-commit-history.component.html',
  styleUrls: ['repo-commit-history.component.scss']
})
export class RepoCommitHistoryComponent implements OnInit {
  commits$!: Observable<RepoCommit[]>
  constructor(private route: ActivatedRoute, private userService: UserService) {}

  ngOnInit(): void {
    // Use switchMap to handle the nested observables
    this.commits$ = this.route.params
      .pipe(
        switchMap((params) => {
          const repoOwner = params['repoOwner'];
          const repoName = params['repoName'];

          // Call your service function and return the observable
          return this.userService.getCommits({repoOwner, repoName})
        })
      )
  }
}
