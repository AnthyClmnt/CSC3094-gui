import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppComponent } from './app.component';
import {GithubAuthCallbackComponent} from "./github-auth-callback/github-auth-callback.component";
import {AppRoutingModule} from "./app-routing-module";
import {GithubConnectComponent} from "./github-connect/github-connect.component";
import {HTTP_INTERCEPTORS, HttpClientModule} from "@angular/common/http";
import {AuthService} from "./services/auth-service";
import {LoadingComponent} from "./shared/loading-component/loading-component.component";
import {LoginComponent} from "./login/login.component";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {RegisterComponent} from "./register/register.component";
import {AuthGuard} from "./shared/auth.guard";
import {DashboardComponent} from "./dashboard/dashboard.component";
import {UserService} from "./services/user-service";
import {NavBarComponent} from "./shared/nav-bar/nav-bar.component";
import {NgIconsModule} from "@ng-icons/core";
import {heroBugAnt, heroChartBar, heroShieldExclamation, heroSquares2x2, heroCog6Tooth, heroArrowLeftOnRectangle, heroArrowRight, heroCodeBracket, heroMagnifyingGlass, heroFaceFrown, heroDocument, heroChevronDown, heroChevronUp, heroArrowLeft} from '@ng-icons/heroicons/outline'
import {CodeFileChangesComponent} from "./codeFileChanges/codeFileChanges.component";
import {RepoCommitHistoryComponent} from "./repo-commit-history/repo-commit-history.component";
import {AppBarComponent} from "./shared/app-bar/app-bar.component";
import {SearchComponent} from "./shared/search-component/search.component";
import {AccordionComponent} from "./shared/accordion-component/accordion.component";
import {TokenInterceptor} from "./token.interceptor";
import {GithubGuard} from "./shared/github.guard";
import {LoadingService} from "./services/loading.service";
import {UnAuthGuard} from "./shared/unAuth.guard";
import {UnGithubGuard} from "./shared/unGithub.guard";
import {NotFoundPageComponent} from "./not-found-page/not-found-page.component";
import {RepositoryOverviewComponent} from "./repository-overview/repository-overview.component";
import { NgChartsModule } from 'ng2-charts';

@NgModule({
  declarations: [
    AppComponent,
    GithubAuthCallbackComponent,
    GithubConnectComponent,
    LoadingComponent,
    LoginComponent,
    RegisterComponent,
    DashboardComponent,
    NavBarComponent,
    CodeFileChangesComponent,
    RepoCommitHistoryComponent,
    AppBarComponent,
    SearchComponent,
    NotFoundPageComponent,
    AccordionComponent,
    RepositoryOverviewComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    NgChartsModule,
    FormsModule,
    ReactiveFormsModule,
    NgIconsModule.withIcons({ heroCog6Tooth, heroBugAnt, heroChartBar, heroShieldExclamation, heroSquares2x2, heroArrowLeftOnRectangle, heroArrowRight, heroCodeBracket, heroMagnifyingGlass, heroFaceFrown, heroDocument, heroChevronDown, heroChevronUp, heroArrowLeft }),
  ],
  providers: [AuthService, AuthGuard, UnAuthGuard, GithubGuard, UnGithubGuard, UserService, LoadingService, { provide: HTTP_INTERCEPTORS, useClass: TokenInterceptor, multi: true }],
  bootstrap: [AppComponent]
})
export class AppModule { }
