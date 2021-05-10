export enum Type {
  ERROR,
  FRIEND_REQUEST,
  GAME_INVITE
}

export interface Notification{
  type: Type;
  senderUsername: string;
  senderId: string;
  expiry: Date;
}
