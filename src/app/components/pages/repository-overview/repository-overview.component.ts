import {Component, OnInit} from "@angular/core";
import {ActivatedRoute, Router} from "@angular/router";
import {UserService} from "../../../services/user-service";
import {Observable, of, switchMap} from "rxjs";
import {map} from "rxjs/operators";
import {SidebarService} from "../../../services/sidebar.service";

@Component({
  selector: 'repo-overview',
  templateUrl: 'repository-overview.component.html',
  styleUrls: ['repository-overview.component.scss']
})
export class RepositoryOverviewComponent implements OnInit {
  repoOverview$!: Observable<any>

  public loadingText = "Loading Overview...";
  public repoOwner: string = '';
  public repoName: string = '';
  public sideBarData: any;
  constructor(private route: ActivatedRoute, private userService: UserService, private router: Router, private sidebarService: SidebarService) {}

  ngOnInit(): void {
    this.repoOverview$ = this.route.params
      .pipe(
        switchMap((params) => {
          if (!params['repoOwner'] || !params['repoName']) {
            this.router.navigateByUrl('/')
            return of(null);
          }

          this.repoOwner = params['repoOwner'];
          this.repoName = params['repoName'];

          return this.userService.getRepoOverview({
            repoOwner: this.repoOwner,
            repoName: this.repoName
          })
        })
      );
  }

  public showUpdatePush(lastUpdated: string) {
    const currentDate = new Date();
    const givenDate = new Date(lastUpdated);

    const differenceInMs = currentDate.getTime() - givenDate.getTime();
    const differenceInDays = Math.floor(differenceInMs / (1000 * 60 * 60 * 24));

    return differenceInDays > 7;
  }

  public syncRepoClick() {
    this.loadingText = "Analysing Repository...";
    this.repoOverview$ = this.userService.syncRepoAnalysis({repoOwner: this.repoOwner, repoName: this.repoName})
      .pipe(
        map((response) => {
          console.log(response[1])
          return response[0]
        })
      )
  }

  public getCommentRatioOrder(x: any) {
    const newArray = x.filter((obj : any) => obj.ltc_ratio !== null);
    return newArray.sort((a: any, b: any) => a.ltc_ratio - b.ltc_ratio).slice(0, 5);
  }

  public getMaintainabilityOrder(x: any) {
    const newArray = x.filter((obj : any) => obj.maintain_index !== null);
    return newArray.sort((a: any, b: any) => b.maintain_index - a.maintain_index).slice(0, 5);
  }

  public getSideBarData(rowData: any) {
    this.userService.GetFileDetails({ repoOwner: this.repoOwner, repoName: this.repoName, sha: rowData.sha, fileName: rowData.fileName}).subscribe((x) => {
      this.sideBarData = {...rowData, ...x};
    })

    this.sidebarService.toggleSidebar();
  }

  public clearData() {
    setTimeout(() => {
      this.sideBarData = null;
    }, 300)
  }

  getRange(count: number): any[] {
    const result = Array.from({ length: count }, (_, index) => ({ index }));
    return result.length > 5 ? result.slice(0, 5) : result
  }

  public parsePatch(patch: string): any[] {
    const changes: { lineNumber: number | null; text: string; added: boolean; removed: boolean }[] = [];

    const lines = patch.split('\n');
    let lineNumber = 1;

    for (let i = 0; i < lines.length; i++) {
      const line = lines[i];

      if (line.startsWith('@@')) {
        const match = line.match(/@@ -(\d+),\d+ \+(\d+),\d+ @@/);

        if (match) {
          lineNumber = parseInt(match[1]);

          // Add the diff header line without assigning a line number
          changes.push({ lineNumber: null, text: line, added: false, removed: false });

          while (++i < lines.length && !lines[i].startsWith('@@')) {
            const text = lines[i].substring(1);
            const added = lines[i].startsWith('+');
            const removed = lines[i].startsWith('-');

            changes.push({ lineNumber, text, added, removed });
            if (!removed) {
              lineNumber++;
            }
          }

          i--;
        }
      }
    }

    return changes;
  }

  private brightenHexColor(hexColor: string, factor: number): string {
    if (hexColor) {
      factor = Math.max(0, Math.min(1, factor));

      // Convert hex to RGB
      const bigint = parseInt(hexColor.slice(1), 16);
      let r = (bigint >> 16) & 255;
      let g = (bigint >> 8) & 255;
      let b = bigint & 255;

      // Brighten the RGB values
      r = Math.round(r + (255 - r) * factor);
      g = Math.round(g + (255 - g) * factor);
      b = Math.round(b + (255 - b) * factor);

      // Convert back to hex
      return '#' +
        ('00' + r.toString(16)).slice(-2) +
        ('00' + g.toString(16)).slice(-2) +
        ('00' + b.toString(16)).slice(-2);
    }
    return '#A499E8'
  }

  getBarChartLabels(data: any[]) {
    return data.map((contributor) => contributor.name)
  }

  getBarChartData(data: any[]) {
    return [{
      data: data.map((contributor) => contributor.commit_count),
      backgroundColor: ['#6855E0'],
      hoverBackgroundColor: this.brightenHexColor('#6855E0', 0.4),
    }]
  }

  formatData(data: any) {
    return [{
      data: data.total,
      backgroundColor: (data.colours as string[]).map((colour) => {
        return colour ? colour : '#6855E0'
      }),
      hoverBackgroundColor: (data.colours as string[]).map(colour => this.brightenHexColor(colour, 0.4)),
    }];
  }

  navigateToCommitDetails(sha: string) {
    this.router.navigateByUrl(`/repository/${this.repoOwner}/${this.repoName}/commits/${sha}`)
  }

  navigateToAllCommits() {
    this.router.navigateByUrl(`/repository/${this.repoOwner}/${this.repoName}/commits`)
  }
}
