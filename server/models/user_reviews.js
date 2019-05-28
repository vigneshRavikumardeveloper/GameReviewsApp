const mongoose = require('mongoose');

const UserReviewSchema = new mongoose.Schema({
   postId: {
      type: String,
      require: true
   },
   ownerId: {
      type: String,
      require: true
   },
   ownerUserName: {
      type: String,
      require: true,
      trim: true
   },
   titlePost: {
      type: String,
      require: true,
      trim: true
   },
   review: {
      type: String,
      require: true,
      trim: true,
      maxlength: 500
   },
   rating: {
      type: Number,
      require: true,
      min: 1,
      max: 10
   }
}, { timestamps: true });


const UserReviewDetails = mongoose.model('UserReview', UserReviewSchema);

module.exports = { UserReviewDetails };