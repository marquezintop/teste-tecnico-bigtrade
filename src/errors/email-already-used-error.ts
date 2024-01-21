class EmailAlreadyUsedError extends Error {
  constructor(message: string = 'Email is already in use') {
    super(message)
    this.name = 'EmailAlreadyUsedError'
  }
}

export { EmailAlreadyUsedError }
