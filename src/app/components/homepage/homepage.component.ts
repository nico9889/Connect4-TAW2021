import {Component, OnInit} from '@angular/core';
import {Router} from '@angular/router';
import {UserBasicAuthService} from '../../services/user-basic-auth.service';
import {User} from '../../models/User';
import {UserHttpService} from '../../services/user-http.service';

@Component({
  selector: 'app-homepage',
  templateUrl: './homepage.component.html',
  styleUrls: ['./homepage.component.css']
})
export class HomepageComponent implements OnInit {
  user: User = null;

  constructor(public us: UserBasicAuthService, private users: UserHttpService, private router: Router) {
    if (us.isLoggedIn()) {
      users.getUser(us.getId()).subscribe((user) => {
        console.log(user);
        this.user = user;
      });
    }
  }

  ngOnInit(): void {
  }
}
