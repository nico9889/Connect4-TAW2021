import {NgModule} from '@angular/core';
import {BrowserModule} from '@angular/platform-browser';

import {AppComponent} from './app.component';
import {RouterModule} from '@angular/router';
import {FriendComponent} from './components/friend/friend.component';
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

@NgModule({
  declarations: [
    AppComponent,
    FriendComponent,
    HomepageComponent,
    LoginComponent,
    RegisterComponent,
    UsersComponent,
    UserComponent,
    LeaderboardComponent
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
  ],
  bootstrap: [AppComponent]
})
export class AppModule {
}
