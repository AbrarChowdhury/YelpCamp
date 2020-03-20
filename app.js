// ---------------**** sudo systemctl start mongod ****------------------
// use the above to start mongod

var bodyParser = require('body-parser'),
mongoose	   = require("mongoose"),
express 	   = require("express"),
Campground     = require("./models/campground"),
Comment        = require("./models/comment"),
User           = require("./models/user"),
seedDB		   = require("./seeds"),
// The authentication kabjab

passport 	   = require("passport"),
LocalStrategy  = require("passport-local"),

app			   = express(),
port		   = 3000 ;


mongoose.connect("mongodb://localhost/yelp_camp",{useNewUrlParser: true, useUnifiedTopology: true});
app.use(bodyParser.urlencoded({ extended: false }));
app.set("view engine", "ejs");
app.use(express.static("public"));

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

seedDB();


// _________________________________

//  Restful R.O.U.T.E.S
// _________________________________

app.get("/", function(req, res){
	res.render("landing");
});
app.get("/campgrounds", function(req, res){
	Campground.find({}, function(err, campgrounds){
		if(err){
			console.log(err);
		}else{
			res.render("campgrounds/index", {campgrounds:campgrounds});
		}
	}); 
});

app.post("/campgrounds", function(req, res){
	var name = req.body.name;
	var image = req.body.image;
	var description = req.body.description;	
	var newCampground = {name: name,image: image, description: description};
	Campground.create(newCampground,function(err, campground){
			if (err) {
				console.log(err);
			}else{
				res.redirect("/campgrounds");
			}
	});
});

app.get("/campgrounds/new", function(req, res){
	res.render("campgrounds/new");
});

app.get("/campgrounds/:id", function(req, res){
	Campground.findById(req.params.id).populate("comments").exec(function(err,foundCampground){
			if (err) {
				console.log(err);
			}else{
				res.render("campgrounds/show", {campground: foundCampground});
			}
	});
});
// ============================
// comments routes
// =====================
app.get("/campgrounds/:id/comments/new", isLoggedIn, function(req, res){
	Campground.findById(req.params.id, function(err,campground){
			if (err) {
				console.log(err);
			}else{
				res.render("comments/new", {campground: campground});
			}
	});
});

app.post("/campgrounds/:id/comments", isLoggedIn, function(req, res){
	Campground.findById(req.params.id, function(err, campground){
		if(err){
			console.log(err);
			redirect("/campgrounds");
		}else{
			var author = req.body.author;
			var comment = req.body.comment;
			var newComment = {text: comment, author: author};
			Comment.create(newComment,function(err, comment){
				if (err) {
					console.log(err);
				}else{
					console.log(comment +" - "+author);
					campground.comments.push(comment);
					campground.save();
					res.redirect("/campgrounds/" + campground._id);
				}
			});		
		}
	});
});

// Auth-Route
app.get("/register", function(req, res){
	res.render("register");
});
app.post("/register",function(req, res){
	var newUser = new User({username: req.body.username});
	User.register(newUser, req.body.password, function(err, user){
		if(err){
			console.log(err);
			res.render("register");
		}
		passport.authenticate("local")(req, res, function(){
			res.redirect("/campgrounds");
		});
	});
});

app.get("/login",function(req, res){
	res.render("login");
});


app.post("/login", passport.authenticate("local",
		{
			successRedirect: "/campgrounds",
			failureRedirect: "/login"
		}),function(req,res){
});


app.get("/logout", function(req, res){
	req.logout();
	res.redirect("/campgrounds");
});

//login logic
function isLoggedIn(req,res, next){
	if(req.isAuthenticated()){
		return next();
	}
	res.redirect("/login");
}

app.listen(port, () => console.log(`Example app listening on port ${port}!`))
