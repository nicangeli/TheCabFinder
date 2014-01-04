
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


app.configure(function() {
    app.use(express.cookieParser('keyboard cat'));
    app.use(express.session({cookie : {maxAge: 60000}}));
    app.use(flash());
});

client.makeCall({
    to: '+447731768522',
    from: '+441733514667',
    url: 'http://localhost:3000/twiml.xml'
}, function(err, responseData) {
    if(err) {
        console.log(err)
    }
    console.log(responseData);
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
    var xml = '<?xml version="1.0" encoding="UTF-8"?><Response><Say voice="woman">Please leave a message after the tone.</Say></Response>';
    res.send(xml);
});

io.sockets.on('connection', function (socket) {
  //socket.emit('news', { hello: 'world' });
  socket.on('order', function (data) {
    // call twilio here
    console.log(data);

    socket.emit('response', {accepted: true});

  });
});

server.listen(app.get('port'), function(){
  console.log('Express server listening on port ' + app.get('port'));
});
