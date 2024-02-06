import {TestBed} from '@angular/core/testing';
import {HttpClientTestingModule, HttpTestingController} from '@angular/common/http/testing';
import {UserService} from "./user-service";
import {AuthService} from "./auth-service";
import {CommitDetails, GitHubRepo, RepoCommit, User} from "../shared/openapi";
import {HttpClient} from "@angular/common/http";
import {of} from "rxjs";

describe('UserService', () => {
  let service: UserService;
  let httpMock: HttpTestingController;
  let authServiceSpy: jasmine.SpyObj<AuthService>;

  beforeEach(() => {
    const authServiceSpyObj = jasmine.createSpyObj('AuthService', ['getToken']);
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [
        UserService,
        { provide: AuthService, useValue: authServiceSpyObj }
      ]
    });
    service = TestBed.inject(UserService);
    httpMock = TestBed.inject(HttpTestingController);
    authServiceSpy = TestBed.inject(AuthService) as jasmine.SpyObj<AuthService>;
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should send GitHub connection token', () => {
    const mockAccessToken = 'mock-access-token';
    const code = 'mock-code';
    authServiceSpy.getToken.and.returnValue('fake-token');

    service.connectGitHub(code).subscribe(response => {
      expect(response).toEqual(mockAccessToken);
    });

    const req = httpMock.expectOne('http://localhost:8000/github/access-token');
    expect(req.request.method).toBe('POST');
    expect(req.request.body.code).toBe(code);
    expect(req.request.headers.get('Content-Type')).toBe('application/json');
    expect(req.request.headers.get('Authorization')).toBe('Bearer fake-token');
    req.flush(mockAccessToken);
  });

  it('should retrieve user info', () => {
    const mockUser: User = { id: 1, email: 'test@test.com', forename: 'test', githubConnected: false };
    authServiceSpy.getToken.and.returnValue('fake-token');

    service.getUserInfo().subscribe(user => {
      expect(user).toEqual(mockUser);
    });

    const req = httpMock.expectOne('http://localhost:8000/user/me');
    expect(req.request.method).toBe('GET');
    req.flush(mockUser);
  });

  it('should retrieve repos from api', () => {
    const mockRepos: GitHubRepo[] = [{ repoName: 'name', owner: {avatarUrl: '', name: 'name'}, commitsUrl: '', visibility: '', updatedAt: '' }];
    const cacheKey = 'githubRepos';
    service['cachedResponses'][cacheKey] = {
      data: mockRepos,
      timestamp: Date.now() - 60000000
    };
    authServiceSpy.getToken.and.returnValue('fake-token');

    service.getRepos().subscribe(repos => {
      expect(repos).toEqual(mockRepos);
    });

    const req = httpMock.expectOne('http://localhost:8000/github/repos');
    expect(req.request.method).toBe('GET');
    req.flush(mockRepos);
  });

  it('should retrieve repos from cache', () => {
    const mockCachedRepos: GitHubRepo[] = [{ repoName: 'name', owner: {avatarUrl: '', name: 'name'}, commitsUrl: '', visibility: '', updatedAt: '' }];
    const cacheKey = 'githubRepos';
    service['cachedResponses'][cacheKey] = {
      data: mockCachedRepos,
      timestamp: Date.now() - 30000
    };

    authServiceSpy.getToken.and.returnValue('fake-token');
    const httpSpy = spyOn(TestBed.inject(HttpClient), 'get').and.returnValue(of(mockCachedRepos));

    service.getRepos().subscribe(repos => {
      expect(repos).toEqual(mockCachedRepos);
      expect(httpSpy).not.toHaveBeenCalled();
    });
  });

  it('should retrieve commits', () => {
    const mockCommits: RepoCommit[] = [
      {
        sha: '1',
        commit: {
          author: {
            name: 'name',
            date: ''
          },
          message: 'commit message'
        }
      }
    ];
    authServiceSpy.getToken.and.returnValue('fake-token');

    service.getCommits({ repoOwner: 'owner', repoName: 'repo' }).subscribe(commits => {
      expect(commits).toEqual(mockCommits);
    });

    const req = httpMock.expectOne('http://localhost:8000/github/commits?repoOwner=owner&repoName=repo');
    expect(req.request.method).toBe('GET');
    req.flush(mockCommits);
  });

  it('should retrieve repo overview', () => {
    const mockOverview = { stars: 10, forks: 5 };
    authServiceSpy.getToken.and.returnValue('fake-token');

    service.getRepoOverview({ repoOwner: 'owner', repoName: 'repo' }).subscribe(overview => {
      expect(overview).toEqual(mockOverview);
    });

    const req = httpMock.expectOne('http://localhost:8000/github/repo-overview?repoOwner=owner&repoName=repo');
    expect(req.request.method).toBe('GET');
    req.flush(mockOverview);
  });

  it('should retrieve commit details', () => {
    const mockCommitDetails: CommitDetails = {
      sha: '1',
      commit: {
        author: {
          name: 'name',
          date: ''
        },
        message: 'commit message'
      },
      stats: {
        total: 1,
        additions: 1,
        deletions: 0
      },
      files: []
    };

    authServiceSpy.getToken.and.returnValue('fake-token');

    service.getCommitDetails({ repoOwner: 'owner', repoName: 'repo', sha: '123' }).subscribe(details => {
      expect(details).toEqual(mockCommitDetails);
    });

    const req = httpMock.expectOne('http://localhost:8000/github/commit/changes?repoOwner=owner&repoName=repo&sha=123');
    expect(req.request.method).toBe('GET');
    req.flush(mockCommitDetails);
  });
});
