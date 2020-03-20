var express    = require("express");
var router     = express.Router();
var Comment    = require("../models/comment");
var Campground = require("../models/campground");

router.get("/campgrounds/:id/comments/new", isLoggedIn, function(req, res){
	Campground.findById(req.params.id, function(err,campground){
			if (err) {
				console.log(err);
			}else{
				res.render("comments/new", {campground: campground});
			}
	});
});

router.post("/campgrounds/:id/comments", isLoggedIn, function(req, res){
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

//login logic
function isLoggedIn(req,res, next){
	if(req.isAuthenticated()){
		return next();
	}
	res.redirect("/login");
}

module.exports = router;