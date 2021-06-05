import {Component, OnInit} from '@angular/core';
import {UserHttpService} from '../../services/user-http.service';
import {User} from '../../models/User';

@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.css']
})
export class UsersComponent implements OnInit {

  users: User[] = [];

  constructor(public us: UserHttpService) {
  }

  ngOnInit(): void {
    this.getUsers();
  }

  public getUsers(): void {
    this.us.getUsers().subscribe(
      (users) => {
        this.users = users;
      }, (err) => {
        console.error(err);
      }
    );
  }
}
