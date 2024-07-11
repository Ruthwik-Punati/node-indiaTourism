const mongoose = require('mongoose')

const foodSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'A food must have a name!'],
      unique: [true, 'This food already exists!'],
    },
    description: String,
    avgRating: { type: Number, default: 0 },
    ratingsNumber: { type: Number, default: 0 },
  },
  { toJSON: { virtuals: true }, toObject: { virtuals: true } }
)

// This spelling mistake costed me 4 days "virtuals" => "vituals"
// { toJSON: { virtuals: true }, toObject: { virtuals: true } }

// foodSchema.virtual('feedback', {
//   ref: 'Review',
//   foreignField: 'recipe',
//   localField: '_id',
// })

// foodSchema.virtual('quantity').get(function () {
//   return this.ratingsNumber + 11
// })
// foodSchema.pre(/find/, function () {
//   console.log('virtual')
//   this.select('+quantity +feedback').populate({ path: 'feedback' })
// })

const foodModel = mongoose.model('Food', foodSchema)

module.exports = foodModel
