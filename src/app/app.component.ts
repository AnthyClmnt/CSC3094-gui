import {Component, OnDestroy, OnInit} from '@angular/core';
import {AuthService} from "./services/auth-service";
import {Subscription} from "rxjs";
import {LoadingService, LoadingState} from "./services/loading.service";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit, OnDestroy {
  constructor(public authService: AuthService, private loadingService: LoadingService) {}
  isLoggedIn$ = this.authService.isAuthenticated();
  globalLoading!: LoadingState
  private globalLoadingSubscription!: Subscription;

  ngOnInit() {
    this.globalLoadingSubscription = this.loadingService.getLoading().subscribe((state) => {
      this.globalLoading = state;
    });
  }

  ngOnDestroy() {
    if (this.globalLoadingSubscription) {
      this.globalLoadingSubscription.unsubscribe();
    }
  }
}
