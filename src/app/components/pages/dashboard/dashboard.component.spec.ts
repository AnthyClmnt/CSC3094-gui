import {ComponentFixture, fakeAsync, TestBed, tick} from '@angular/core/testing';
import { DashboardComponent } from './dashboard.component';
import { UserService } from '../../../services/user-service';
import { RouterTestingModule } from '@angular/router/testing';
import { GitHubRepo } from '../../../shared/openapi';
import { Router } from '@angular/router';
import {SearchComponent} from "../../shared/search-component/search.component";
import {of} from "rxjs";
import {NgIconsModule} from "@ng-icons/core";
import {heroMagnifyingGlass} from "@ng-icons/heroicons/outline";
import {FormsModule} from "@angular/forms";

const mockRepos: GitHubRepo[] = [{ repoName: 'Repo1', commitsUrl: '', visibility: '', description: '', updatedAt: '', owner: { name: 'user1', avatarUrl: '' }}];

describe('DashboardComponent', () => {
  let component: DashboardComponent;
  let fixture: ComponentFixture<DashboardComponent>;
  let mockUserService: jasmine.SpyObj<UserService>;
  let mockRouter: jasmine.SpyObj<Router>;

  beforeEach(async () => {
    mockUserService = jasmine.createSpyObj('UserService', ['getRepos']);
    mockRouter = jasmine.createSpyObj('Router', ['navigateByUrl']);

    mockUserService.getRepos.and.returnValue(of(mockRepos));

    await TestBed.configureTestingModule({
      declarations: [DashboardComponent, SearchComponent],
      imports: [RouterTestingModule, FormsModule, NgIconsModule.withIcons({heroMagnifyingGlass})],
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

  it('should subscribe to userRepos$ and assign the received value to filteredRepos', fakeAsync(() => {
    fixture.detectChanges();
    tick();

    expect(component.filteredRepos).toEqual(mockRepos);
  }));
});
