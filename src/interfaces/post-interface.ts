import { ObjectId } from 'mongodb'

interface Post {
  _id: ObjectId;
  title: string;
  content: string;
  userId: string;
  published: string;
  updated: string;
}

interface PostView extends Omit<Post, '_id'> {}

interface PostCreateView extends Omit<PostView, 'published' | 'updated'> {}

interface PostUpdateView extends Omit<PostCreateView, 'userId' > {}

export {
  Post, PostView, PostCreateView, PostUpdateView,
}
