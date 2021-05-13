export interface Game {
  readonly _id: string;
  playerOne: string;
  playerTwo: string;
  started: Date;
  winner: string;
}
