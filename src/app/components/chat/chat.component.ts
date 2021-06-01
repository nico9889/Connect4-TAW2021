import {AfterViewChecked, Component, OnInit, ViewChild} from '@angular/core';
import {ChatService} from '../../services/chat.service';
import {ActivatedRoute, Router} from '@angular/router';
import {Message} from '../../models/Message';
import {UserBasicAuthService} from '../../services/user-basic-auth.service';
import {UserHttpService} from '../../services/user-http.service';
import {SocketioService} from '../../services/socketio.service';
import {Friend} from '../../models/Friend';

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.css']
})
export class ChatComponent implements OnInit, AfterViewChecked {
  @ViewChild('chatbox') chatbox;
  basicAuth: UserBasicAuthService;
  messages: Message[];
  user: Friend;
  private id;

  constructor(private chat: ChatService, private route: ActivatedRoute,
              basicAuth: UserBasicAuthService,
              public users: UserHttpService,
              private socket: SocketioService,
              public router: Router) {
    socket.socket.on('private message', (m) => {
      this.getMessages();
    });
    this.basicAuth = basicAuth;
  }

  ngOnInit(): void {
    this.route.paramMap.subscribe((params) => {
      this.id = params.get('id');
      if (this.basicAuth.hasRole('MODERATOR')) {
        this.users.getUser(this.id).subscribe((user) => {
          this.user = {
            id: user._id,
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
            id: '0',
            username: 'MODERATOR',
            online: true,
            game: undefined,
            avatar: undefined
          };
        });
      }
      this.getMessages();
    });
  }

  private getMessages(): void {
    this.chat.getUserChat(this.id).subscribe((messages) => {
      this.messages = messages;
    }, (err) => {
      console.log(err);
    });
  }

  sendMessage(message: HTMLInputElement): void {
    if (message.value !== '') {
      this.chat.sendUserChat(message.value, this.id).subscribe((_) => {
        this.getMessages();
        message.value = '';
        message.focus();
      }, (err) => {
        console.log(err);
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
