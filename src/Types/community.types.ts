import { IUser, subjects } from "./components.types";

export interface IPost {
  posted_by: IUser;
  likes: IUser[];
  likes_count: number;
  is_quiz: boolean;
  caption?: string;
  images?: string[];
  comments?: string[];
}

export interface ICommunity {
  id: string;
  name: string;
  description?: string;
  requests: IUser[];
  posts: IPost[];
  participants: IUser[];
  display_picture?: string;
  participants_count: number;
  owner: IUser;
}

export interface checkMemberShipProps {
  is_member: boolean;
  is_requested: boolean;
}

export interface createCommunityProps {
  button: React.ReactElement;
}

export interface createCommunityApiProps {
  display_image: File;
  name: string;
  allow_categories: subjects[];
  description?: string;
  join_with_request: boolean;
}
