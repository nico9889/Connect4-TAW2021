import {Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {AuthService} from '../../services/auth.service';
import {Router} from '@angular/router';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {
  @ViewChild('moderatorCheckbox') moderatorCheckbox: ElementRef | undefined;
  error = '';
  user = {password: '', username: '', moderator: false};
  password = '';


  constructor(private auth: AuthService, private router: Router) {
  }

  ngOnInit(): void {
  }

  register(): void {
    if (this.user.password !== '' && this.user.password !== this.password) {
      this.error = 'Passwords do not match!';
    } else {
      this.user.moderator = this.moderatorCheckbox?.nativeElement.checked;
      this.auth.register(this.user).subscribe((_) => {
        this.error = '';
        this.router.navigate(['/']);
      }, (err) => {
        this.error = err.error.message;
      });
    }
  }

  isModerator(): boolean {
    return this.auth.hasRole('MODERATOR');
  }
}
