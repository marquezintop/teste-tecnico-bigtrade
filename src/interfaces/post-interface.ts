import { ObjectId } from 'mongodb'

interface Post {
  _id: ObjectId;
  title: string;
  content: string;
  userId: string;
  published: string;
  updated: string;
}

interface UpdatePostView {
  title?: string;
  content?: string;
}

interface PostView extends Omit<Post, '_id'> {}

interface PostCreateView extends Omit<PostView, 'published' | 'updated'> {}

export {
  Post, PostView, PostCreateView, UpdatePostView,
}
