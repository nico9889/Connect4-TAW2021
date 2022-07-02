import {AfterViewChecked, AfterViewInit, Component, ElementRef, HostListener, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {Coin, GameInfo} from '../../models/game';
import {ChatService} from '../../services/chat.service';
import {GameService} from '../../services/game.service';
import {ActivatedRoute} from '@angular/router';
import {Type} from '../chat/chat.component';
import {SocketioService} from '../../services/socketio.service';

@Component({
  selector: 'app-game',
  templateUrl: './game.component.html',
  styleUrls: ['./game.component.css']
})
export class GameComponent implements OnInit, AfterViewInit, AfterViewChecked, OnDestroy {
  @ViewChild('gamecontainer') container: ElementRef | undefined;
  @ViewChild('gamecanvas') canvas: ElementRef | undefined;
  private audio: HTMLAudioElement;
  private id: string | null | undefined;
  private cellX = 0;
  gameInfo: GameInfo | undefined;

  constructor(private chat: ChatService, private game: GameService, private route: ActivatedRoute, private socket: SocketioService) {
    this.audio = new Audio('assets/sounds/slide.ogg');
    this.audio.load();
    socket.io.on('game update', () => {
      if (this.id) {
        this.game.get(this.id).subscribe((gameInfo) => {
          this.getGameInfo();
          this.audio.play();
        });
      }
    });
  }

  private drawBoard(): void {
    const ctx = this.canvas?.nativeElement.getContext('2d');
    ctx.fillStyle = '#30249C';
    ctx.fillRect(0, 0, this.canvas?.nativeElement.width, this.canvas?.nativeElement.height);
    this.cellX = ((this.canvas?.nativeElement.width - 50) / 7);
    const cellY = ((this.canvas?.nativeElement.height - 50) / 6);
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
            case Coin.Red:
              ctx.fillStyle = '#FF0050';
              break;
            case Coin.Yellow:
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
    if (this.id) {
      this.game.get(this.id).subscribe((gameInfo) => {
        this.gameInfo = gameInfo;
        this.drawBoard();
      });
    }
  }

  private resize(): void {
    // It's 2021 and canvas is still not responsive
    if (this.canvas) {
      this.canvas.nativeElement.width = this.container?.nativeElement.clientWidth -
        (this.canvas.nativeElement.offsetLeft - this.container?.nativeElement.offsetLeft) * 2;
      this.canvas.nativeElement.height = this.canvas?.nativeElement.clientWidth * 0.5;
    }
  }

  ngOnInit(): void {
    this.route.paramMap.subscribe((queryParams) => {
      this.id = queryParams.get('id');
      this.getGameInfo();
      if (this.id) {
        this.game.spectate(this.id, true).subscribe();
      }
    });
  }

  ngAfterViewChecked(): void {
    this.resize();
    this.drawBoard();
  }

  ngOnDestroy(): void {
    this.socket.io.off('game update');
  }

  @HostListener('window:resize', ['$event'])
  onResize(_: Event): void {
    this.resize();
    this.drawBoard();
  }

  openChat(): void {
    if (this.id) {
      this.chat.openChat(this.id, Type.GAME);
    }
  }

  ngAfterViewInit(): void {
    if (this.canvas) {
      this.canvas.nativeElement.addEventListener('click', (click: any) => {
        const rect = this.canvas?.nativeElement.getBoundingClientRect();
        const posX = (click.clientX - 25 - rect.left) / (this.cellX);
        const x = Math.floor(posX);
        if (this.id) {
          this.game.sendMove(this.id, x).subscribe((gameInfo) => {
            console.log(gameInfo);
            this.gameInfo = gameInfo;
            this.drawBoard();
          }, (err) => {
            console.error(err);
          });
        }
        this.drawBoard();
      });
    }
  }
}
