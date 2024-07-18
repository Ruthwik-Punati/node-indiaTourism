const globalErrorHandler = (err, req, res, next) => {
  console.log(err)
  if (err.statusCode === 401) {
    res.end('<script>window.location="/login.html"</script>')
    return
  }
  res.status(err.statusCode || 500).json({
    status: err.status || 'error',
    message: err.message || 'something went wrong',
  })
}

module.exports = globalErrorHandler
