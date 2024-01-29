import {Injectable} from "@angular/core";
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {Observable, take} from "rxjs";
import {AuthService} from "./auth-service";
import {CommitDetails, GitHubRepo, RepoCommit, User} from "../shared/openapi";

@Injectable({
  providedIn: 'root',
})
export class UserService {
  private apiUrl = 'http://localhost:8000';
  private gitReposCache$!: Observable<GitHubRepo[]>;

  constructor(private http: HttpClient, private authService: AuthService) {}

  public getUserInfo(): Observable<User> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${this.authService.getToken()}`,
    });

    return this.http.get<User>(`${this.apiUrl}/user/me`,{headers}).pipe(take(1));
  }

  public getRepos(): Observable<GitHubRepo[]> {
    if (!this.gitReposCache$) {
      const headers = new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${this.authService.getToken()}`,
      });

      this.gitReposCache$ = this.http.get<GitHubRepo[]>('http://localhost:8000/github/repos', {headers})
    }

    return this.gitReposCache$;
  }

  public getCommits(params: {repoOwner : string, repoName : string}): Observable<RepoCommit[]> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${this.authService.getToken()}`,
    });

    return this.http.get<RepoCommit[]>(`http://localhost:8000/github/commits?repoOwner=${params.repoOwner}&repoName=${params.repoName}`, {headers})
  }

  public getCommitDetails(params: {repoOwner : string, repoName : string, sha: string}): Observable<CommitDetails> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${this.authService.getToken()}`,
    });

    return this.http.get<CommitDetails>(`http://localhost:8000/github/commit/changes?repoOwner=${params.repoOwner}&repoName=${params.repoName}&sha=${params.sha}`, {headers})
  }
}
