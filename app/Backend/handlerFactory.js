const ApiFeatures = require('./apiFeatures')
const catchAsync = require('./catchAsync')
const client = require('./redis')

exports.cache = catchAsync(async (req, res, next) => {
  let data = await client.get(`${req.originalUrl}`)

  data = JSON.parse(data)

  if (data) {
    console.log('cache hit')
    res.status(200).json({
      status: 'success',
      data: { total: data.length, data },
    })
  } else {
    console.log('cache miss')
    next()
  }
})

const setCache = async (req, data) => {
  await client.setEx(`${req.originalUrl}`, 3 * 60, JSON.stringify(data))
}

exports.getAll = function (Model) {
  return catchAsync(async (req, res, next) => {
    let query = Model.find()

    const features = new ApiFeatures(req.query, query)
    features.filter().sort().fields().pagination()

    const data = await features.query
    setCache(req, data)
    res.status(200).json({
      status: 'success',
      data: { total: data.length, data },
    })
  })
}

exports.getOne = function (Model) {
  return catchAsync(async (req, res, next) => {
    let query = Model.findById(req.params.id)

    const features = new ApiFeatures(req.query, query)
    features.fields()

    const data = await features.query
    setCache(req, data)
    res.status(200).json({
      pid: process.pid,
      status: 'success',
      data: { data },
    })
  })
}

exports.createOne = function (Model) {
  return catchAsync(async (req, res, next) => {
    const data = await Model.create(req.body)

    res.status(201).json({
      status: 'success',
      data: { data },
    })
  })
}

exports.updateOne = function (Model) {
  return catchAsync(async (req, res, next) => {
    const data = await Model.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    })

    res.status(200).json({
      status: 'success',
      data: { data },
    })
  })
}

exports.deleteOne = function (Model) {
  return catchAsync(async (req, res, next) => {
    await Model.findByIdAndDelete(req.params.id, req.body)

    res.status(204).json({
      status: 'success',
      data: null,
    })
  })
}
