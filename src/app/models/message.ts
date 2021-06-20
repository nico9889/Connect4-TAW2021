export interface Message {
  readonly _id: string;
  sender: string;
  receiver: string;
  content: string;
  datetime: Date;
}
