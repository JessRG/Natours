// review / rating / createdAt / ref to tour / ref to user
const mongoose = require('mongoose');
// Review Schema
const reviewSchema = new mongoose.Schema(
  {
    review: {
      type: String,
      required: [true, 'Review cannot be empty']
    },
    rating: {
      type: Number,
      min: 1,
      max: 5
    },
    createdAt: {
      type: Date,
      default: Date.now(),
      select: false
    },
    tour: {
      type: mongoose.Schema.ObjectId,
      ref: 'Tour',
      required: [true, 'Review must belong to a tour.']
    },
    user: {
      type: mongoose.Schema.ObjectId,
      ref: 'User',
      required: [true, 'Review must be from a user.']
    }
  },
  {
    // this ensures that when there is a virtual property not stored within the database, but calculated using another value/field, it is displayed when there is an output
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
  }
);
// Query Middleware
reviewSchema.pre(/^find/, function(next) {
  this.populate({
    path: 'user',
    select: 'name photo'
  });
  next();
});
// Review Model
const Review = mongoose.model('Review', reviewSchema);
// Default Export
module.exports = Review;
