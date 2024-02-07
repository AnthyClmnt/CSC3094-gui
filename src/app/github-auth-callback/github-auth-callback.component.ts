import {Component, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from "@angular/router";
import {HttpClient} from "@angular/common/http";
import {AuthService} from "../services/auth-service";
import {LoadingService} from "../services/loading.service";
import {UserService} from "../services/user-service";

@Component({
  selector: 'github-auth-callback',
  templateUrl: './github-auth-callback.component.html',
  styleUrls: ['./github-auth-callback.component.scss']
})
export class GithubAuthCallbackComponent implements OnInit {
  constructor(private route: ActivatedRoute, private http: HttpClient, private userService: UserService, private router: Router, private authService: AuthService, private loadingService: LoadingService) {}

  ngOnInit() {
    this.loadingService.setLoading({
      active: true,
      text: 'Establishing GitHub Connection...',
      overlay: true
    });
    this.route.queryParams.subscribe((params) => {
      const code = params['code'];

      if (code) {
        this.userService.connectGitHub(code)
          .subscribe(() => {
            this.authService.clearCache('githubConnected');
            this.loadingService.deactivateLoading();
            this.router.navigateByUrl('/dashboard')
          })
      }
      else {
        this.loadingService.deactivateLoading();
        this.router.navigateByUrl('/github-connect')
      }
    })
  }
}
