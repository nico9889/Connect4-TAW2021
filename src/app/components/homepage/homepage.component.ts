import {Component, OnInit} from '@angular/core';
import {AuthService} from '../../services/auth.service';
import {UserService} from '../../services/user.service';
import {User} from '../../models/user';

@Component({
  selector: 'app-homepage',
  templateUrl: './homepage.component.html',
  styleUrls: ['./homepage.component.css']
})
export class HomepageComponent implements OnInit {
  alert = '';
  success = true;
  rankedBadge = 0;
  scrimmageBadge = 0;
  auth: AuthService;

  constructor(auth: AuthService, private users: UserService) {
    this.auth = auth;
  }

  ngOnInit(): void {
  }

  rankedSubscription(): void {

  }

  scrimmageSubscription(): void {

  }

  getFriends(): Map<string, User> {
    return this.users.friends;
  }
}
