var bodyParser = require('body-parser'),
express 	   = require("express"),
app			   = express(),
port		   = 3000 ;

app.use(bodyParser.urlencoded({ extended: false }));
app.set("view engine", "ejs");

	var campgrounds = [
		{name:"salmon creek", image: "https://www.nps.gov/grte/planyourvisit/images/JLCG_tents_Teewinot_2008_mattson_1.JPG?maxwidth=1200&maxheight=1200&autorotate=false"},
		{name:"granite hill", image: "https://www.pigeonforgechamber.com/wp-content/uploads/2018/05/campgrounds1.jpg"},
		{name:"mountain rest", image: "https://www.mercurynews.com/wp-content/uploads/2016/10/outdoor-school_2.jpg?w=533"}
	];







app.get("/", function(req, res){
	res.render("landing");
});
app.get("/campgrounds", function(req, res){
 
	res.render("campgrounds", {campgrounds:campgrounds});
});

app.post("/campgrounds", function(req, res){
	var name = req.body.name;
	var image = req.body.image;	
	var newCampground = {name: name,image: image};
	campgrounds.push(newCampground);
	res.redirect("/campgrounds");
});

app.get("/campgrounds/new", function(req, res){
	res.render("new");
});
app.listen(port, () => console.log(`Example app listening on port ${port}!`))