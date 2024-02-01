import {Component, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from "@angular/router";
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {AuthService} from "../services/auth-service";
import {LoadingService} from "../services/loading.service";
import {take} from "rxjs";

@Component({
  selector: 'github-auth-callback',
  templateUrl: './github-auth-callback.component.html',
  styleUrls: ['./github-auth-callback.component.css']
})
export class GithubAuthCallbackComponent implements OnInit {
  constructor(private  route: ActivatedRoute, private http: HttpClient, private router: Router, private authService: AuthService, private loadingService: LoadingService) {}

  ngOnInit() {
    this.loadingService.setLoading({
      active: true,
      text: 'Establishing GitHub Connection...',
      overlay: true
    });
    this.route.queryParams.subscribe((params) => {
      const code = params['code'];
      const headers = new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${this.authService.getToken()}`,
      });

      if (code) {
        this.http.post(`http://localhost:8000/github/access-token`, {code: code}, {headers})
          .pipe(take(1))
          .subscribe(() => {
            this.loadingService.deactivateLoading();
            window.location.reload()
          })
      }
      else {
        this.loadingService.deactivateLoading();
        this.router.navigateByUrl('/github-connect').then()
      }
    })
  }
}
