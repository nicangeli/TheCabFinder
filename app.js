
/**
 * Module dependencies.
 */

var express = require('express')
  , routes = require('./routes')
  , app = express()
  , user = require('./routes/user')
  , server = require('http').createServer(app)
  , path = require('path')
  , flash = require('connect-flash')
  , io = require('socket.io').listen(server)
  , client = require('twilio')(process.env.TWILIO_SID, process.env.TWILIO_TOKEN);

var response,
    ws;

app.configure(function() {
    app.use(express.cookieParser('keyboard cat'));
    app.use(express.session({cookie : {maxAge: 60000}}));
    app.use(flash());
});

// all environments
app.set('port', process.env.PORT || 3000);
app.set('views', __dirname + '/views');
app.set('view engine', 'jade');
app.use(express.favicon());
app.use(express.logger('dev'));
app.use(express.bodyParser());
app.use(express.methodOverride());
app.use(app.router);
app.use(express.static(path.join(__dirname, 'public')));

// development only
if ('development' == app.get('env')) {
  app.use(express.errorHandler());
}

app.get('/', routes.index);
app.post('/getTaxis', routes.getTaxis);
app.get('/results', routes.results);
app.post('/finalize', routes.finalize);
app.get('/confirm', routes.confirm);

app.post('/twiml/:pickup/:dropoff/:time/:name/:phoneNumber', function(req, res) {
    var pickup = req.params.pickup,
        dropoff = req.params.dropoff,
        time = req.params.time,
        name = req.params.name,
        phoneNumber = req.params.phoneNumber;

    // split pickup and dropoff out into spaced out post codes to help with pronoucing them
    pickup = pickup.split('').join(' ');
    dropoff = dropoff.split('').join(' ');

    var xml = '<?xml version="1.0" encoding="UTF-8"?><Response><Gather timeout="10" finishOnKey="#" action="/voiceresponse" method="POST"><Say voice="woman">This is an automated order from The Cab Finder. You have been booked to pick up from ' + pickup + ' and drop off at ' + dropoff + '. The customer wants picking up at ' + time + ' and is called ' + name + '. The client is reachable on ' + phoneNumber + '. Press 1 to accept and 2 to decline.</Say></Gather></Response>';
    res.send(xml);
});

app.post('/voiceresponse', function(req, res) {

    var accepted = {};
    if(req.body.Digits === '1') {
        accepted.accepted = true;
    } else {
        accepted.accepted = false;
    }
    //response.send(accepted);
    ws.emit('response', accepted);
    
});

app.post('/status', function(req, res) {
    console.log('status');
    console.log(req.body);
})

io.sockets.on('connection', function(socket) {
    ws = socket;
    socket.on('order', function(data) {
        console.log('placing order');
        var pickup = escape(data.pickup.english),
            dropoff = escape(data.dropoff.english),
            time = escape(data.time),
            name = escape(data.name),
            phoneNumber = escape(data.phoneNumber);

        client.makeCall({
            to: '+447731768522',
            from: '+441733514667',
            url: 'http://thecabfinder.herokuapp.com/twiml/' + pickup + '/' + dropoff + '/' + time + '/' + name + '/' + phoneNumber,
            StatusCallBack: 'http://thecabfinder.herokuapp.com/status',
            StatusCallBackMethod: 'POST'
        }).then(function(call) {
            console.log('made call');
        }, function(error) {  
            console.log('error');
        });
        //console.log(responseData);

    });
});



server.listen(app.get('port'), function(){
  console.log('Express server listening on port ' + app.get('port'));
});
