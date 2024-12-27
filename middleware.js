const Listing = require("./models/listing");
const Review = require("./models/review");

module.exports.isLoggedIn = (req, res, next) => {
  if (!req.isAuthenticated()) {
    req.session.redirectUrl = req.originalUrl; // in this we add new parameter in session obj
    req.flash("failure", "Please login first");
    return res.redirect("/login");
  } else {
    next();
  }
};

module.exports.saveRedirectUrl = (req, res, next) => {
  if (req.session.redirectUrl) {
    res.locals.redirectUrl = req.session.redirectUrl;
  } else {
    next();
  }
};
module.exports.isOwner = async (req, res, next) => {
  let { id } = req.params;
  let listing = await Listing.findById(id);
  // if (currentUser && !listing.owner._id.equals(currentUser)) {
  if (req.user && !listing.owner._id.equals(req.user._id)) {
    res.flash("error", "You are not the owner of this listing");
    return res.redirect(`/listing/${id}`);
  } else {
    next();
  }
};

module.exports.isListingReviewOwner = async (req, res, next) => {
  let { reviewId, id } = req.params;
  let review = await Review.findById(reviewId);
  if (!review.author.equals(currentUser)) {
    res.flash("error", "You are not the author of this review");
    return res.redirect(`/listing/${id}`);
  } else {
    next();
  }
};
