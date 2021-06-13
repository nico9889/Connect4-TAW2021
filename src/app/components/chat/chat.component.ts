import {Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {Message} from '../../models/message';
import {ChatService} from '../../services/chat.service';
import {UserService} from '../../services/user.service';
import {Observable} from "rxjs";
import {User} from "../../models/user";

export enum Type {
  USER,
  GAME
}

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.css']
})
export class ChatComponent implements OnInit {
  visible = 'invisible';
  messages: Message[] = [];

  constructor(private chat: ChatService, private users: UserService) {
    chat.emitter.subscribe((signal) => {
      this.chat.getMessages(signal.id, signal.type).subscribe((messages) => {
        this.messages = messages;
        this.visible = 'visible';
      });
    });
  }

  ngOnInit(): void {
  }

  closeChat(): void {
    this.visible = 'invisible';
  }

  getUser(id: string): Observable<User>  {
    console.log('Getting user');
    return this.users.getUser(id);
  }
}
