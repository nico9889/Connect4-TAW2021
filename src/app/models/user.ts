export interface User {
  readonly _id: string;
  username: string;
  friends?: string[];
  last_password_change?: any;
  enabled?: boolean;
  online?: boolean;
  victories?: number;
  defeats?: number;
  avatar?: string;
  game?: string;
}
