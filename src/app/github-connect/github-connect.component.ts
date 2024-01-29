import {Component} from '@angular/core';

@Component({
  selector: 'github-connect',
  templateUrl: './github-connect.component.html',
  styleUrls: ['./github-connect.component.css']
})
export class GithubConnectComponent {
  public repoInfo: any;

  public authenticate() {
    window.location.href = `https://github.com/login/oauth/authorize?client_id=aa1d86085f6d2590842d&redirect_uri=http://localhost:4200/callback&scope=repo`;
  }

  public showConnect() {
    return sessionStorage.getItem("githubToken");
  }
}
