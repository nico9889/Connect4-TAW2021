import {Component, OnInit} from '@angular/core';
import {UserBasicAuthService} from '../../services/user-basic-auth.service';
import {Router} from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  public errMessage = undefined;

  constructor(private us: UserBasicAuthService, private router: Router) {
  }

  ngOnInit(): void {
    if (this.us.validate()) {
      this.router.navigate(['/']);
    }
  }

  login(username: string, password: string): void {
    this.us.login(username, password).subscribe((d) => {
      this.errMessage = undefined;
      this.router.navigate(['/']);
    }, (err) => {
      this.errMessage = err.message;
    });
  }
}
