var mongoose = require("mongoose");
var Campground = require("./models/campground");
var Comment = require("./models/comment");


var data =[
	{
		name:"granite hill", 
		image: "https://encrypted-tbn0.gstatic.com/images?q=tbn%3AANd9GcTBrgzOaYgh4C6VjzVIxi3ZT3DD3Xx-EX2hsNMbLWzK5nBbTMdq",
		description: "this is a huge granite hill, no bathroom, no water, only beautiful granite"
 	},
 	{
		name:"Clouds Rest", 
		image: "https://encrypted-tbn0.gstatic.com/images?q=tbn%3AANd9GcSp7EksHiVAq3XuUPwbyVHJeNfc2Sw8gzMJDhxVFwMZwZ9PWIK3",
		description: "this is a very peaceful place, good bathroom and water"
 	},
 	{
		name:"Lake laky", 
		image: "https://www.pigeonforgechamber.com/wp-content/uploads/2018/05/campgrounds1.jpg",
		description: "this is a huge granite hill, no bathroom, no water, only beautiful granite"
 	}
	
];

function seedDB(){
	//removes campgrounds
	Campground.remove({}, function(err){
		if(err){
			console.log(err);
		}
		console.log("removed campgrounds");
			//adds campgrounds
		data.forEach(function(seed){
			Campground.create(seed, function(err,campground){
				if(err){
					console.log(err);
				}else{
					console.log("added a campground");
					Comment.create(
						{
							text: "this place is great but i wish there was internet", 
							author: "abrar" 
						}, function(err, comment){
							if(err){
								console.log(err);
							}else{
								console.log("created new comment");
								campground.comments.push(comment);
								campground.save();	
							}
						});
				}
			});
		});
	});	

	//adds comments
}




module.exports = seedDB;