import {Component, OnInit} from '@angular/core';
import {User} from '../../models/user';
import {UserService} from '../../services/user.service';
import {ChatService} from '../../services/chat.service';
import {Type} from '../chat/chat.component';

@Component({
  selector: 'app-friends',
  templateUrl: './friends.component.html',
  styleUrls: ['./friends.component.css']
})
export class FriendsComponent implements OnInit {
  alert = '';
  success = true;

  constructor(private users: UserService, private chat: ChatService) {
  }

  ngOnInit(): void {
  }

  sendFriendRequest(username: string): void {
    this.users.sendFriendRequest(username).subscribe((_) => {
      this.alert = 'Friend request sent successfully';
      this.success = true;
    }, (_) => {
      this.alert = 'An error occurred while sending friend request';
      this.success = false;
    });
  }

  getFriends(): Map<string, User> {
    return this.users.friends;
  }

  openChat(id: string): void {
    this.chat.openChat(id, Type.USER);
  }
}
