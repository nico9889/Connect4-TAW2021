export interface User{
  readonly _id: string;
  username: string;
  enabled: boolean;
  roles: string[];
  victories: number;
  defeats: number;
  last_password_change: Date;
  avatar: string;
}

export interface LeaderboardUser{
  username: string;
  ratio: number;
}
