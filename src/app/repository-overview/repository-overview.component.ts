import {Component, OnInit} from "@angular/core";
import {ActivatedRoute, Router} from "@angular/router";
import {UserService} from "../services/user-service";
import {Observable, of, switchMap, take} from "rxjs";
import {ChartOptions, ChartType} from "chart.js";

@Component({
  selector: 'repo-overview',
  templateUrl: 'repository-overview.component.html',
  styleUrls: ['repository-overview.component.scss']
})
export class RepositoryOverviewComponent implements OnInit {
  repoOverview$!: Observable<any>
  public repoOwner: string = '';
  public repoName: string = '';
  public pieChartOptions: ChartOptions<'pie'> = {
    responsive: false,
  };
  public chartLegend = false;
  public pieChartPlugins = [];

  public barChartOptions: any = {
    scaleShowVerticalLines: true,
    responsive: false,
  };
  public barChartType: ChartType = "bar";

  constructor(private route: ActivatedRoute, private userService: UserService, private router: Router) {}

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
