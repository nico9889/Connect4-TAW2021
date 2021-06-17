import {Component, ElementRef, OnInit, ViewChild} from '@angular/core';
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
  @ViewChild('inputElement') inputElement: ElementRef | undefined;
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
  }


  uploadAvatar(): void {
    const element = this.inputElement?.nativeElement;
    if (element && element.files?.length === 1) {
      if (this.user) {
        this.users.uploadAvatar(this.user._id, element.files.item(0))
          .subscribe((status) => {
            console.log(status);
            if (this.user) {
              this.users.getUser(this.user._id, true).subscribe();
            }
          }, (err) => console.error(err));
      }
    }
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

  deleteUser(): void {
    if (this.user) {
      this.users.delete(this.user?._id).subscribe((_) => {
        this.router.navigate(['/users']);
      });
    }
  }
}
