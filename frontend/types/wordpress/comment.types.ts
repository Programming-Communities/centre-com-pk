// types/wordpress/comment.types.ts
export interface CommentType {
  id: string;
  author: {
    name: string;
    avatar?: string;
  };
  content: string;
  date: string;
  likes?: number;
  replies?: CommentType[];
}