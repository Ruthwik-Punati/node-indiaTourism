const mongoose = require('mongoose')
const foodModel = require('../models/foodModel')

const reviewSchema = new mongoose.Schema(
  {
    review: { type: String },
    rating: { type: Number, required: [true, 'A review must have a rating!'] },
    recipe: {
      type: mongoose.Schema.ObjectId,
      ref: 'Food',
      required: [true, 'A review must be for a food!'],
    },
    user: {
      type: mongoose.Schema.ObjectId,
      ref: 'Visitor',
      required: [true, 'A review must be of a user!'],
    },
  },
  { toJSON: { virtuals: true }, toObject: { virtuals: true } }
)

reviewSchema.index({ recipe: 1, user: -1 }, { unique: true })

reviewSchema.post('save', async function () {
  const food = await foodModel.findById(this.recipe)

  food.ratingsNumber += 1

  food.save()
})

// reviewSchema.pre(/find/, function () {
//   this.populate({ path: 'user recipe' })
// })

const reviewModel = mongoose.model('Review', reviewSchema)

module.exports = reviewModel
