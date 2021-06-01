export interface Message {
  id?: string;
  sender: string;
  receiver: string;
  content: string;
  datetime: Date;
}
