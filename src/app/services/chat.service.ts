import {EventEmitter, Injectable} from '@angular/core';
import {Type} from '../components/chat/chat.component';
import {Observable} from 'rxjs';
import {Message} from '../models/message';
import {HttpClient, HttpParams} from '@angular/common/http';
import {baseUrl} from '../../constants';
import {Status} from '../models/status';

@Injectable({
  providedIn: 'root'
})
export class ChatService {
  private currentId = '';
  private currentType: Type = Type.USER;

  emitter: EventEmitter<{ id: string, type: Type }> = new EventEmitter();

  constructor(private http: HttpClient) {
  }

  openChat(id: string, type: Type): void {
    console.log('Chat type: ' + type);
    this.currentId = id;
    this.currentType = type;
    this.emitter.emit({id, type});
  }

  getMessages(limit?: number): Observable<Message[]> {
    console.log('Querying messages ' + this.currentId + ' ' + this.currentType);
    limit = limit || 50;
    const params = new HttpParams({fromObject: {limit}});
    switch (this.currentType) {
      case Type.GAME:
        return this.http.get<Message[]>(baseUrl + '/v1/game/' + this.currentId + '/messages', {params});
      case Type.USER:
        return this.http.get<Message[]>(baseUrl + '/v1/messages/' + this.currentId, {params});
    }
  }

  sendMessage(content: string): Observable<Status> {
    switch (this.currentType) {
      case Type.GAME:
        return this.http.post<Status>(baseUrl + '/v1/game/' + this.currentId + '/messages', {message: {content}});
      case Type.USER:
        return this.http.post<Status>(baseUrl + '/v1/messages/' + this.currentId, {message: {content}});
    }
  }

  isUser(): boolean {
    return this.currentType === Type.USER;
  }
}
