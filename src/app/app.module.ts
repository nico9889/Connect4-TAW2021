import {NgModule} from '@angular/core';
import {BrowserModule} from '@angular/platform-browser';

import {AppRoutingModule} from './app-routing.module';
import {AppComponent} from './app.component';
import {AuthService} from './services/auth.service';
import {AuthInterceptor} from './interceptors/auth.interceptor';
import {HTTP_INTERCEPTORS, HttpClientModule} from '@angular/common/http';
import {RouterModule} from '@angular/router';
import {FormsModule} from '@angular/forms';
import {CommonModule} from '@angular/common';
import { LoginComponent } from './components/login/login.component';
import { RegisterComponent } from './components/register/register.component';
import { HomepageComponent } from './components/homepage/homepage.component';
import { LeaderboardComponent } from './components/leaderboard/leaderboard.component';
import { UserComponent } from './components/user/user.component';
import { UsersComponent } from './components/users/users.component';
import { FriendsComponent } from './components/friends/friends.component';
import { NotificationComponent } from './components/notification/notification.component';
import { ChatComponent } from './components/chat/chat.component';
import { GameComponent } from './components/game/game.component';
import {SocketioService} from './services/socketio.service';
import {GameService} from './services/game.service';
import {NotificationService} from './services/notification.service';
import {UserService} from './services/user.service';
import {ChatService} from './services/chat.service';

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    RegisterComponent,
    HomepageComponent,
    LeaderboardComponent,
    UserComponent,
    UsersComponent,
    FriendsComponent,
    NotificationComponent,
    ChatComponent,
    GameComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    RouterModule,
    FormsModule,
    CommonModule
  ],
  providers: [
    {provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true},
    {provide: SocketioService, useClass: SocketioService},
    {provide: AuthService, useClass: AuthService},
    {provide: UserService, useClass: UserService},
    {provide: ChatService, useClass: ChatService},
    {provide: GameService, useClass: GameService},
    {provide: NotificationService, useClass: NotificationService},
  ],
  bootstrap: [AppComponent]
})
export class AppModule {
}
