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
  private id = '';
  visible = 'invisible';
  messages: Message[] = [];

  constructor(private chat: ChatService, private users: UserService, private socket: SocketioService) {
    chat.emitter.subscribe((signal) => {
      this.chat.getMessages().subscribe((messages) => {
        this.id = signal.id;
        this.messages = messages.reverse();
        this.visible = 'visible';
      });
    });

    this.socket.io.on('private message', () => {
      this.getMessages(1);
    });
  }

  ngOnInit(): void {
  }

  private getMessages(limit?: number): void {
    this.chat.getMessages(limit).subscribe((messages) => {
      this.messages.shift();
      this.messages = this.messages.concat(messages);
    });
  }

  closeChat(): void {
    this.visible = 'invisible';
  }

  getUser(id: string): Observable<User> {
    console.log('Getting user');
    return this.users.getUser(id);
  }

  sendMessage(message: HTMLInputElement): void {
    if (message.value !== '') {
      this.chat.sendMessage(message.value, this.id).subscribe((_) => {
        this.getMessages(1);
        message.value = '';
        message.focus();
      }, (err) => {
        // If the server returns any error it's showed inside the chat to warn the user
        this.messages.push({
          content: err.error.message,
          datetime: new Date(),
          receiver: this.id,
          sender: ''
        });
      });
    }
  }

  ngAfterViewChecked(): void {
    if (this.chatBox) {
      console.log('Autoscroll: ' + this.chatBox.nativeElement.scrollTop);
      this.chatBox.nativeElement.scrollTop = this.chatBox.nativeElement.scrollHeight + 1000;
      console.log('Autoscroll: ' + this.chatBox.nativeElement.scrollTop);
    }
  }
}
