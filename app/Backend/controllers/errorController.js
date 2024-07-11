const globalErrorHandler = (err, req, res, next) => {
  console.log(err)
  res.status(err.statusCode || 500).json({
    status: err.status || 'error',
    message: err.message || 'something went wrong',
  })
}

module.exports = globalErrorHandler
