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
    friends: string[];
  };
  playerTwo: {
    _id: string,
    username: string,
    friends: string[];
  };
  winner?: {
    _id: string,
    username: string,
    friends: string[];
  };
  playerOneTurn: boolean;
  spectators: string[];
  ended?: Date;
}
