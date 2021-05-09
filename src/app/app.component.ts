import {Component} from '@angular/core';
import {FRIENDS} from './mock-friends';
import {Friend} from './models/Friend';
import {UserBasicAuthService} from './services/user-basic-auth.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  public title: 'Connect 4';
  friends: Friend[] = FRIENDS;
  us: UserBasicAuthService;

  constructor(us: UserBasicAuthService) {
    this.us = us;
  }

  logout(): void {
    this.us.logout();
  }
}
