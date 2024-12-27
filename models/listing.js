const mongoose = require("mongoose");
const Review = require("./review.js");
const { string } = require("joi");

const listingSchema = new mongoose.Schema({
  title: {
    type: String,
  },
  description: {
    type: String,
  },
  // image:{
  //     type: {
  //         filename: String,
  //         url: String
  //       },

  //     default:"https://unsplash.com/photos/seashore-during-golden-hour-KMn4VEeEPR8",
  //     set:(v)=> v === "" ? "https://images.unsplash.com/photo-1720264715417-eee343d0d756?q=80&w=1374&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D" : v // use ternry operator

  //     // defult is apply when imge in not give
  //     // and set apply when img give but it is empty

  // },
  // image:{
  //     type: {
  //         filename: String,
  //         url: String
  //     },
  //     default: {
  //         filename: "",
  //         url: "https://unsplash.com/photos/seashore-during-golden-hour-KMn4VEeEPR8"
  //     },
  //     set:(v)=> v === "" ? { filename: "", url: "https://images.unsplash.com/photo-1720264715417-eee343d0d756?q=80&w=1374&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D" } : v

  //      // defult is apply when imge in not give
  // //     // and set apply when img give but it is empty
  // },

  image: {
    url: String,
    filename: String,

    // type: String,
    // default:
    //   "https://images.unsplash.com/photo-1625505826533-5c80aca7d157?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTJ8fGdvYXxlbnwwfHwwfHx8MA%3D%3D&auto=format&fit=crop&w=800&q=60",
    // set: (v) =>
    //   v === ""
    //     ? "https://images.unsplash.com/photo-1625505826533-5c80aca7d157?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTJ8fGdvYXxlbnwwfHwwfHx8MA%3D%3D&auto=format&fit=crop&w=800&q=60"
    //     : v, // we use ternary operator
    // // defult is apply when imge in not give
    // // and set apply when img give but it is empty
  },

  price: {
    type: Number,
  },
  location: {
    type: String,
  },
  country: {
    type: String,
  },
  review: [
    { type: mongoose.Schema.Types.ObjectId, ref: "Review" }, // this is for one to many relationship with User model. It refers the User model and creates a relationship between the Listing and User models.
  ],
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User", // this is for one to many relationship with User model. It refers the User model and creates a relationship between the Listing and User models.
  },

  geometry: {
    type: {
      type: String, // Don't do `{ location: { type: String } }`
      enum: ["Point"], // 'location.type' must be 'Point'
      required: true,
    },
    coordinates: {
      type: [Number],
      required: true,
    },
  },
});

listingSchema.post("findOneAndDelete", async (listing) => {
  if (listing) {
    await Review.deleteMany({ _id: { $in: listing.review } });
  }
});

const Listing = mongoose.model("Listing", listingSchema);
module.exports = Listing;
