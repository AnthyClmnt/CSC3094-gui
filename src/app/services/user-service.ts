import {Injectable} from "@angular/core";
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {Observable, of, shareReplay, take} from "rxjs";
import {AuthService, CachedResponse} from "./auth-service";
import {CommitDetails, GitHubRepo, RepoCommit, User} from "../shared/openapi";
import {tap} from "rxjs/operators";

@Injectable({
  providedIn: 'root',
})
export class UserService {
  private apiUrl = 'http://localhost:8000';
  private cachedResponses: { [key: string]: CachedResponse } = {};

  constructor(private http: HttpClient, private authService: AuthService) {}

  public getUserInfo(): Observable<User> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${this.authService.getToken()}`,
    });

    return this.http.get<User>(`${this.apiUrl}/user/me`,{headers}).pipe(take(1));
  }

  public getRepos(): Observable<GitHubRepo[]> {
    const cacheKey = 'githubRepos';
    const cachedData = this.cachedResponses[cacheKey];

    if (cachedData && Date.now() - cachedData.timestamp < 60000) {
      return of(cachedData.data as GitHubRepo[])
    }

    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${this.authService.getToken()}`,
    });

    return this.http.get<GitHubRepo[]>('http://localhost:8000/github/repos', {headers}).pipe(
      shareReplay(1),
      tap((response) => {
        this.cachedResponses[cacheKey] = { data: response, timestamp: Date.now()}
      })
    )
  }

  public getCommits(params: {repoOwner : string, repoName : string}): Observable<RepoCommit[]> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${this.authService.getToken()}`,
    });

    return this.http.get<RepoCommit[]>(`http://localhost:8000/github/commits?repoOwner=${params.repoOwner}&repoName=${params.repoName}`, {headers})
  }

  public getRepoOverview(params: {repoOwner : string, repoName : string}): Observable<any> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${this.authService.getToken()}`,
    });

    return this.http.get<RepoCommit[]>(`http://localhost:8000/github/repo-overview?repoOwner=${params.repoOwner}&repoName=${params.repoName}`, {headers})
  }

  public getCommitDetails(params: {repoOwner : string, repoName : string, sha: string}): Observable<CommitDetails> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${this.authService.getToken()}`,
    });

    return this.http.get<CommitDetails>(`http://localhost:8000/github/commit/changes?repoOwner=${params.repoOwner}&repoName=${params.repoName}&sha=${params.sha}`, {headers})
  }
}
