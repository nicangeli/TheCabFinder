$(document).ready(function() {
    $(".bookButton").click(function(e) {
        e.preventDefault();
        var taxiId = $(this).attr('data-id'),
            pickup = {
                lat: $("input[name='pickupLat']").val(),
                lng: $("input[name='pickupLng']").val(),
                english: $("input[name='pickupEnglish']").val()
            },
            dropoff = {
                lat: $("input[name='dropoffLat']").val(),
                lng: $("input[name='dropoffLng']").val(),
                english: $("input[name='dropoffEnglish']").val()
            }

        $.post('/finalize',
            {
                "taxi": taxiId,
                "details": {
                    "pickup": pickup,
                    "dropoff": dropoff
                }
            },
            function(data) {
                if(typeof data.redirect === "string") {
                    window.location = data.redirect;
                }
            });
    });
});