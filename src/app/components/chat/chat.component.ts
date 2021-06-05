import {AfterViewChecked, Component, OnInit, ViewChild} from '@angular/core';
import {ChatService} from '../../services/chat.service';
import {ActivatedRoute, Router} from '@angular/router';
import {Message} from '../../models/Message';
import {UserBasicAuthService} from '../../services/user-basic-auth.service';
import {UserHttpService} from '../../services/user-http.service';
import {SocketioService} from '../../services/socketio.service';
import {User} from '../../models/User';

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.css']
})
export class ChatComponent implements OnInit, AfterViewChecked {
  @ViewChild('chatbox') chatbox;
  basicAuth: UserBasicAuthService;
  messages: Message[];
  user: User;
  private id;

  constructor(private chat: ChatService, private route: ActivatedRoute,
              basicAuth: UserBasicAuthService,
              public users: UserHttpService,
              private socket: SocketioService,
              public router: Router) {
    socket.socket.on('private message', (_) => {
      this.getMessages(1);
    });
    this.basicAuth = basicAuth;
  }

  ngOnInit(): void {
    this.messages = [];
    this.route.paramMap.subscribe((params) => {
      this.id = params.get('id');
      if (this.basicAuth.hasRole('MODERATOR')) {
        this.users.getUser(this.id).subscribe((user) => {
          this.user = {
            _id: user._id,
            username: user.username,
            online: true,
            game: undefined,
            avatar: user.avatar
          };
        });
      } else {
        this.users.getFriend(this.id).subscribe((user) => {
          this.user = user;
        }, (_) => {
          this.user = {
            _id: this.id,
            username: 'MODERATOR',
            online: true,
            game: undefined,
            avatar: undefined
          };
        });
      }
      this.getMessages(50);
    });
  }

  private getMessages(limit: number): void {
    this.chat.getMessages(this.id, limit).subscribe((messages) => {
      this.messages = this.messages.concat(messages.reverse());
    }, (err) => {
      console.log(err);
    });
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
    this.chatbox.nativeElement.scrollTop = this.chatbox.nativeElement.scrollHeight;
  }
}
