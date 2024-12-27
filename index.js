if (process.env.NODE_ENV != "production") {
  require("dotenv").config();
}
// console.log(process.env.SECRET);

const express = require("express"); //require express
const app = express(); // express function
const port = 8080; // port
const path = require("path"); // require path
const mongoose = require("mongoose");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");
const ExpressError = require("./utils/ExpressError.js");
const session = require("express-session");
const flash = require("connect-flash");
const passport = require("passport");
const LocalStrategy = require("passport-local");
const User = require("./models/user.js");

app.set("view-engine", "ejs"); //set template to ejs
app.set("views", path.join(__dirname, "views")); // set views folder
app.use(express.static(path.join(__dirname, "./public"))); // set public folder
app.use(express.urlencoded({ extended: true })); // for parsing(converting) post data
app.use(methodOverride("_method")); //use method-override
app.engine("ejs", ejsMate); // this is for ejs mate;

const listingRouter = require("./routes/listing.js");
const reviewRouter = require("./routes/review.js");
const userRouter = require("./routes/user.js");

const sessionOption = {
  secret: "my super secret",
  resave: false,
  saveUninitialized: true,
  expires: Date.now() + 7 * 24 * 60 * 60 * 1000,
  maxAge: 7 * 24 * 60 * 60 * 1000,
  httpOnly: true, // default it is for security purpose
};

app.use(session(sessionOption));
app.use(flash());

app.use(passport.initialize()); // passport initialize
app.use(passport.session()); // connect with session
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use((req, res, next) => {
  res.locals.success = req.flash("success");
  res.locals.failure = req.flash("failure");
  res.locals.currentUser = req.user;
  /*req.user is passport feature store user detail, we make CurrentUser
   variable in res.locals which contain req.user ;  */
  next();
});

// app.get("/demoUser", async (req, res) => {
//   let fakeUser = new User({
//     email: "abdullah67@gmail.com",
//     username: "delt-student",
//   });
//   let registerUser = await User.register(fakeUser, "fullclip12"); // second arug is password
//   res.send(registerUser);
// });

// const dbUrl = process.env.ATLASDB_URL;

// async function main() {
//   await mongoose.connect(
//     "mongodb+srv://jamshaidabdullah67:QeHbI21UNKOlQrJG@cluster0.qslw3f9.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0"
//   ); // connect dbS
//   // await mongoose.connect("mongodb://127.0.0.1:27017/wanderlust");
// }
// main()
//   .then((result) => {
//     console.log(result);
//   })
//   .catch((err) => {
//     console.log(err);
//   });

const dbUrl = "mongodb://127.0.0.1:27017/wanderlust";

async function main() {
  await mongoose.connect(dbUrl, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });
}

main()
  .then(() => console.log("Connected to MongoDB Atlas"))
  .catch((err) => console.error("Error connecting to MongoDB Atlas:", err));

app.use("/listing", listingRouter);
app.use("/listing/:id/review", reviewRouter);
app.use("/", userRouter);

// app.get("/", (req, res) => {
//   res.send("Hello World!");
// });

app.all("*", (req, res, next) => {
  next(new ExpressError(404, "Page Not Found!"));
});

app.use((err, req, res, next) => {
  let { statuscode = 500, message = "Something went wrong" } = err;
  // res.status(statuscode).send(message);
  res.status(statuscode).render("err.ejs", { err });
});

app.listen(port, () => {
  console.log(`Sever is working at${port}`);
});
