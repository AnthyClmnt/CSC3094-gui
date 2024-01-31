import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {GithubAuthCallbackComponent} from "./github-auth-callback/github-auth-callback.component";
import {RegisterComponent} from "./register/register.component";
import {LoginComponent} from "./login/login.component";
import {AuthGuard} from "./shared/auth.guard";
import {DashboardComponent} from "./dashboard/dashboard.component";
import {CodeFileChangesComponent} from "./codeFileChanges/codeFileChanges.component";
import {RepoCommitHistoryComponent} from "./repo-commit-history/repo-commit-history.component";
import {GithubConnectComponent} from "./github-connect/github-connect.component";
import {GithubGuard} from "./shared/github.guard";
import {UnAuthGuard} from "./shared/unAuth.guard";
import {UnGithubGuard} from "./shared/unGithub.guard";
import {NotFoundPageComponent} from "./not-found-page/not-found-page.component";

const routes: Routes = [
  { path: '', redirectTo: 'dashboard', pathMatch: 'full'},
  { path: 'dashboard', component: DashboardComponent, canActivate: [AuthGuard, GithubGuard]},
  { path: 'github-connect', component: GithubConnectComponent, canActivate: [AuthGuard, UnGithubGuard]},
  { path: 'callback', component: GithubAuthCallbackComponent, canActivate: [AuthGuard, UnGithubGuard]},
  { path: 'login', component: LoginComponent, canActivate: [UnAuthGuard]},
  { path: 'register', component: RegisterComponent, canActivate: [UnAuthGuard]},
  { path: 'commit-history/:repoOwner/:repoName', component: RepoCommitHistoryComponent, canActivate: [AuthGuard, GithubGuard]},
  { path: 'commit-history/:repoOwner/:repoName/:sha', component: CodeFileChangesComponent, canActivate: [AuthGuard, GithubGuard]},

  { path: '**', redirectTo: '/404'},
  { path: '404', component: NotFoundPageComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
