import {Component, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from "@angular/router";
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {AuthService} from "../services/auth-service";

@Component({
  selector: 'github-auth-callback',
  templateUrl: './github-auth-callback.component.html',
  styleUrls: ['./github-auth-callback.component.css']
})
export class GithubAuthCallbackComponent implements OnInit {
  constructor(private  route: ActivatedRoute, private http: HttpClient, private router: Router, private authService: AuthService) {}

  ngOnInit() {
    this.route.queryParams.subscribe((params) => {
      const code = params['code'];
      const headers = new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${this.authService.getToken()}`,
      });

      if (code) {
        this.http.post(`http://localhost:8000/github/access-token`, {code: code}, {headers})
          .subscribe((res) => {
            sessionStorage.setItem("githubToken", res.toString())
            this.router.navigateByUrl('').then()
          })
      }
      else {
        const code = params['error'];
        console.log(code);
        this.router.navigateByUrl('/github-connect').then()
      }
    })
  }
}
