import {Component, OnInit} from '@angular/core';
import {UserHttpService} from '../../services/user-http.service';
import {ActivatedRoute, Router} from '@angular/router';
import {User} from '../../models/User';
import {SocketioService} from '../../services/socketio.service';

@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.css']
})
export class UserComponent implements OnInit {
  user: User;

  constructor(private users: UserHttpService, private route: ActivatedRoute, private router: Router, private socket: SocketioService) {
  }

  ngOnInit(): void {
    this.getUser();
  }

  private getUser(): void {
    const id = this.route.snapshot.paramMap.get('id');
    this.users.getUser(id).subscribe((user) => {
      this.user = user;
    }, (_) => {
      this.router.navigate(['/']);
    });
  }

  changeUsername(username: string): void {
    if (this.user !== undefined) {
      this.user.username = username;
      this.users.editUser(this.user._id, {username}).subscribe((status) => console.log(status));
    }
  }

  changePassword(oldPassword: string, newPassword: string, newPasswordRepeat: string): void {
    if (newPassword === newPasswordRepeat) {
      this.users.editUser(this.user._id, {oldPassword, newPassword}).subscribe((status) => console.log(status));
    }
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
