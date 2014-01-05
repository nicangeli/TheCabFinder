$(document).ready(function() {

    $("#loader").hide();

    $("#time").timepicker({'step': 15, 'forceRoundTime': true});

    $("#submitBooking").click(function(e) {
        e.preventDefault();
        $("form").hide();
        $("#details").hide();
        $("#loader").show();

        $.ajax({
            url: '/order',
            type: 'POST',
            data: {
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
            },
            timeout: 60000
        })
            .done(function(data) {
                window.location = data.redirect;
            });

            /*
        $.post('/order', {
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
        }, function(data) {
            /*var element;
            if(data.accepted) {
                element = "<h1>accepted</h1>";
            } else {
                element = "<h1>declined</h1>";
            }
            $("#loader").hide();
            $("#loader").prepend(element);
            
            window.location = data.redirect;
        });
*/
    });
});