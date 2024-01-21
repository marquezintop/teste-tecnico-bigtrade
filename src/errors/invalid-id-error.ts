class InvalidIdError extends Error {
  constructor(message: string = 'This id is invalid.') {
    super(message)
    this.name = 'InvalidIdError'
  }
}

export { InvalidIdError }
