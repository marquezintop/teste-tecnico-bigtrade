import bcrypt from 'bcrypt'

export function hash(message: string) {
  const saltRounds = 10
  const salt = bcrypt.genSaltSync(saltRounds)
  return bcrypt.hashSync(message, salt)
}
