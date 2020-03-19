// ---------------**** sudo systemctl start mongod ****------------------
// use the above to start mongod

var bodyParser = require('body-parser'),
mongoose	   = require("mongoose"),
express 	   = require("express"),
Campground     = require("./models/campground"),
Comment        = require("./models/comment"),
seedDB		   = require("./seeds"),
app			   = express(),
port		   = 3000 ;

mongoose.connect("mongodb://localhost/yelp_camp",{useNewUrlParser: true, useUnifiedTopology: true});
app.use(bodyParser.urlencoded({ extended: false }));
app.set("view engine", "ejs");

seedDB();
// Schema Settup




// Campground.create(
// 	{
// 		name:"granite hill", 
// 		image: "https://www.pigeonforgechamber.com/wp-content/uploads/2018/05/campgrounds1.jpg",
// 		description: "this is a huge granite hill, no bathroom, no water, only beautiful granite"
// 	},function(err, campground){
// 		if (err) {
// 			console.log(err);
// 		}else{
// 			console.log("new campground added");
// 			console.log(campground);
// 		}
// });







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
app.get("/campgrounds/:id/comments/new", function(req, res){
	Campground.findById(req.params.id, function(err,campground){
			if (err) {
				console.log(err);
			}else{
				res.render("comments/new", {campground: campground});
			}
	});
});

app.post("/campgrounds/:id/comments", function(req, res){
	Campground.findById(req.params.id, function(err, campground){
		if(err){
			console.log(err);
			redirect("/campgrounds");
		}else{
			console.log(req.body.comment);
			var author = req.body.author;
			var comment = req.body.comment;
			var newComment = {text: comment, author: author};
			Comment.create(newComment,function(err, comment){
				if (err) {
					console.log(err);
				}else{
					campground.comments.push(comment);
					campground.save();
					res.redirect("/campgrounds/" + campground._id);
				}
			});		
		}
	});
});


app.listen(port, () => console.log(`Example app listening on port ${port}!`))