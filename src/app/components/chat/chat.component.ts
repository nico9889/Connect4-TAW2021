import {AfterViewChecked, Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {Message} from '../../models/message';
import {ChatService} from '../../services/chat.service';
import {UserService} from '../../services/user.service';
import {Observable} from 'rxjs';
import {User} from '../../models/user';
import {SocketioService} from '../../services/socketio.service';

export enum Type {
  USER,
  GAME
}

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.css']
})
export class ChatComponent implements OnInit, AfterViewChecked {
  @ViewChild('chatBox') chatBox: ElementRef | undefined;
  visible = 'invisible';
  messages: Message[] = [];

  constructor(private chat: ChatService, private users: UserService, private socket: SocketioService) {
    chat.emitter.subscribe((_) => {
      this.chat.getMessages().subscribe((messages) => {
        this.messages = messages.reverse();
        this.visible = 'visible';
      });
    });

    this.socket.io.on('message new', () => {
      this.getMessages(1);
    });
  }

  ngOnInit(): void {
  }

  private getMessages(limit?: number): void {
    this.chat.getMessages(limit).subscribe((messages) => {
      const filtered = messages.filter((message) => {
        let ok = true;
        for (let i = 0; i < this.messages.length && ok; i++) {
          ok = ok && (message._id !== this.messages[i]._id);
        }
        return ok;
      });
      if (filtered) {
        if (this.messages.length > 50) {
          this.messages.shift();
        }
        this.messages = this.messages.concat(filtered);
      }
    });
  }

  closeChat(): void {
    this.visible = 'invisible';
  }

  getUser(id: string): Observable<User> {
    return this.users.getUser(id);
  }

  sendMessage(message: HTMLInputElement): void {
    if (message.value !== '') {
      this.chat.sendMessage(message.value).subscribe((_) => {
        if (this.chat.isUser()) {
          this.getMessages(1);
        }
        message.value = '';
        message.focus();
      }, (err) => {
        // If the server returns any error it's showed inside the chat to warn the user
        this.messages.push({
          _id: '',
          content: err.error.message,
          datetime: new Date(),
          receiver: '',
          sender: ''
        });
      });
    }
  }

  ngAfterViewChecked(): void {
    if (this.chatBox) {
      this.chatBox.nativeElement.scrollTop = this.chatBox.nativeElement.scrollHeight;
    }
  }
}
