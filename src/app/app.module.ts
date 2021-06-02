import {NgModule} from '@angular/core';
import {BrowserModule} from '@angular/platform-browser';

import {AppComponent} from './app.component';
import {RouterModule} from '@angular/router';
import {HomepageComponent} from './components/homepage/homepage.component';
import {CommonModule} from '@angular/common';
import {AppRoutingModule} from './app-routing.module';
import { LoginComponent } from './components/login/login.component';
import {UserBasicAuthService} from './services/user-basic-auth.service';
import {HttpClientModule} from '@angular/common/http';
import { RegisterComponent } from './components/register/register.component';
import {FormsModule} from '@angular/forms';
import { UsersComponent } from './components/users/users.component';
import {UserHttpService} from './services/user-http.service';
import { UserComponent } from './components/user/user.component';
import { LeaderboardComponent } from './components/leaderboard/leaderboard.component';
import {NotificationService} from './services/notification.service';
import {SocketioService} from './services/socketio.service';
import { ChatComponent } from './components/chat/chat.component';
import {ChatService} from './services/chat.service';
import { GameComponent } from './components/game/game.component';

@NgModule({
  declarations: [
    AppComponent,
    HomepageComponent,
    LoginComponent,
    RegisterComponent,
    UsersComponent,
    UserComponent,
    LeaderboardComponent,
    ChatComponent,
    GameComponent
  ],
  imports: [
    AppRoutingModule,
    CommonModule,
    BrowserModule,
    HttpClientModule,
    RouterModule,
    FormsModule
  ],
  providers: [
    {provide: UserBasicAuthService, useClass: UserBasicAuthService },
    {provide: UserHttpService, useClass: UserHttpService },
    {provide: NotificationService, useClass: NotificationService },
    {provide: SocketioService, useClass: SocketioService },
    {provide: ChatService, useClass: ChatService }
  ],
  bootstrap: [AppComponent]
})
export class AppModule {
}
