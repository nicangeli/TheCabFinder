$(document).ready(function() {

    $("#loader").hide();

    var socket = io.connect('/');
    socket.on('news', function (data) {
        console.log(data);
        socket.emit('my other event', { my: 'data' });
    });

    socket.on('response', function(data) {
        console.log(data);
        $("#loader").hide();
    });


    $("#time").timepicker({'step': 15, 'forceRoundTime': true});

    $("#submitBooking").click(function(e) {
        e.preventDefault();
        $("form").hide();
        $("#details").hide();
        $("#loader").show();


        socket.emit('order', {
            pickup: {
                lat: $("input[name='pickupLat']").val(),
                lng: $("input[name='pickupLng']").val(),
                english: $("input[name='pickupEnglish']").val()
            },
            dropoff: {
                lat: $("input[name='dropoffLat']").val(),
                lng: $("input[name='dropoffLng']").val(),
                english: $("input[name='dropoffEnglish']").val()
            },
            name: $("input[name='customerName']").val(),
            time: $("input[name='time']").val(),
            taxi: $("input[name='taxi']").val()
        });

    });
});