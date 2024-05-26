class AppError extends Error {
  constructor(message, statusCode) {
    super()
    this.status = statusCode?.toString()?.startsWith('4') ? 'fail' : 'error'
    this.statusCode = statusCode
    this.message = message
  }
}

module.exports = AppError
