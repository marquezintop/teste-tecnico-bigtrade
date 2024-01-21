import { ObjectId } from 'mongodb'

interface User {
  _id: ObjectId;
  displayName: string;
  email: string;
  password: string;
}

interface UserView extends Omit<User, 'id'> {}

interface PublicUser extends Omit<User, 'password'> {}

export { User, UserView, PublicUser }
