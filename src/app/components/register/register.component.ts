import {Component, OnInit, ViewChild} from '@angular/core';
import {UserBasicAuthService} from '../../services/user-basic-auth.service';
import {Router} from '@angular/router';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {
  public errMessage = undefined;
  public user = {password: '', username: '', moderator: false};
  @ViewChild('moderatorCheckbox') moderatorCheckbox;

  constructor(public us: UserBasicAuthService, public router: Router) {
  }


  ngOnInit(): void {
    if (this.us.isLoggedIn()) {
      if (!this.us.hasRole('MODERATOR')) {
        this.router.navigate(['/']);
      }
    }
  }

  signup(): void {
    this.user.moderator = this.moderatorCheckbox.nativeElement.checked;
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
