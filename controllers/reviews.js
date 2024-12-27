const Listing = require("../models/listing");
const Review = require("../models/review");

module.exports.createReview = async (req, res) => {
  let listing = await Listing.findById(req.params.id.trim());
  let newReview = new Review(req.body.review);
  console.log(newReview);
  newReview.author = req.user._id;
  listing.review.push(newReview);
  await newReview.save();
  await listing.save();
  req.flash("success", "Review is Added!");

  res.send("review is added");
};

module.exports.deleteReview = async (req, res) => {
  let { id, reviewId } = req.params;
  let listing = await Listing.findByIdAndUpdate(id, {
    $pull: { review: { _id: reviewId } },
  });
  await Review.findByIdAndDelete(reviewId);
  req.flash("success", "Review is Deleted!");

  res.send("Review is deleted");
};
