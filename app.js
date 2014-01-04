
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

var response;

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

app.post('/twiml/', function(req, res) {
    var details = req.flash('details');
    console.log(details);
    var xml = '<?xml version="1.0" encoding="UTF-8"?><Response><Gather timeout="10" finishOnKey="#" action="/voiceresponse" method="POST"><Say voice="woman">This is an automated order from The Cab Finder. You have been booked to pick up from' + details.pickup.english + ' and drop off at ' + details.dropoff.english + '. The customer wants picking up at ' + details.time + ' and is called ' + details.name + '. Press 1 to accept and 2 to decline.</Say></Gather></Response>';
    res.send(xml);
});

app.post('/voiceresponse', function(req, res) {

    var accepted = {};
    if(req.body.Digits === '1') {
        accepted.redirect = '/accepted';
    } else {
        accepted.redirect = '/declined';
    }
    response.send(accepted);
    
});


app.post('/order', function(req, res) {
    response = res;
    var pickup = req.body.pickup.english,
        dropoff = req.body.dropoff.english,
        time = req.body.time,
        name = req.body.name;

    req.flash('details', JSON.stringify(req.body));

    client.makeCall({
        to: '+447731768522',
        from: '+441733514667',
        url: 'http://thecabfinder.herokuapp.com/twiml/'
    }, function(err, responseData) {
        if(err) {
            throw err;
        }
        response = res;
    });
});


server.listen(app.get('port'), function(){
  console.log('Express server listening on port ' + app.get('port'));
});
