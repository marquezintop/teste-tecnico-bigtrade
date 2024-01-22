class PostNotFoundError extends Error {
  constructor(message: string = 'Post not found. The provided post ID is either invalid or does not exist.') {
    super(message)
    this.name = 'PostNotFoundError'
  }
}

export { PostNotFoundError }
