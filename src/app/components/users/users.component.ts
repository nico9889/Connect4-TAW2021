import { Component, OnInit } from '@angular/core';
import {User} from '../../models/user';
import {UserService} from '../../services/user.service';
import {ChatService} from '../../services/chat.service';
import {Type} from '../chat/chat.component';

@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.css']
})
export class UsersComponent implements OnInit {
  usersMap: Map<string, User> = new Map<string, User>();

  constructor(private users: UserService, private chat: ChatService) { }

  ngOnInit(): void {
    this.users.updateUsers();
    this.usersMap = this.users.users;
  }

  openChat(id: string): void {
    this.chat.openChat(id, Type.USER);
  }
}
