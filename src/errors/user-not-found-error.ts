class UserNotFoundError extends Error {
  constructor(message: string = 'User not found. The provided user ID is either invalid or does not exist.') {
    super(message)
    this.name = 'UserNotFoundError'
  }
}

export { UserNotFoundError }
