export interface Game {
  readonly _id: string;
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
  started: Date;
  winner: {
    _id: string,
    username: string,
    friends: string[];
  };
}
