import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppComponent } from './app.component';
import {GithubAuthCallbackComponent} from "./components/pages/github-auth-callback/github-auth-callback.component";
import {AppRoutingModule} from "./app-routing-module";
import {GithubConnectComponent} from "./components/pages/github-connect/github-connect.component";
import {HTTP_INTERCEPTORS, HttpClientModule} from "@angular/common/http";
import {AuthService} from "./services/auth-service";
import {LoadingComponent} from "./components/shared/loading-component/loading-component.component";
import {LoginComponent} from "./components/pages/login/login.component";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {RegisterComponent} from "./components/pages/register/register.component";
import {AuthGuard} from "./shared/auth.guard";
import {DashboardComponent} from "./components/pages/dashboard/dashboard.component";
import {UserService} from "./services/user-service";
import {NavBarComponent} from "./components/shared/nav-bar/nav-bar.component";
import {NgIconsModule} from "@ng-icons/core";
import {heroBugAnt, heroChartBar, heroShieldExclamation, heroSquares2x2, heroCog6Tooth, heroArrowLeftOnRectangle, heroArrowRight, heroCodeBracket, heroMagnifyingGlass, heroFaceFrown, heroDocument, heroChevronDown, heroChevronUp, heroArrowLeft, heroArrowPath, heroExclamationTriangle, heroDocumentText, heroSun, heroMoon} from '@ng-icons/heroicons/outline'
import {CodeFileChangesComponent} from "./components/pages/code-file-changes/code-file-changes.component";
import {RepoCommitHistoryComponent} from "./components/pages/repo-commit-history/repo-commit-history.component";
import {AppBarComponent} from "./components/shared/app-bar/app-bar.component";
import {SearchComponent} from "./components/shared/search-component/search.component";
import {AccordionComponent} from "./components/shared/accordion-component/accordion.component";
import {TokenInterceptor} from "./shared/token.interceptor";
import {GithubGuard} from "./shared/github.guard";
import {LoadingService} from "./services/loading.service";
import {UnAuthGuard} from "./shared/unAuth.guard";
import {UnGithubGuard} from "./shared/unGithub.guard";
import {NotFoundPageComponent} from "./components/pages/not-found-page/not-found-page.component";
import {RepositoryOverviewComponent} from "./components/pages/repository-overview/repository-overview.component";
import { NgChartsModule } from 'ng2-charts';
import { SettingsPageComponent } from './components/pages/settings-page/settings-page.component';

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
    SettingsPageComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    NgChartsModule,
    FormsModule,
    ReactiveFormsModule,
    NgIconsModule.withIcons({ heroCog6Tooth, heroBugAnt, heroChartBar, heroShieldExclamation, heroSquares2x2, heroArrowLeftOnRectangle, heroArrowRight, heroCodeBracket, heroMagnifyingGlass, heroFaceFrown, heroDocument, heroChevronDown, heroChevronUp, heroArrowLeft, heroArrowPath, heroExclamationTriangle, heroDocumentText, heroSun, heroMoon}),
  ],
  providers: [AuthService, AuthGuard, UnAuthGuard, GithubGuard, UnGithubGuard, UserService, LoadingService, { provide: HTTP_INTERCEPTORS, useClass: TokenInterceptor, multi: true }],
  bootstrap: [AppComponent]
})
export class AppModule { }
