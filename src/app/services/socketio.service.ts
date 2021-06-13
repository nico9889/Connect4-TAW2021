import { Injectable } from '@angular/core';
import {AuthService} from './auth.service';
import {baseUrl} from '../../costants';
import {io} from 'socket.io-client';

@Injectable({
  providedIn: 'root'
})
export class SocketioService {
  io = io(baseUrl);

  constructor(private auth: AuthService) {
    console.log('SocketIo Service Instantiated');
  }

  connect(): void {
    this.io = io(baseUrl, {
      auth: {token: 'Bearer ' + this.auth.getToken()}
    });

    // FIXME: remove on final version
    this.io.onAny((m) => {
      console.log(m);
    });
  }

  disconnect(): void {
    if (this.io.connected) {
      this.io.disconnect();
    }
  }
}
