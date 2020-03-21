// ---------------**** sudo systemctl start mongod ****------------------
// use the above to start mongod

var bodyParser = require('body-parser'),
mongoose	   = require("mongoose"),
express 	   = require("express"),
Campground     = require("./models/campground"),
Comment        = require("./models/comment"),
User           = require("./models/user"),
seedDB		   = require("./seeds"),
methodOverride = require('method-override'),

// The authentication kabjab
passport 	   = require("passport"),
LocalStrategy  = require("passport-local"),

app			   = express(),
port		   = 3000 ;

var campgroundRoutes = require("./routes/campgrounds"),
	commentRoutes    = require("./routes/comments"),
	indexRoutes		 = require("./routes/index");


mongoose.connect("mongodb://localhost/yelp_camp",{useNewUrlParser: true, useUnifiedTopology: true});
app.use(bodyParser.urlencoded({ extended: false }));
app.set("view engine", "ejs");
app.use(express.static("public"));
app.use(methodOverride("_method"));
// PASSOORT CONFIGURATION
app.use(require("express-session")({
	secret: "once again rusty wins cutest dog!",
	resave: false,
	saveUninitialized: false //<-------
}));
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use(function(req, res, next){
	res.locals.currentUser = req.user;
	next();
});

// seedDB();

// ROUTES are connected here,
// could have added common PREFIX of the LINKS
// but I didn't because it seemed like extra work
app.use(indexRoutes);
app.use(commentRoutes);
app.use(campgroundRoutes);

app.listen(port, () => console.log(`Example app listening on port ${port}!`))
