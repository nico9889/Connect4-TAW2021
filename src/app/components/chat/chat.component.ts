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

  constructor(private chat: ChatService, private route: ActivatedRoute,
              us: UserBasicAuthService,
              users: UserHttpService,
              private socket: SocketioService,
              private router: Router) {
    const id = this.route.snapshot.paramMap.get('id');
    users.getFriend(id).subscribe((user) => {
      this.user = user;
    }, (err) => {
      console.error(err);
      router.navigate(['/']);
    });
    socket.socket.on('private message', (m) => {
      console.log(m);
      if (m.from === this.user.id) {
        this.getMessages();
      }
    });
    this.us = us;
  }

  ngOnInit(): void {
    this.getMessages();
  }

  private getMessages(): void {
    const id = this.route.snapshot.paramMap.get('id');
    this.chat.getUserChat(id).subscribe((messages) => {
      this.messages = messages;
    }, (err) => {
      console.log(err);
    });
  }

  sendMessage(message: HTMLInputElement): void {
    if (message.value !== '') {
      this.chat.sendUserChat(message.value, this.user.id).subscribe((_) => {
        this.messages.push({sender: this.us.getId(), receiver: this.user.id, content:message.value, datetime: new Date()});
        message.value = '';
        message.focus();
      });
    }
  }

  ngAfterViewChecked(): void {
    this.chatbox.nativeElement.scrollTop = this.chatbox.nativeElement.scrollHeight;
  }
}
