import {AfterViewChecked, AfterViewInit, Component, HostListener, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {UserBasicAuthService} from '../../services/user-basic-auth.service';
import {Message} from '../../models/Message';
import {GameService} from '../../services/game.service';
import {ActivatedRoute} from '@angular/router';
import {GameInfo} from '../../models/GameInfo';
import {SocketioService} from '../../services/socketio.service';

@Component({
  selector: 'app-game',
  templateUrl: './game.component.html',
  styleUrls: ['./game.component.css']
})
export class GameComponent implements OnInit, AfterViewChecked, AfterViewInit, OnDestroy {
  @ViewChild('gamecontainer') container;
  @ViewChild('gamecanvas') canvas;
  @ViewChild('chatbox') chatbox;
  private cellX: number;
  private id;
  private audio: HTMLAudioElement;
  gameInfo: GameInfo;
  us: UserBasicAuthService;
  messages: Message[];

  constructor(us: UserBasicAuthService, private game: GameService, private route: ActivatedRoute, private socket: SocketioService) {
    this.audio = new Audio('assets/sounds/slide.ogg');
    this.audio.load();
    this.us = us;
    this.messages = [];
  }

  ngOnInit(): void {
    this.route.paramMap.subscribe((queryParams) => {
      this.id = queryParams.get('id');
      this.getGameInfo();
      this.game.sendSpectate(this.id, true).subscribe();
    });
    this.socket.socket.on('game update', (_) => {
      this.getGameInfo();
      this.audio.play();
    });
    this.socket.socket.on('game message new', (_) => {
      this.getMessage();
    });
  }

  ngOnDestroy(): void {
    this.socket.socket.off('game update');
    this.socket.socket.off('game message new');
    this.game.sendSpectate(this.id, false).subscribe();
  }

  private drawBoard(): void {
    const ctx = this.canvas.nativeElement.getContext('2d');
    ctx.fillStyle = '#30249C';
    ctx.fillRect(0, 0, this.canvas.nativeElement.width, this.canvas.nativeElement.height);
    this.cellX = ((this.canvas.nativeElement.width - 50) / 7);
    const cellY = ((this.canvas.nativeElement.height - 50) / 6);
    const coinDiameter = Math.min(this.cellX, cellY) * 0.8;
    ctx.fillStyle = '#C0C0C0';

    let posX = (-this.cellX / 2) + 25;
    if (this.gameInfo) {
      for (let x = 0; x < 7; x++) {
        posX += (this.cellX);
        let posY = (-cellY / 2) + 25;
        for (let y = 0; y < 6; y++) {
          posY += (cellY);
          switch (this.gameInfo.board.board[y][x]) {
            case 1:
              ctx.fillStyle = '#FF0050';
              break;
            case 2:
              ctx.fillStyle = '#FFDB00';
              break;
            default:
              ctx.fillStyle = '#E0E0E0';
              break;
          }
          ctx.beginPath();
          ctx.arc(posX, posY, coinDiameter / 2, 0, Math.PI * 2);
          ctx.closePath();
          ctx.fill();
        }
      }
    }
  }

  private getGameInfo(): void {
    this.game.getGameInfo(this.id).subscribe((gameInfo) => {
      this.gameInfo = gameInfo;
      this.drawBoard();
    });
  }


  private resize(): void {
    this.canvas.nativeElement.width = this.container.nativeElement.clientWidth * 0.90;
    this.canvas.nativeElement.height = this.canvas.nativeElement.clientWidth * 0.5;
  }

  ngAfterViewInit(): void {
    this.resize();
    this.drawBoard();
    this.canvas.nativeElement.addEventListener('click', (click) => {
      const rect = this.canvas.nativeElement.getBoundingClientRect();
      const posX = (click.clientX - 25 - rect.left) / (this.cellX);
      const x = Math.floor(posX);
      this.game.sendMove(this.id, x).subscribe((gameInfo) => {
        console.log(gameInfo);
        this.gameInfo = gameInfo;
        this.drawBoard();
      }, (err) => {
        console.error(err);
      });
      this.drawBoard();
    });
  }

  @HostListener('window:resize', ['$event'])
  onResize(_): void {
    this.resize();
    this.drawBoard();
  }

  ngAfterViewChecked(): void {
    this.chatbox.nativeElement.scrollTop = this.chatbox.nativeElement.scrollHeight;
  }

  private getMessage(): void {
    this.game.getMessage(this.id).subscribe((messages) => {
      this.messages = messages;
    });
  }

  sendMessage(message: HTMLInputElement): void {
    this.game.sendMessage(this.id, message.value).subscribe((_) => {
      message.focus();
      message.value = '';
    });
  }
}
