import { ICategory, IUser, subjects, uploaderProps } from "./components.types";

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

export type path =
  | "Home"
  | "Post"
  | "Edit"
  | "Members"
  | "Requests"
  | "Settings";

export interface communityNavbarProps {
  currentPage: path;
}

export interface communityLayoutProps {
  path: path;
}

export interface CommunityStoreProps {
  openSearch: boolean;
  communityDetails: ICommunityDetails | null;
  editCommunityData: {
    quiz_id?: string;
    caption: string;
    imagesProps: uploaderProps;
    remove_image_len: number;
    remove_images: string[];
  };

  // Functions
  setOpenSearch: () => void;
  setCommunityDetails: (props: ICommunityDetails | null) => void;
  setEditCommunity: (props: {
    quiz_id?: string;
    caption: string;
    files: File[];
    previewUrl?: string[];
    remove_image_len: number;
    remove_images: string[];
  }) => void;
}

export interface ICommunityDetails {
  id: string;
  participants_count: number;
  posts_count: number;
  requests_count: number;
  created_by: string;
  allow_categories: ICategory[];
  created_at: Date;
  updated_at: Date;
  name: string;
  description: string;
  display_picture: string;
  join_with_request: boolean;
}

export interface ICommuntityPost {
  likes_count: number;
  comments_count: number;
  posted_by: {
    profile_image: string;
    username: string;
    id: string;
  };
  quiz_id: string;
  images: { id: number; image: string }[];
  caption: string;
  created_at: Date;
  id: string;
}

export interface PostCommentsProps {
  body: string;
  created_at: Date;
  updated_at: Date;
  id: number;
  user: Pick<IUser, "id" | "username" | "profile_image">;
}
