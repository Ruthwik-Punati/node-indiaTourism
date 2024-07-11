const catchAsync = require('../catchAsync')
const Food = require('../models/foodModel')

const ApiFeatures = require('../apiFeatures')
const {
  getAll,
  getOne,
  createOne,
  updateOne,
  deleteOne,
} = require('../handlerFactory')

exports.getAllFood = getAll(Food)
exports.getFoodItem = getOne(Food)
exports.createFood = createOne(Food)

exports.updateFood = updateOne(Food)

exports.deleteFood = deleteOne(Food)
