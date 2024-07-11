const AppError = require('../AppError')
const catchAsync = require('../catchAsync')
const Review = require('../models/reviewModel')

exports.createReview = catchAsync(async (req, res, next) => {
  console.log(req.params)
  const review = await Review.create({
    recipe: req.params.foodId,
    user: req.user._id,
    ...req.body,
  })

  res.status(200).json({
    status: 'success',
    data: {
      review,
    },
  })
})

exports.getFoodReviews = catchAsync(async (req, res, next) => {
  const reviews = await Review.find({ recipe: req.params.foodId }).populate({
    path: 'recipe user',
    // select: '-_id',
  })

  res.status(200).json({ status: 'success', data: { reviews } })
})

exports.updateReview = catchAsync(async (req, res, next) => {
  const review = await Review.findOneAndUpdate(
    { _id: req.params.reviewId },
    req.body,
    { new: true }
  )

  res.status(200).json({ status: 'success', data: { review } })
})
exports.deleteReview = catchAsync(async (req, res, next) => {
  await Review.findByIdAndDelete(req.params.reviewId)

  res.status(204).json({ status: 'success', data: null })
})

exports.checkReviewId = (req, res, next, val) => {
  console.log('value', val)
  console.log(req.params)
  if (val.length < 3) {
    next(new AppError('no review Id!'))
    return
  }
  next()
}
