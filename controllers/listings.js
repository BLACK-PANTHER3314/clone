const Listing = require("../models/listing");
const mbxGeocoding = require("@mapbox/mapbox-sdk/services/Geocoding");
const mapToken = process.env.MAP_TOKEN;
const geocodingClient = mbxGeocoding({ accessToken: mapToken });

module.exports.index = async (req, res) => {
  let allListing = await Listing.find({});
  res.render("index.ejs", { allListing });
};

module.exports.renderNewForm = (req, res) => {
  res.render("new.ejs");
};

module.exports.showListing = async (req, res) => {
  let { id } = req.params;
  let listing = await Listing.findById(id)
    .populate({ path: "review", populate: { path: "author" } })
    .populate("owner");
  if (!listing) {
    req.flash("failure", "Listing is not found!");
    res.redirect("/listing");
  }
  res.render("show.ejs", { listing });
};
module.exports.createListing = async (req, res) => {
  let response = await geocodingClient
    .forwardGeocode({
      query: req.body.listing.location,
      limit: 5,
    })
    .send();

  let url = req.file.path;
  let filename = req.file.filename;
  // let {title, description, price, image} = req.body;
  let listing = req.body.listing; // it return only obj that we create
  const newListing = new Listing(listing); // in this we add new document in our collection(model)
  newListing.owner = req.user._id;
  newListing.image = { url, filename };
  newListing.geometry = response.body.features[0].geometry;
  let saveListing = await newListing.save(); //we save document in db we also use then() or catch
  console.log(saveListing);
  req.flash("success", "Listing is Saved!");
  res.redirect("/listing");
  //  we write this code same but first can't write it is just for understanding;
};

module.exports.renderEditForm = async (req, res) => {
  let { id } = req.params;
  let listing = await Listing.findById(id);
  if (!listing) {
    req.flash("failure", "Listing is not found!");
    res.redirect("/listing");
  }
  let originalImageUrl = listing.image.url;
  originalImageUrl = originalImageUrl.replace("/upload", "/upload/h_300,w_250");

  res.render("edit.ejs", { listing, originalImageUrl });
};

module.exports.updateListing = async (req, res) => {
  let { id } = req.params;

  let listing = await Listing.findByIdAndUpdate(id, { ...req.body.listing });

  if (req.file) {
    let url = req.file.path;
    let filename = req.file.filename;
    listing.image = { url, filename };
    await listing.save();
  }

  req.flash("success", "Listing is Updated!");

  res.redirect(`/listing/${id}`);
};

module.exports.deleteListing = async (req, res) => {
  let { id } = req.params;
  await Listing.findByIdAndDelete(id);
  req.flash("success", "Listing is Deleted!");

  res.redirect("/listing");
};
