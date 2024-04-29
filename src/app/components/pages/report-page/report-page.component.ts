import {Component, OnInit} from '@angular/core';
import {Observable, switchMap} from "rxjs";
import {UserService} from "../../../services/user-service";
import {ActivatedRoute} from "@angular/router";
import {Chart} from "angular-highcharts";
import {XAxisOptions} from "highcharts";

@Component({
  selector: 'app-report-page',
  templateUrl: './report-page.component.html',
  styleUrls: ['./report-page.component.scss']
})
export class ReportPageComponent implements OnInit {
  public repoOwner!: string
  public repoName!: string
  public repoContributors$!: Observable<any>;
  public repoContributorData$?: Observable<any[]>;
  selectedContributorIndex: number = -1;
  months: string[] = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  days: string[] = ['Mon', 'Wed', 'Fri', 'Sun'];
  complexityChart: Chart;
  ltcChart: Chart;
  maintainChart: Chart;
  constructor(private userService: UserService, private route: ActivatedRoute) {
    this.complexityChart = new Chart({});
    this.ltcChart = new Chart({});
    this.maintainChart = new Chart({});
  }
  ngOnInit() {
    this.repoContributors$ = this.route.params
      .pipe(
        switchMap((params) => {
          this.repoOwner = params['repoOwner'];
          this.repoName = params['repoName'];

          return this.userService.getRepoContributors({
            repoOwner: this.repoOwner,
            repoName: this.repoName,
          });
        })
      )
  }

  selectContributor(index: number, name: string) {
    if (this.selectedContributorIndex === index) {
      this.selectedContributorIndex = -1;
      this.repoContributorData$ = undefined;
      return
    }

    this.selectedContributorIndex = index;
    this.repoContributorData$ = this.userService.getRepoContributorData({repoOwner: this.repoOwner, repoName: this.repoName, contributor: name})

    this.repoContributorData$.subscribe((data) => {
      this.generateChart(data[1])
    })
  }

  generateChart(data: any[]) {
    let maintainIndexArray: any[] = [];
    let ltcRatioArray: any[] = [];
    let complexityArray: any[] = [];

    data.forEach(item => {
      const date = item[0];
      const month = this.getMonthName(date)
      const maintainIndex = parseFloat(item[1].toFixed(2));
      const ltcRatio = parseFloat(item[2].toFixed(2));
      const complexity = parseFloat(item[3].toFixed(2));

      maintainIndexArray.push([month, maintainIndex]);
      ltcRatioArray.push([month, ltcRatio]);
      complexityArray.push([month, complexity]);
    });

    this.complexityChart = new Chart({
      chart: {
        type: 'areaspline',
        style: {
          fontWeight: '400',
        }
      },
      title: {
        text: 'Complexity Chart'
      },
      yAxis: {
        title: {
          text: 'Avg Complexity'
        }
      },
      credits: {
        enabled: false
      },
      xAxis: {
        type: 'category',
        categories: complexityArray.map(([month, _]) => month)
      } as XAxisOptions,
      series: [
        {
          name: 'Complexity',
          type: 'areaspline',
          data: complexityArray,
          color: '#806be1'
        }
      ]
    });

    this.maintainChart = new Chart({
      chart: {
        type: 'areaspline',
        style: {
          fontWeight: '400',
        }
      },
      title: {
        text: 'Maintainability Chart'
      },
      yAxis: {
        title: {
          text: 'Avg Maintainability'
        }
      },
      credits: {
        enabled: false
      },
      xAxis: {
        type: 'category',
        categories: maintainIndexArray.map(([month, _]) => month)
      } as XAxisOptions,
      series: [
        {
          name: 'Maintainability',
          type: 'areaspline',
          data: maintainIndexArray,
          color: '#806be1'
        }
      ]
    });

    this.ltcChart = new Chart({
      chart: {
        type: 'areaspline',
        style: {
          fontWeight: '400',
        }
      },
      title: {
        text: 'Comment Ratio Chart'
      },
      yAxis: {
        title: {
          text: 'Avg LTC ratio'
        }
      },
      credits: {
        enabled: false
      },
      xAxis: {
        type: 'category',
        categories: ltcRatioArray.map(([month, _]) => month)
      } as XAxisOptions,
      series: [
        {
          name: 'CTL Ratio',
          type: 'areaspline',
          data: ltcRatioArray,
          color: '#806be1'
        }
      ]
    });
  }

  getMonthName(dateStr: string): string {
    const date = new Date(dateStr);
    const monthIndex = date.getMonth();
    return this.months[monthIndex];
  }

  generateHeatmapData(heatmapData: any[]): any[] {
    const heatmapArray = [];
    for (let i = 0; i < 52; i++) {
      const week = [];
      for (let j = 0; j < 7; j++) {
        const dayIndex = i * 7 + j;
        const heatmapDay = heatmapData.find(data => new Date(data[0]).getDay() === j && this.getWeekNumber(new Date(data[0])) === i + 1);
        week.push(heatmapDay ? heatmapDay[1] : 0);
      }
      heatmapArray.push(week);
    }
    return heatmapArray;
  }

  getWeekNumber(date: Date): number {
    const oneJan = new Date(date.getFullYear(), 0, 1);
    return Math.ceil(((date.getTime() - oneJan.getTime()) / 86400000 + oneJan.getDay() + 1) / 7);
  }

  getColor(value: number): string {
    const baseHue = 248; // Hue for purple color
    const baseSaturation = 53; // Saturation for purple color
    const baseLightness = 90; // Base lightness for purple color

    const maxLightness = 25; // Maximum lightness (darker color)
    const lightness = baseLightness - (value * (baseLightness - maxLightness) / 10); // Adjust lightness based on value
    return `hsl(${baseHue}, ${baseSaturation}%, ${lightness}%)`;
  }
}
