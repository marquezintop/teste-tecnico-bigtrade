import { ObjectId } from 'mongodb'

interface Post {
  _id: ObjectId;
  title: string;
  content: string;
  userId: string;
  published: string;
  updated: string;
}

interface PostView extends Omit<Post, 'id'> {}

interface PostCreateView extends Omit<PostView, 'published' | 'updated'> {}

export { Post, PostView, PostCreateView }
