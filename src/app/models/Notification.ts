export enum Type {
  ERROR,
  FRIEND_REQUEST,
  GAME_INVITE,
  PRIVATE_MESSAGE
}

export interface Notification{
  uid: string;
  type: Type;
  senderUsername: string;
  sender: string;
  expiry: Date;
}
