import {Component, OnInit} from '@angular/core';
import {UserService} from "../../../services/user-service";
import {Observable, switchMap} from "rxjs";
import {ActivatedRoute} from "@angular/router";

@Component({
  selector: 'app-issues-page',
  templateUrl: './issues-page.component.html',
  styleUrls: ['./issues-page.component.scss']
})
export class IssuesPageComponent implements OnInit {
  constructor(private userService: UserService, private route: ActivatedRoute) {}
  public repoOwner!: string
  public repoName!: string
  public repoIssues$!: Observable<any>;
  public currentPage = 1;
  public itemsPerPage = 10;
  public totalItems: number = 0
  ngOnInit() {
    this.repoIssues$ = this.route.params
      .pipe(
        switchMap((params) => {
          this.repoOwner = params['repoOwner'];
          this.repoName = params['repoName'];

          return this.userService.getRepoIssues({
            repoOwner: this.repoOwner,
            repoName: this.repoName,
          });
        })
      )
  }

  public GetPaginationData(data: any) {
    const startIndex = (this.currentPage - 1) * this.itemsPerPage;
    this.totalItems = data?.length ?? 0;
    return data?.slice(startIndex, startIndex + this.itemsPerPage);
  }

  public nextPage(): void {
    if (this.currentPage < this.getTotalPages()) {
      this.currentPage++;
    }
  }

  public previousPage(): void {
    if (this.currentPage > 1) {
      this.currentPage--;
    }
  }

  public getTotalPages(): number {
    return Math.ceil(this.totalItems / this.itemsPerPage);
  }

  skipToStart(): void {
    this.currentPage = 1;
  }

  skipToEnd(): void {
    this.currentPage = this.getTotalPages();
  }
}
