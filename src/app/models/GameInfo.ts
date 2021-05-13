export enum Coin{
  None,
  Red,
  Yellow
}

export interface Board{
  board: Coin[][];
}

export interface GameInfo{
  board: Board;
  playerOne: string;
  playerOneName: string;
  playerTwo: string;
  playerTwoName: string;
  winner?: string;
  winnerName?: string;
  playerOneTurn: boolean;
  spectators: string[];
  ended?: Date;
}
