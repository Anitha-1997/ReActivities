import { User } from "./user";

export interface IProfile {
  userName: string;
  displayName: string;
  image?: string;
  bio?: string;
  followersCount: number;
  followingCount: number;
  following: boolean;
  photos?: Photo[];
}

export class Profile implements IProfile {
  constructor(user: User) {
    this.userName = user.userName;
    this.displayName = user.displayName;
    this.image = user.image;
  }

  userName: string;
  displayName: string;
  image?: string;
  bio?: string;
  followersCount: number = 0;
  followingCount: number = 0;
  following: boolean = false;
  photos?: Photo[];
}

export interface Photo {
  id: string;
  url: string;
  isMain: boolean;
}
