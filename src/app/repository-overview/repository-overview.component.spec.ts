import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import {ActivatedRoute, convertToParamMap, Router} from '@angular/router';
import { of } from 'rxjs';
import { RepositoryOverviewComponent } from './repository-overview.component';
import { UserService } from '../services/user-service';
import {LoadingComponent} from "../shared/loading-component/loading-component.component";

describe('RepositoryOverviewComponent', () => {
  let component: RepositoryOverviewComponent;
  let fixture: ComponentFixture<RepositoryOverviewComponent>;
  let mockUserService: jasmine.SpyObj<UserService>;
  let mockRouter: Router;

  const mockRepoOwner = 'owner';
  const mockRepoName = 'repo';

  beforeEach(async () => {
    mockUserService = jasmine.createSpyObj('UserService', ['getRepoOverview']);

    await TestBed.configureTestingModule({
      declarations: [RepositoryOverviewComponent, LoadingComponent],
      imports: [RouterTestingModule],
      providers: [
        { provide: UserService, useValue: mockUserService },
        { provide: ActivatedRoute, useValue: { params: of(convertToParamMap({ repoOwner: mockRepoOwner, repoName: mockRepoName })) } }
      ]
    })
      .compileComponents();

    mockRouter = TestBed.inject(Router);
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RepositoryOverviewComponent);
    component = fixture.componentInstance;
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
    const routerSpy = spyOn(mockRouter, 'navigateByUrl').and.returnValue(Promise.resolve(true));

    component.navigateToCommitDetails(mockSha);

    expect(routerSpy).toHaveBeenCalledWith(`/repository/${component.repoOwner}/${component.repoName}/commits/${mockSha}`);
  });

  it('should navigate to all commits', () => {
    const routerSpy = spyOn(mockRouter, 'navigateByUrl').and.returnValue(Promise.resolve(true));

    component.navigateToAllCommits();

    expect(routerSpy).toHaveBeenCalledWith(`/repository/${component.repoOwner}/${component.repoName}/commits`);
  });
});
