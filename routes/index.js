
/*
 * GET home page.
 */
var Kaiseki = require('kaiseki'),
    k = new Kaiseki(process.env.TCF_PARSE_APP_ID, process.env.TCF_PARSE_REST_KEY);

exports.index = function(req, res){
  res.render('index', { title: 'The Taxi Finder' });
};

exports.getTaxis = function(req, res) {
    var pickup = {lat: req.body.pickup.lat, lng: req.body.pickup.lng, english: req.body.pickup.english},
        dropoff = {lat: req.body.dropoff.lat, lng: req.body.dropoff.lng, english: req.body.dropoff.english};

    k.getObjects('taxiCompanies', function(err, response, body, success) {
        var allCompanies = body;
        //console.log(allCompanies);
        var companies = [];

        for(var d = 0; d < allCompanies.length; d++) {
            var comp = allCompanies[d],
                region = comp.area;
            var vertices_x = [],
                vertices_y = [];
            var split = region.split(',');
            for(var j = 0; j < split.length-1; j++) {
                if(j % 2 == 0) {
                    vertices_y.push(split[j]);
                } else {
                    vertices_x.push(split[j]);
                }
            }
            var points_polygon = vertices_x.length;
            var longitude_x = pickup.lng;
            var latitude_y = pickup.lat;
            var i = j = 0;
            var c = false;
            for(i = 0, j = points_polygon-1; i < points_polygon; j = i++) {
                if(((vertices_y[i] > latitude_y != (vertices_y[j] > latitude_y)) && (longitude_x < (vertices_x[j] - vertices_x[i]) * (latitude_y - vertices_y[i]) / (vertices_y[j] - vertices_y[i]) + vertices_x[i]))) {
                    c = !c;
                }
                if(c) {
                    companies.push(comp);
                }
            }
        }

        var order = {
            taxis: companies,
            "details": {
                pickup: pickup,
                dropoff: dropoff
            }
        }
        console.log(order);
        req.flash('order', JSON.stringify(order));

        res.send({'redirect': '/results'})
    });


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