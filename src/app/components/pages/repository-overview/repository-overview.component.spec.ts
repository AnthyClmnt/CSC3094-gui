import {ComponentFixture, fakeAsync, TestBed, tick} from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import {ActivatedRoute, convertToParamMap, Router} from '@angular/router';
import { of } from 'rxjs';
import { RepositoryOverviewComponent } from './repository-overview.component';
import { UserService } from '../../../services/user-service';
import {LoadingComponent} from "../../shared/loading-component/loading-component.component";
import {SidebarComponent} from "../../shared/sidebar-component/sidebar.component";
import {BrowserAnimationsModule} from "@angular/platform-browser/animations";

describe('RepositoryOverviewComponent', () => {
  let component: RepositoryOverviewComponent;
  let fixture: ComponentFixture<RepositoryOverviewComponent>;
  let mockUserService: jasmine.SpyObj<UserService>;
  let mockActivatedRoute: any;
  let mockRouter: any;

  beforeEach(async () => {
    mockUserService = jasmine.createSpyObj('UserService', ['getRepoOverview']);

    mockActivatedRoute = {
      params: of({ repoOwner: 'owner', repoName: 'repo' })
    };

    mockRouter = {
      navigateByUrl: jasmine.createSpy('navigateByUrl')
    };

    mockUserService = jasmine.createSpyObj('UserService', ['getRepoOverview']);

    await TestBed.configureTestingModule({
      declarations: [RepositoryOverviewComponent, LoadingComponent, SidebarComponent],
      imports: [RouterTestingModule, BrowserAnimationsModule],
      providers: [
        { provide: UserService, useValue: mockUserService },
        { provide: Router, useValue: mockRouter },
        { provide: ActivatedRoute, useValue: mockActivatedRoute },
      ]
    })
      .compileComponents();

    mockRouter = TestBed.inject(Router);
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RepositoryOverviewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should map the bar chart data correctly', () => {
    const data = [
      { name: '1', toRemove: 'hi' },
      { name: '2', toRemove: 'hello' }
    ]

    expect(component.getBarChartLabels(data)).toEqual(['1', '2'])
  })

  it('should format the bar chart data correctly', () => {
    const data = [
      { name: '1', commit_count: 5 },
      { name: '2', commit_count: 7 }
    ]

    expect(component.getBarChartData(data)).toEqual([{
      data: [5, 7],
      backgroundColor: ['#6855E0'],
      hoverBackgroundColor: '#a499ec',
    }])
  });

  it('should format the language pie chart data correctly', () => {
    const data = {
      total: [25, 25, 50],
      labels: ['python', 'java', 'css'],
      colours: [undefined, '#FF5733', '#33FF57']
    };

    expect(component.formatData(data)).toEqual([{
      data: [25, 25, 50],
      backgroundColor: ['#6855E0', '#FF5733', '#33FF57'],
      hoverBackgroundColor: ['#A499E8', '#ff9a85', '#85ff9a'],
    }])
  });

  it('should navigate to commit details', () => {
    const mockSha = 'sha1';

    component.navigateToCommitDetails(mockSha);

    expect(mockRouter.navigateByUrl).toHaveBeenCalledWith(`/repository/${component.repoOwner}/${component.repoName}/commits/${mockSha}`);
  });

  it('should navigate to all commits', () => {
    component.navigateToAllCommits();

    expect(mockRouter.navigateByUrl).toHaveBeenCalledWith(`/repository/${component.repoOwner}/${component.repoName}/commits`);
  });

  it('should handle Init method correctly depending on if route parameters are provided', fakeAsync(() => {
    mockActivatedRoute.params = of({});
    component.ngOnInit();
    tick();

    expect(mockRouter.navigateByUrl).not.toHaveBeenCalled();
    expect(component.repoOverview$).toBeDefined();
    component.repoOverview$.subscribe(repoOverview => {
      expect(repoOverview).toBeNull();
    });

    mockActivatedRoute.params = of({});
    component.ngOnInit();
    tick();

    expect(mockRouter.navigateByUrl).toHaveBeenCalledWith('/');
    expect(component.repoOverview$).toBeDefined();
    component.repoOverview$.subscribe(repoOverview => {
      expect(repoOverview).toBeNull();
    });
  }));
});
