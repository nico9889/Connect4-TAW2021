import { Component, OnInit } from '@angular/core';
import {GameService} from '../../services/game.service';
import {ActivatedRoute} from '@angular/router';
import {Game} from '../../models/game';
import {User} from '../../models/user';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-stats',
  templateUrl: './stats.component.html',
  styleUrls: ['./stats.component.css']
})
export class StatsComponent implements OnInit {
  games: Game[] = [];
  user: User | undefined;
  constructor(private users: UserService, private game: GameService, private route: ActivatedRoute) {
  }

  ngOnInit(): void {
    this.route.paramMap.subscribe((params) => {
      const id = params.get('id');
      if (id) {
        this.game.games(id).subscribe((games) => {
          this.games = games;
        });
        this.users.getUser(id, true).subscribe((user) => {
          this.user = user;
        });
      }
    });
  }

}
