import {EventEmitter, Injectable} from '@angular/core';
import {Type} from '../components/chat/chat.component';
import {Observable} from 'rxjs';
import {Message} from '../models/message';
import {HttpClient, HttpParams} from '@angular/common/http';
import {baseUrl} from '../../costants';
import {Status} from '../models/status';
import {tap} from 'rxjs/operators';

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
    this.currentId = id;
    this.currentType = type;
    this.emitter.emit({id, type});
  }

  getMessages(limit?: number): Observable<Message[]> {
    console.log('Querying messages ' + this.currentId + ' ' + this.currentType);
    switch (this.currentType) {
      case Type.GAME:
        return this.http.get<Message[]>(baseUrl + '/v1/game/' + this.currentId + '/messages');
      case Type.USER:
        if (limit && limit > 0) {
          const params = new HttpParams({fromObject: {limit}});
          return this.http.get<Message[]>(baseUrl + '/v1/messages/' + this.currentId, {params});
        } else {
          return this.http.get<Message[]>(baseUrl + '/v1/messages/' + this.currentId);
        }
    }
  }

  sendMessage(content: string, receiver: string): Observable<Status> {
    return this.http.post<Status>(baseUrl + '/v1/messages/' + receiver, {message: {content}});
  }
}
