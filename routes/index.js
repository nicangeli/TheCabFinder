
/*
 * GET home page.
 */

exports.index = function(req, res){
  res.render('index', { title: 'The Taxi Finder' });
};

exports.getTaxis = function(req, res) {
    var pickup = {lat: req.body.pickup.lat, lng: req.body.pickup.lng, english: req.body.pickup.english},
        dropoff = {lat: req.body.dropoff.lat, lng: req.body.dropoff.lng, english: req.body.dropoff.english};

    var order = {
        "taxis": [
            {
                'id': '1',
                'name': 'The Good Taxis',
                'number': '07786556455'
            },
            {
                'id': '2',
                'name': 'Solid Cabs', 
                'number': '0208776577'
            }
        ],
        "details": {
            pickup: pickup,
            dropoff: dropoff
        }
    };

    req.flash('order', JSON.stringify(order));

    res.send({'redirect': '/results'})
};

exports.results = function(req, res) {
    var order = req.flash('order');
    if(order.length > 0) {
        order = JSON.parse(order);
    } else {
        res.send(404);
    }

    res.render('results', {order: order});
};

exports.finalize = function(req, res) {
    req.flash('order', JSON.stringify(req.body));
    res.send({'redirect': '/confirm'});
}

exports.confirm = function(req, res) {
    var order = req.flash('order');
    if(order.length >0) {
        order = JSON.parse(order);
    } else {
        res.send(404);
    }

    res.render('confirm', {order: order});
}