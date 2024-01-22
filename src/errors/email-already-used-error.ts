class EmailAlreadyUsedError extends Error {
  constructor(message: string = 'The provided email address is already in use. Please use a different email address.') {
    super(message)
    this.name = 'EmailAlreadyUsedError'
  }
}

export { EmailAlreadyUsedError }
