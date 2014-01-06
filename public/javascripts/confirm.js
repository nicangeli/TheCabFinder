$(document).ready(function() {

    $("#loader").hide();
    $("#accepted").hide();
    $("#declined").hide();

    var socket = io.connect('/');

    socket.on('response', function(data) {
        if(data.accepted) {
            $("#accepted").show();
        } else {
            $("#declined").show();
        }
    });

    $("#time").timepicker({'step': 15, 'forceRoundTime': true});

    $("#submitBooking").click(function(e) {
        e.preventDefault();
        $("form").hide();
        $("#details").hide();
        $("#loader").show();

        socket.emit('order',  {
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
                taxi: $("input[name='taxi']").val(),
                phoneNumber: $("input[name='phoneNumber']").val()
            }
        );
    });
});