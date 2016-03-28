
			///////////////////////////////////////////////////////////////
			///////////////////////////////////////////////////////////////
			///////////////////////////////////////////////////////////////
			//res.json({"status":false});	 ห้าม return ค่า ซ้ำกัน จะ Error
			///////////////////////////////////////////////////////////////
			///////////////////////////////////////////////////////////////
var app = require('express')();
var bodyParser = require('body-parser');
var mongojs = require('./db');
var express = require('express');
var db = mongojs.connect;

var http = require('http').Server(app);
var io = require('socket.io')(http);
 

var port = process.env.PORT || 8080;

/*   MiddleWare   */
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: true
}));
app.use(express.static(__dirname + '/web')); 
app.get('/', function(req, res){	
  res.sendFile(__dirname + '/web/index.html'); 
});





// Home System ----------------------------------------------------------------------------------------------------------------------------

app.get('/find_member/:id', function (req, res) {
    var id = req.params.id;
	 db.member.findOne({id: id}, function(err, docs) {	
		if(docs != null){				
			res.json(docs);	
		}else{
			res.json({"status":false});	
		}
				
    });
});
 
app.post('/new_member', function (req, res) {
    var json = req.body;
		db.member.findOne({id: json.id}, function(err, docs) {	
			if(docs != null){
				
				res.json({"status":false});				
				
			}else{
		
				
				
					db.member.insert({id: json.id,name:json.name,bank:json.bank,bankid:json.bankid,topup:'1',cash:0,up:json.up,phone:json.phone,adviser:json.adviser}, function(err, docs) {
						if(docs != null){
							res.json({"status":true});	
						}else{
							
							res.json({"status":false});	
						}
				
					});
				
	
			}
		});
});



app.post('/update_member', function (req, res) {
    var json = req.body;
		db.member.findOne({id: json.id}, function(err, docs) {	
			if(docs != null){
				 db.member.update({id: json.id}, {$set: { name:json.name,bank:json.bank,up:json.up}}, function (err, docs) {
					 if(docs != null){
						res.json({"status":true});	
					}else{
						res.json({"status":false});	
					}
					
				 });			
				
			}else{
				res.json({"status":false});		
			}
		});
});

app.get('/topup_member/:id', function (req, res) {
	var id = req.params.id;
		db.member.findOne({id: id}, function(err, docs) {	
			if(docs != null){				 
						
			topup(docs.id, docs.topup, function(response){
				if(response){
					pay(docs.up, function(response){
						
						pay(response, function(response){
							
							pay(response, function(response){
								
								pay(response, function(response){
									
									pay(response, function(response){
										
										pay(response, function(response){
											
										})
									})
								})
							})
						})
					})
					res.json({"status":true});	
				}else{
					res.json({"status":false});	
				}
			})
				
			
			}else{
				res.json({"status":false});		
			}
		});
});

function pay(upid,callback) {
	db.member.findOne({id: upid}, function(err, docs) {
		if(docs != null){
			var cash_up=0;
			cash_up = docs.cash+100;
			
			db.member.update({id: upid }, {$set: { cash:cash_up}}, function (err, docs) { 
				
			});
			return callback(docs.up);	
		}else{
			return callback(false);
		}
	});
	 
}
 
function topup(memid,topup,callback) {
		
				if(topup == "1"){					
						db.member.update({id:memid}, {$set: { topup:"2"}}, function (err, docs) {
							if(docs != null){
								
								return callback(true);
							}else{
								return callback(false);
							}						
						});
				}else{
					
					return callback(false);
				}
				 			
		
}
 
 
app.post('/pay_member', function (req, res) {
    var json = req.body;
		db.member.findOne({id: json.id}, function(err, docs) {	
			if(docs != null){
				var cash_member=0;
				cash_member = docs.cash-json.cash;			
				var date = new Date();
				var d = date.getDate();
				var month = new Array();
					month[0] = "มกราคม";
					month[1] = "กุมภาพันธ์ ";
					month[2] = "มีนาคม ";
					month[3] = "เมษายน ";
					month[4] = "พฤษภาคม ";
					month[5] = "มิถุนายน ";
					month[6] = "กรกฎาคม ";
					month[7] = "สิงหาคม ";
					month[8] = "กันยายน ";
					month[9] = "ตุลาคม ";
					month[10] = "พฤศจิกายน ";
					month[11] = "ธันวาคม ";
				var m = month[date.getMonth()];
				var y = date.getFullYear();
				var datetime =d+" "+m+" "+y;
				if(cash_member<0){
					res.json({"status":false});							
				}else{
					db.member.update({id: json.id }, {$set: { cash:cash_member}}, function (err, docs) { 
						pay_history(json.id,datetime,json.cash,function(response){
							if(response){
								res.json({"cash":cash_member,"status":true});
							}else{
								res.json({"status":false});		
							}
							
						})
						
					});
					
				}
					
				
			}else{
				res.json({"status":false});		
			}
		});
});
 
 function pay_history(memid,datetime,cashtotal,callback) {
		db.payhistory.insert({id: memid,date:datetime,cash:cashtotal}, function(err, docs) {
			if(docs != null){
				return callback(true);
			}else{
				return callback(false);
			}
		});
	
}
 
app.get('/find_history/:id', function (req, res) {
    var id = req.params.id;
	db.payhistory.find({id: id}).sort({_id: -1}, function(err, docs) {	
		if(docs != null){				
			res.json(docs);	
			
		}else{
			res.json({"status":false});	
		}
				
    });
	
});

app.post('/find_allmember', function (req, res) {
	db.member.find().sort({cash: -1}, function(err, docs) {	
		if(docs != null){				
			res.json(docs);		
		}else{
			res.json({"status":false});	
		}
				
    });
	
});
 

 // End Home System ----------------------------------------------------------------------------------------------------------------------------
 
 







/* สั่งให้ server ทำการรัน Web Server ด้วย port ที่เรากำหนด */
app.listen(port, function() {
    console.log('Starting node.js on port ' + port);
});
