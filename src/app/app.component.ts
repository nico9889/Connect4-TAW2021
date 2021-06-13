import {Component} from '@angular/core';
import {AuthService} from './services/auth.service';
import {UserService} from './services/user.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  auth: AuthService;

  constructor(auth: AuthService, private users: UserService) {
    this.auth = auth;
  }

  logout(): void {
    this.auth.logout();
  }
}
