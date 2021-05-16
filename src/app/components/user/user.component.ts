import {Component, OnInit} from '@angular/core';
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
  user: User;

  constructor(public us: UserBasicAuthService, private users: UserHttpService, private route: ActivatedRoute, private router: Router) {
  }

  ngOnInit(): void {
    this.getUser();
  }

  private getUser(): void {
    this.route.queryParams.subscribe((queryParams) => {
      this.users.getUser(queryParams.id).subscribe((user) => {
        this.user = user;
      }, (_) => {
        this.router.navigate(['/']);
      });
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

  // FIXME: MISSING SANITIZATION
  uploadAvatar(event: Event): void {
    const element = event.currentTarget as HTMLInputElement;
    const fileList: FileList | null = element.files;
    const reader = new FileReader();
    if (fileList && fileList.length === 1) {
      reader.readAsDataURL(fileList[0]);
      reader.onload = () => {
        this.users.editUser(this.user._id, {avatar: reader.result.toString()})
          .subscribe(
            (status) => console.log(status),
            (err) => console.error(err)
          );
      };
    }
  }
}
