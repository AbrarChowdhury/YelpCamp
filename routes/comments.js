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
					comment.author.id = req.user._id;
					comment.author.username = req.user.username;
					comment.save();
					campground.comments.push(comment);
					campground.save(); 
					res.redirect("/campgrounds/" + campground._id);
				}
			});		
		}
	});
});
router.get("/campgrounds/:id/comments/:comment_id/edit", function(req,res){
	Comment.findById(req.params.comment_id, function(err, foundComment){
		if(err){
				res.redirect("back");
		}else{
		res.render("comments/edit",{campground_id: req.params.id, comment: foundComment});
		}

	});	
});

router.put("/campgrounds/:id/comments/:comment_id",function(req, res){
	var text = req.body.comment;	
	var updatedComment = {text:text};	

	Comment.findByIdAndUpdate(req.params.comment_id, updatedComment, function(err, updatedComment){
		if(err){
			res.redirect("back");
		}
		else{
			res.redirect("/campgrounds/"+ req.params.id);
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