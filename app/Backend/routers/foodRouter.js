const express = require('express')
const {
  getAllFood,
  createFood,
  updateFood,
  deleteFood,
  getFoodItem,
} = require('../controllers/foodController')
const reviewRouter = require('./reviewRouter')
const { protect } = require('../controllers/authController')
const { cache } = require('../handlerFactory')

const foodRouter = express.Router()

foodRouter.route('/').get(cache, getAllFood).post(createFood)
foodRouter
  .route('/:id')
  .get(cache, getFoodItem)
  .patch(updateFood)
  .delete(deleteFood)

foodRouter.use('/:foodId/review', protect, reviewRouter)

module.exports = foodRouter
