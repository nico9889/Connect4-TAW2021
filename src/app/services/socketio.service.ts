import {Injectable} from '@angular/core';
import {io} from 'socket.io-client';
import {UserBasicAuthService} from './user-basic-auth.service';

@Injectable({
  providedIn: 'root'
})
export class SocketioService {
  socket = io(this.us.url);

  constructor(private us: UserBasicAuthService) {
    this.socket.on('broadcast', (m) => {
      console.log(m);
    });
  }

  connect(): void {
    this.socket = io(this.us.url, {
      auth: {token: 'Bearer ' + this.us.getToken()}
    });

    // FIXME: remove on final version
    this.socket.onAny((m) => {
      console.log(m);
    });
  }

  disconnect(): void {
    if (this.socket.connected) {
      this.socket.disconnect();
    }
  }
}
