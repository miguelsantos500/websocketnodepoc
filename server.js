var users = [{
		id: '1',
		username: 'selfcare_user@mail.com',
		requests : [{
			id: '1',
			status: 'ACCEPTED'
		},
		{
			id: '2',
			status: 'ACCEPTED'
		},
		{
			id: '3',
			status: 'SUBMITTED'
		},
		{
			id: '4',
			status: 'PROCESSING'
		},
		{
			id: '5',
			status: 'PROCESSED'
		}]
	}];


var app = require('express')();
var http = require('http').Server(app);
var bodyParser = require('body-parser');
app.use(bodyParser.json());


app.use(function(req, res, next) {
	res.header("Access-Control-Allow-Origin", "*");
	res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,PATCH,OPTIONS');
	res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization");
	next();
});

app.get('/', (req, res) => {
	res.sendStatus(200);
});


app.put('/users/:userId/requests/:requestId', (req, res) => {
	//POC method to change user request status
	//Quando é feita uma mudança no request, o SelfCare notifica este serviço, que notifica o cliente
	for (var i = 0; i < users.length; i++) {
		//Find User
		if(users[i].id == req.params.userId) {
			var requests = users[i].requests;
			for (var j = 0; j < users[i].requests.length; j++) {
				//Find User Request
				if(users[i].requests[j].id == req.params.requestId) {users[i].requests[j].status = req.body.status;
				}
			}
		}
	}
	sendRequests(req.params.userId, requests);
	res.sendStatus(200);
});


server = app.listen(8080, () => {
	console.log('Server running on http://localhost:8080')
});

var io = require('socket.io')(server);


io.on('connection', (socket) => {
  console.log('a user connected');

  socket.on('get-requests', (data) => {
  	console.log('channel get-requests');
  	console.log(data);

	for (var i = 0; i < users.length; i++) {
		//Find User
		if(users[i].id == data.userId) {
  			socket.emit('receive-requests', users[i].requests);
		}
	}
  });


});

sendRequests = (userId, requests) => {
	io.sockets.emit('receive-requests', requests);
};
