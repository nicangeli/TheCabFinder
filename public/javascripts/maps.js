var map,
    lastPickupLocationFound,
    lastDropoffLocationFound;

function initialize() {
  var mapOptions = {
    center: new google.maps.LatLng(51.502759,-0.11673),
    zoom: 8
  };
map = new google.maps.Map(document.getElementById("map-canvas"),mapOptions);
}
google.maps.event.addDomListener(window, 'load', initialize);


$(document).ready(function() {

  $("#showTaxis").hide();
  $("#showDropoff").hide();
  $("#dropOffForm").hide();

  // geocode address when find button is clicked
  $("#findPickup").click(function() {
    var address = $('#pickupAddress').val(),
        geocoder = new google.maps.Geocoder();

    geocoder.geocode({'address': address, 'region': 'UK'}, function(results, status) {
        if (status == google.maps.GeocoderStatus.OK) {
          lastPickupLocationFound = results[0].geometry.location;
          //move map center to the first result back from the geocoding
            map.setCenter(lastPickupLocationFound);

            // zoom in on the result
            map.setZoom(17);
            // add a marker pin to the map
            var marker = new google.maps.Marker({
              map: map,
              position: lastPickupLocationFound
            });

            $("#findPickup").text("Search Again");
            $("#showDropoff").show();
          }
    })
  });

  $("#showDropoff").click(function(e) {
    e.preventDefault();
    $("#showDropoff").hide();
    $("#pickupForm").hide();
    $("#dropOffForm").show();
  });

  $("#findDropoff").click(function(e) {
    var address = $("#dropoffAddress").val(),
    geocoder = new google.maps.Geocoder();

    geocoder.geocode({'address': address, 'region': 'UK'}, function(results, status) {
      if(status == google.maps.GeocoderStatus.OK) {
        lastDropoffLocationFound = results[0].geometry.location;
        map.setCenter(lastDropoffLocationFound);
        var marker = new google.maps.Marker({
          map: map,
          position: lastDropoffLocationFound
        });

        $("#findDropoff").text("Search Again");
        $("#showTaxis").show();
      }

    });
  });

  $("#showTaxis").click(function(e) {
    e.preventDefault();
    $.post("/getTaxis", 
      {
        'pickup': 
          {
            'lat': lastPickupLocationFound.nb,
            'lng': lastPickupLocationFound.ob,
            'english': $("#pickupAddress").val()
          },
        'dropoff':
          {
            'lat': lastDropoffLocationFound.nb,
            'lng': lastDropoffLocationFound.ob,
            'english': $("#dropoffAddress").val()
          }
      },
      function(data) {
      if(typeof data.redirect === "string") {
        window.location = data.redirect;
      }
    });
  });

});