import {Component, OnInit} from '@angular/core';
import {UserBasicAuthService} from '../../services/user-basic-auth.service';
import {Router} from '@angular/router';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {
  public errMessage = undefined;
  public user = {password: '', username: '', roles: []};

  constructor(public us: UserBasicAuthService, public router: Router) {
  }


  ngOnInit(): void {
  }

  signup(): void {
    this.us.register(this.user).subscribe((d) => {
      console.log('Registration ok: ' + JSON.stringify(d));
      this.errMessage = undefined;
      this.router.navigate(['/login']);
    }, (err) => {
      console.log('Signup error: ' + JSON.stringify(err.error.errormessage));
      this.errMessage = err.error.errormessage || err.error.message;
    });

  }

}
