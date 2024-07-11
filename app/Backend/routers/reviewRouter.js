const express = require('express')
const {
  createReview,
  getFoodReviews,
  updateReview,
  deleteReview,
  checkReviewId,
} = require('../controllers/reviewController')

const reviewRouter = express.Router({ mergeParams: true })

reviewRouter.route('/').post(createReview).get(getFoodReviews)
reviewRouter.param('id', checkReviewId)

reviewRouter.route('/:id').patch(updateReview).delete(deleteReview)

module.exports = reviewRouter
