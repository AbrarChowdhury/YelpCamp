var bodyParser = require('body-parser'),
mongoose	  = require("mongoose"),
express 	   = require("express"),
app			   = express(),
port		   = 3000 ;

mongoose.connect("mongodb://localhost/yelp_camp",{useNewUrlParser: true, useUnifiedTopology: true});
app.use(bodyParser.urlencoded({ extended: false }));
app.set("view engine", "ejs");


// Schema Settup
var campgroundSchema = new mongoose.Schema({
	name: String,
	image: String
});


var Campground=mongoose.model("Campground", campgroundSchema);

// Campground.create(
// 	{
// 		name:"granite hill", 
// 		image: "https://www.pigeonforgechamber.com/wp-content/uploads/2018/05/campgrounds1.jpg"
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
			res.render("campgrounds", {campgrounds:campgrounds});
		}
	}); 
});

app.post("/campgrounds", function(req, res){
	var name = req.body.name;
	var image = req.body.image;	
	var newCampground = {name: name,image: image};
	Campground.create(newCampground,function(err, campground){
			if (err) {
				console.log(err);
			}else{
				res.redirect("/campgrounds");
			}
	});
});

app.get("/campgrounds/new", function(req, res){
	res.render("new");
});
app.listen(port, () => console.log(`Example app listening on port ${port}!`))