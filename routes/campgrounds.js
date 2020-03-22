var express    = require("express");
var router     = express.Router();
var Comment    = require("../models/comment");
var Campground = require("../models/campground");
router.get("/campgrounds", function(req, res){
	Campground.find({}, function(err, campgrounds){
		if(err){
			console.log(err);
		}else{
			res.render("campgrounds/index", {campgrounds:campgrounds});
		}
	}); 
});

router.post("/campgrounds", isLoggedIn, function(req, res){
	var name = req.body.name;
	var image = req.body.image;
	var description = req.body.description;	
	var author = {
		id: req.user._id,
		username: req.user.username
	};
	var newCampground = {name: name,image: image, description: description, author: author};
	Campground.create(newCampground,function(err, campground){
			if (err) {
				console.log(err);
			}else{
				res.redirect("/campgrounds");
			}
	});
});

router.get("/campgrounds/new", isLoggedIn, function(req, res){
	res.render("campgrounds/new");
});

router.get("/campgrounds/:id", function(req, res){
	Campground.findById(req.params.id).populate("comments").exec(function(err,foundCampground){
			if (err) {
				console.log(err);
			}else{
				res.render("campgrounds/show", {campground: foundCampground});
			}
	});
});

//Edit Campground Routes
router.get("/campgrounds/:id/edit",checkCampgroundOwnership, function(req,res){
		Campground.findById( req.params.id,function(err, foundCampground){
			res.render("campgrounds/edit", {campground: foundCampground});
		});

});

//Update Campground Routes
router.put("/campgrounds/:id", function(req, res){
	var name = req.body.name;
	var image = req.body.image;
	var description = req.body.description;	
	var updatedCampground = {name: name,image: image, description: description};	
	Campground.findByIdAndUpdate(req.params.id, updatedCampground, function(err, updatedCampground){
		if(err){
			req.flash("error", "Could not update campground");
			res.redirect("/campgrounds");
		}else{
			req.flash("success, Campground Updated.");
			res.redirect("/campgrounds/"+req.params.id);
		}
	});
});

//Destroy Campground Route
router.delete("/campgrounds/:id", function(req, res){
	Campground.findByIdAndRemove(req.params.id, function(err){
		if(err){
			res.redirect("/campgrounds");
		}else{
			req.flash("success","Campground  Removed");
			res.redirect("/campgrounds");
		}
	});
});



//login logic
function isLoggedIn(req,res, next){
	if(req.isAuthenticated()){
		return next();
	}
	req.flash("error","Please Login First");
	res.redirect("/login");
}
function checkCampgroundOwnership(req,res,next){
	if(req.isAuthenticated()){
		Campground.findById( req.params.id,function(err, foundCampground){
			if(err){
				req.flash("error","Error! Campground not found");
				res.redirect("back");
			}else{		
				if(foundCampground.author.id.equals(req.user._id)){
					next();
				}else{
					req.flash("error","You do not have permission to do that");
					res.redirect("back");
				}
			}
		});
	}else{
		req.flash("error", "You need to be logged in to do that");
		res.redirect("back");
	}	
}

module.exports = router;