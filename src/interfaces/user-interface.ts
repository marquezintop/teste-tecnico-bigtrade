import { ObjectId } from 'mongodb'

interface User {
  _id: ObjectId;
  displayName: string;
  email: string;
  password: string;
}

interface UserView extends Omit<User, 'id'> {}

export { User, UserView }
