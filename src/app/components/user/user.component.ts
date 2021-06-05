import {Component, OnInit, ViewChild} from '@angular/core';
import {UserHttpService} from '../../services/user-http.service';
import {ActivatedRoute, Router} from '@angular/router';
import {User} from '../../models/User';
import {UserBasicAuthService} from '../../services/user-basic-auth.service';

@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.css']
})
export class UserComponent implements OnInit {
  @ViewChild('userAvatar') userAvatar;
  @ViewChild('inputElement') inputElement;
  user: User;

  constructor(public us: UserBasicAuthService, private users: UserHttpService, private route: ActivatedRoute, private router: Router) {
  }

  ngOnInit(): void {
    this.getUser();
  }

  private getUser(): void {
    this.route.paramMap.subscribe((params) => {
      this.users.getUser(params.get('id')).subscribe((user) => {
        this.user = user;
      }, (_) => {
        this.router.navigate(['/']);
      });
      this.users.getAvatar(params.get('id'));
    });
  }

  changePassword(oldPassword: string, newPassword: string, newPasswordRepeat: string): void {
    if (newPassword === newPasswordRepeat) {
      this.users.editUser(this.user._id, {oldPassword, newPassword}).subscribe((status) => console.log(status));
    }
    this.us.logout();
    this.router.navigate(['/login']);
  }

  switchEnabled(): void {
    this.user.enabled = !this.user.enabled;
    this.users.editUser(this.user._id, {enabled: this.user.enabled}).subscribe((status) => {
      console.log(status);
    });
  }

  uploadAvatar(): void {
    const element = this.inputElement.nativeElement;
    if (element.files?.length === 1) {
      this.users.updateAvatar(this.user._id, element.files.item(0))
        .subscribe(
          (status) => {
            console.log(status);
            this.users.getAvatar(this.user._id, true);
          },
          (err) => console.error(err)
        );
    }
  }
}
