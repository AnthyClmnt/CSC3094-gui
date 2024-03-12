import { ComponentFixture, TestBed } from '@angular/core/testing';
import {ActivatedRoute, convertToParamMap, Router} from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { RepoCommitHistoryComponent } from './repo-commit-history.component';
import { UserService } from '../../../services/user-service';
import { of } from 'rxjs';
import { RepoCommit } from '../../../shared/openapi';
import {NgIconsModule} from "@ng-icons/core";
import {heroCodeBracket} from "@ng-icons/heroicons/outline";

describe('RepoCommitHistoryComponent', () => {
  let component: RepoCommitHistoryComponent;
  let fixture: ComponentFixture<RepoCommitHistoryComponent>;
  let mockUserService: jasmine.SpyObj<UserService>;
  const mockRepoOwner = 'user1';
  const mockRepoName = 'repo1';
  const mockCommits: RepoCommit[] = [
    { sha: 'sha1', commit: { message: 'Commit 1', author: { name: 'user1', date: ''} }},
    { sha: 'sha2', commit: { message: 'Commit 2', author: { name: 'user1', date: ''} }}
  ];

  beforeEach(async () => {
    mockUserService = jasmine.createSpyObj('UserService', ['getCommits']);

    await TestBed.configureTestingModule({
      declarations: [RepoCommitHistoryComponent],
      imports: [RouterTestingModule, NgIconsModule.withIcons({heroCodeBracket})],
      providers: [
        { provide: UserService, useValue: mockUserService },
        { provide: ActivatedRoute, useValue: { params: of(convertToParamMap({ repoOwner: mockRepoOwner, repoName: mockRepoName })) } }
      ]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RepoCommitHistoryComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should fetch commits on initialization', () => {
    mockUserService.getCommits.and.returnValue(of(mockCommits));

    fixture.detectChanges();

    expect(component.commits$).toBeDefined();
    component.commits$.subscribe(commits => {
      expect(commits).toEqual(mockCommits);
    });
  });

  it('should navigate to commit details', () => {
    const mockSha = 'sha1';
    component.repoOwner = 'user1';
    component.repoName = 'repo1';
    const routerSpy = spyOn(TestBed.inject(Router), 'navigateByUrl');

    component.navigateToCommitDetails(mockSha);

    expect(routerSpy).toHaveBeenCalledWith(`/repository/${mockRepoOwner}/${mockRepoName}/commits/${mockSha}`);
  });
});
