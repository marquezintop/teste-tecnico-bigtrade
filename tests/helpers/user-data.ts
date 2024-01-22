import { faker } from '@faker-js/faker'
import { ObjectId } from 'mongodb'
import { UserView } from '../../src/interfaces/user-interface'

export const userIdData: ObjectId = new ObjectId(faker.number.int())

export const userCreateData: UserView = {
  displayName: faker.word.noun(),
  email: faker.internet.email(),
  password: faker.internet.password(),
}
