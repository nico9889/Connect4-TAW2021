import {Component, OnInit} from '@angular/core';
import {AuthService} from '../../services/auth.service';
import {User} from '../../models/user';
import {UserService} from '../../services/user.service';
import {ActivatedRoute, Router} from '@angular/router';

@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.css']
})
export class UserComponent implements OnInit {
  user: User | undefined;

  constructor(private auth: AuthService, private users: UserService, private route: ActivatedRoute, private router: Router) {
    this.user = undefined;
  }

  ngOnInit(): void {
    this.route.paramMap.subscribe((params) => {
      const id = params.get('id');
      if (id) {
        this.users.getUser(id).subscribe((user) => {
          this.user = user;
        });
      }
    });
  }

  isEnabled(): boolean {
    return this.auth.isEnabled();
  }

  changePassword(oldPassword: string, newPassword: string, newPasswordRepeat: string): void {
    if (newPassword === newPasswordRepeat && this.user) {
      this.users.edit(this.user._id, {oldPassword, newPassword})
        .subscribe((status) => console.log(status));
    }
    this.auth.logout();
    this.router.navigate(['/login']);
  }


  uploadAvatar(): void {

  }


  switchEnabled(): void {
    if (this.user) {
      this.user.enabled = !this.user.enabled;
      this.users.edit(this.user._id, {enabled: this.user.enabled}).subscribe((status) => {
        console.log(status);
      });
    }
  }

  isModerator(): boolean {
    return this.auth.hasRole('MODERATOR');
  }
}
