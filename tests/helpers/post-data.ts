import { faker } from '@faker-js/faker'
import { PostCreateView } from '../../src/interfaces/post-interface'

interface PostViewWithoutUserId extends Omit<PostCreateView, 'userId'> {}

export const postCreateData: PostViewWithoutUserId = {
  title: faker.word.noun(),
  content: faker.word.words(),
}
