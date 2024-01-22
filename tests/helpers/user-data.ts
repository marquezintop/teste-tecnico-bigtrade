import { faker } from '@faker-js/faker'
import { UserView } from '../../src/interfaces/user-interface'

export const userCreateData: UserView = {
  displayName: faker.word.noun(),
  email: faker.internet.email(),
  password: faker.internet.password(),
}
