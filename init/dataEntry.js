const mongoose = require("mongoose");
const initData = require("./data.js");
const Listing = require("/MAJOR PROJECT/models/listing.js"); //require models from this folder

main()
  .then((result) => {
    console.log(result);
  })
  .catch((err) => {
    console.log(err);
  });

async function main() {
  await mongoose.connect("mongodb://127.0.0.1:27017/wanderlust"); // connect dbS
}

const initDB = async () => {
  await Listing.deleteMany({});

  initData.data = initData.data.map((obj) => ({
    //use to add owner to all listing
    ...obj,
    owner: "66a2a96333ca68619d31f6ba",
  }));
  await Listing.insertMany(initData.data); //initData is object we access it key data
  console.log("Database initialized");
};
initDB();
