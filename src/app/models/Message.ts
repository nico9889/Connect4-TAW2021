export interface Message {
  id?: string;
  sender: {
    _id: string;
    username: string;
  };
  receiver: {
    _id: string;
    username: string;
  };
  content: string;
  datetime: Date;
}
