import {Component, OnInit} from '@angular/core';
import {Friend} from '../../models/Friend';

@Component({
  selector: 'app-friend-component',
  templateUrl: './friend.component.html',
  styleUrls: ['./friend.component.css']
})
export class FriendComponent implements OnInit {
  friend: Friend;
  constructor() {
  }

  ngOnInit(): void {
  }
}
