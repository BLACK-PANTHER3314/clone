const express = require("express");
const router = express.Router({ mergeParams: true }); //if we can'tinclude it then we can't use id

const wrapAsync = require("../utils/wrapAsync.js");
const ExpressError = require("../utils/ExpressError.js");
const { listingSchema, reviewSchema } = require("../Schema.js"); // use for server validation
const Review = require("../models/review.js");
const Listing = require("../models/listing.js"); //require models from this folder
const { isLoggedIn } = require("../middleware.js");

const reviewController = require("../controllers/reviews.js");

const validatevReview = (req, res, next) => {
  let { error } = reviewSchema.validate(req.body);
  if (error) {
    let errMsg = error.details.map((el) => el.message).join(","); // show error detail if error have
    throw new ExpressError(400, err.errMsg);
  } // it show joi error without this line mongoose error show both are same only words different
  else {
    next();
  }
};

//create review

router.post(
  "/",
  isLoggedIn,
  validatevReview,
  wrapAsync(reviewController.createReview)
);

//delete route for review

router.delete(
  "/:reviewId",
  isLoggedIn,
  wrapAsync(reviewController.deleteReview)
);
module.exports = router;
