export interface Game {
  readonly _id: string;
  playerOne: {
    _id: string,
    username: string,
  };
  playerTwo: {
    _id: string,
    username: string,
  };
  started: Date;
  winner: {
    _id: string,
    username: string,
    friends: string[];
  };
}

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
  playerOne: {
    _id: string,
    username: string,
  };
  playerTwo: {
    _id: string,
    username: string,
  };
  winner?: {
    _id: string,
    username: string,
  };
  playerOneTurn: boolean;
  spectators: string[];
  ended?: Date;
}
