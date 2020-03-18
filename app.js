var bodyParser = require('body-parser'),
express 	   = require("express"),
app			   = express(),
port		   = 3000 ;

app.use(bodyParser.urlencoded({ extended: false }));
app.set("view engine", "ejs");

	var campgrounds = [
		{name:"salmon creek", image: "https://www.google.com/url?sa=i&url=https%3A%2F%2Facadiamagic.com%2Flodging%2Fcamping.html&psig=AOvVaw3rToICV51wsL5JCDyxk_A8&ust=1584568005494000&source=images&cd=vfe&ved=0CAIQjRxqFwoTCMCt1P69ougCFQAAAAAdAAAAABAD"},
		{name:"granite hill", image: "https://www.google.com/url?sa=i&url=https%3A%2F%2Fdailygazette.com%2Farticle%2F2018%2F07%2F02%2Fag-s-office-settles-with-three-adirondack-campgrounds&psig=AOvVaw3rToICV51wsL5JCDyxk_A8&ust=1584568005494000&source=images&cd=vfe&ved=0CAIQjRxqFwoTCMCt1P69ougCFQAAAAAdAAAAABAJ"},
		{name:"mountain rest", image: "https://www.google.com/url?sa=i&url=https%3A%2F%2Fwusfnews.wusf.usf.edu%2Fpost%2Fflorida-parks-close-overnight-campgrounds-comply-cdc-coronavirus-guidelines&psig=AOvVaw3rToICV51wsL5JCDyxk_A8&ust=1584568005494000&source=images&cd=vfe&ved=0CAIQjRxqFwoTCMCt1P69ougCFQAAAAAdAAAAABAO"}
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