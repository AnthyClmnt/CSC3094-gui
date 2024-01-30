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

const routes: Routes = [
  { path: '', redirectTo: 'dashboard', pathMatch: 'full'},
  { path: 'dashboard', component: DashboardComponent, canActivate: [AuthGuard, GithubGuard]},
  { path: 'github-connect', component: GithubConnectComponent, canActivate: [AuthGuard]},
  { path: 'callback', component: GithubAuthCallbackComponent, canActivate: [AuthGuard] },
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  { path: 'commit-history/:repoOwner/:repoName', component: RepoCommitHistoryComponent, canActivate: [AuthGuard, GithubGuard]},
  { path: 'commit-history/:repoOwner/:repoName/:sha', component: CodeFileChangesComponent, canActivate: [AuthGuard, GithubGuard]}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
