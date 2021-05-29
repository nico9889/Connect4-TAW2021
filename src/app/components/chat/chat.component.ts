import {AfterViewChecked, Component, OnInit, ViewChild} from '@angular/core';
import {ChatService} from '../../services/chat.service';
import {ActivatedRoute, Router} from '@angular/router';
import {Message} from '../../models/Message';
import {UserBasicAuthService} from '../../services/user-basic-auth.service';
import {UserHttpService} from '../../services/user-http.service';
import {Friend} from '../../models/Friend';
import {SocketioService} from '../../services/socketio.service';

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.css']
})
export class ChatComponent implements OnInit, AfterViewChecked {
  us: UserBasicAuthService;
  user: Friend;
  messages: Message[];
  @ViewChild('chatbox') chatbox;
  private id;
  constructor(private chat: ChatService, private route: ActivatedRoute,
              us: UserBasicAuthService,
              public users: UserHttpService,
              private socket: SocketioService,
              public router: Router) {
    socket.socket.on('private message', (m) => {
      if (m.from === this.user.id) {
        this.getMessages();
      }
    });
    this.us = us;
  }

  ngOnInit(): void {
    this.route.paramMap.subscribe((params) => {
      this.id = params.get('id');
      this.getMessages();
      this.users.getFriend(this.id).subscribe((user) => {
        this.user = user;
      }, (err) => {
        console.error(err);
        this.router.navigate(['/']);
      });
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
      this.chat.sendUserChat(message.value, this.user.id).subscribe((_) => {
        this.getMessages();
        message.value = '';
        message.focus();
      });
    }
  }

  ngAfterViewChecked(): void {
    this.chatbox.nativeElement.scrollTop = this.chatbox.nativeElement.scrollHeight;
  }
}
