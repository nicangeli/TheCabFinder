
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

app.post('/twiml.xml', function(req, res) {
    var xml = '<?xml version="1.0" encoding="UTF-8"?><Response><Gather timeout="10" finishOnKey="#" action="/voiceresponse" method="POST"><Say voice="woman">This is an automated order from The Cab Finder. Press 1 to accept and 2 to decline.</Say></Gather></Response>';
    res.send(xml);
});

app.post('/voiceresponse', function(req, res) {
    /*console.log('voice response')
    console.log(req.body);
    var accepted;
    if(req.body.Digits === '1') {
        accepted = true;
    } else {
        accepted = false;
    }
    response.redirect('/accepted');
    */
    console.log('responding to hallo');
    res.redirect('http://thecabfinder.herokuapp.com/accept');
});


app.post('/order', function(req, res) {
    client.makeCall({
        to: '+447731768522',
        from: '+441733514667',
        url: 'http://thecabfinder.herokuapp.com/twiml.xml'
    }, function(err, responseData) {
        if(err) {
            throw err;
        }
        response = res;
        //console.log(responseData);
    });
});


server.listen(app.get('port'), function(){
  console.log('Express server listening on port ' + app.get('port'));
});
