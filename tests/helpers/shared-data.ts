import { faker } from '@faker-js/faker'

const randomInt = faker.number.int()

export const stringIdData: string = randomInt.toString(16).padStart(24, '0')
