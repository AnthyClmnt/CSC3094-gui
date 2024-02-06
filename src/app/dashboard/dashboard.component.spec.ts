import { ComponentFixture, TestBed } from '@angular/core/testing';
import { DashboardComponent } from './dashboard.component';
import { UserService } from '../services/user-service';
import { RouterTestingModule } from '@angular/router/testing';
import { GitHubRepo } from '../shared/openapi';
import { Router } from '@angular/router';
import {SearchComponent} from "../shared/search-component/search.component";

describe('DashboardComponent', () => {
  let component: DashboardComponent;
  let fixture: ComponentFixture<DashboardComponent>;
  let mockUserService: jasmine.SpyObj<UserService>;
  let mockRouter: jasmine.SpyObj<Router>;

  beforeEach(async () => {
    mockUserService = jasmine.createSpyObj('UserService', ['getRepos']);
    mockRouter = jasmine.createSpyObj('Router', ['navigateByUrl']);

    await TestBed.configureTestingModule({
      declarations: [DashboardComponent, SearchComponent],
      imports: [RouterTestingModule],
      providers: [
        { provide: UserService, useValue: mockUserService },
        { provide: Router, useValue: mockRouter }
      ]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DashboardComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });


  it('should navigate to commits page', () => {
    const repoOwner = 'user1';
    const repoName = 'Repo1';
    component.navigateToCommits(repoOwner, repoName)
    expect(mockRouter.navigateByUrl).toHaveBeenCalledWith(`/repository/${repoOwner}/${repoName}`);
  });

  it('should update filteredRepos when search result is received', () => {
    const searchResult: GitHubRepo[] = [{ repoName: 'Repo1', commitsUrl: '', visibility: '', description: '', updatedAt: '', owner: { name: 'user1', avatarUrl: '' }}];
    component.onSearchResult(searchResult);
    expect(component.filteredRepos).toEqual(searchResult);
  });
});
