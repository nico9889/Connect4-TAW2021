import { Component, OnInit } from '@angular/core';
import {Router} from '@angular/router';
import {AuthService} from '../../services/auth.service';
import {SocketioService} from '../../services/socketio.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  error = '';
  user = { username: '', password: '' };

  constructor(private auth: AuthService, private router: Router) { }

  ngOnInit(): void {
  }

  login(): void{
    this.auth.login(this.user.username, this.user.password).subscribe((data) => {
      this.error = '';
      this.router.navigate(['/']);
    }, (err) => {
      this.error = err.error.message;
    });
  }
}
