import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {GithubAuthCallbackComponent} from "./github-auth-callback/github-auth-callback.component";
import {RegisterComponent} from "./register/register.component";
import {LoginComponent} from "./login/login.component";
import {AuthGuard} from "./shared/auth.guard";
import {DashboardComponent} from "./dashboard/dashboard.component";
import {CodeFileChangesComponent} from "./codeFileChanges/codeFileChanges.component";
import {RepoCommitHistoryComponent} from "./repo-commit-history/repo-commit-history.component";

const routes: Routes = [
  { path: '', redirectTo: 'dashboard', pathMatch: 'full'},
  { path: 'dashboard', component: DashboardComponent, canActivate: [AuthGuard]},
  { path: 'callback', component: GithubAuthCallbackComponent },
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  { path: 'commit-history/:repoOwner/:repoName', component: RepoCommitHistoryComponent, canActivate: [AuthGuard] },
  { path: 'commit-history/:repoOwner/:repoName/:sha', component: CodeFileChangesComponent, canActivate: [AuthGuard] }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
