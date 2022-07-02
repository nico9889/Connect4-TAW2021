import {Injectable} from '@angular/core';
import {AuthService} from './auth.service';
import {baseUrl} from '../../constants';
import {io, Socket} from 'socket.io-client';

@Injectable({
  providedIn: 'root'
})
export class SocketioService {
  io: Socket<any, any>;

  constructor(private auth: AuthService) {
    this.io = io(baseUrl, {
      autoConnect: false
    });

    this.auth.logged.subscribe((logged) => {
      if (logged) {
        this.connect();
      } else {
        this.io.disconnect();
      }
    });

    if (auth.isLoggedIn()) {
      this.connect();
    }

    console.log('SocketIo Service Instantiated');
  }

  connect(): void {
    console.log('Socket.io connected');
    this.io.auth = {token: 'Bearer ' + this.auth.getToken()};
    this.io.connect();
    // FIXME: remove on final version
    this.io.onAny((m, e) => {
      console.log(m, e);
    });
  }
}
