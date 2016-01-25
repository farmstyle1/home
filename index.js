
var app = require('express')();
var bodyParser = require('body-parser');
var mongojs = require('./db');
var db = mongojs.connect;
 

var port = process.env.PORT || 8080;

/*   MiddleWare   */
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: true
}));
 
/* Routing */
app.get('/', function (req, res) {
    res.send('<h1>Hello World</h1>');
});


app.get('/find/:id', function (req, res) {
    var id = req.params.id;
	 db.users.findOne({username: id}, function(err, docs) {	
	 
		if(docs != null){
			
			if(docs.username == id){
				
			res.json({"username":docs.username,"location":docs.location});
			
		}
		}else{
			 res.json(false);
		}
				
    });
});

 
app.post('/newuser', function (req, res) {
    var json = req.body;
   db.users.insert(json, function(err, docs) {
        res.send('Add new ' + docs.username + ' Completed!');
    });

});
 
app.post('/update_location', function (req, res) {
    var json = req.body;
	 db.users.update({username: json.username}, {$set: { location: json.location}}, function (err, docs) {
		res.json(json.location);
	 });
	

});

/* สั่งให้ server ทำการรัน Web Server ด้วย port ที่เรากำหนด */
app.listen(port, function() {
    console.log('Starting node.js on port ' + port);
});