$(document).ready(function() {
    // getting past CORS
    jQuery.ajaxPrefilter(function(options) {
        if (options.crossDomain && jQuery.support.cors) {
            options.url = 'https://cors-anywhere.herokuapp.com/' + options.url;
        }
    });

    var apiKey = '4363387309';
    var genres = [];
    var stations = [];
    var container = $(".container");
    var storedGenres = JSON.parse(localStorage.getItem("genres"));
    var storedStations = JSON.parse(localStorage.getItem("stations"));
    var dataGenre = $(".data-genre");
    var callsign = '';

    // get info from localStorage
    if (storedStations !== null) {
        stations = storedStations;
    }

    if (storedGenres !== null) {
        genres = storedGenres;
    }

    // generate a card for each genre
    for (var i = 0; i < genres.length; i++) {
        var row = $("<div>");
        row.addClass("row");
        container.append(row);

        var col = $("<div>");
        col.addClass("col-4");
        row.append(col);

        var card = $("<div>");
        card.addClass("card");
        col.append(card);

        var cardContent = $("<div>");
        cardContent.addClass("card-content white-text");
        card.append(cardContent);

        var span = $("<span>");
        span.addClass("card-title");
        span.html(genres[i]);
        cardContent.append(span);

        var stationLinksDiv = $("<div>");
        stationLinksDiv.addClass("card-action");
        stationLinksDiv.attr("data-genre", genres[i]);
        card.append(stationLinksDiv);
    }

    // fill in the links for each radio found for a genre
    for (var i = 0; i < stations.length; i++) {
        // locate the card to put it in
        // $(event.target).data('city')
        // .addClass('demo');
        var whichGenre = '[data-genre="' + stations[i].genre + '"]';
        var genreCard = $(whichGenre);

        // add a link to that station
        var link = $("<a>");
        link.attr("href", "#");// stations[i].websiteurl);
        // link.attr("target", "_blank");
        link.attr("class", "station")
        link.attr("data-callsign", stations[i].callsign);
        link.html(stations[i].callsign);
        genreCard.append(link);
    }

    // change callsign
    $(".station").on("click", function(event) {
        callsign = $(event.target).data('callsign');

        // api.dar.fm/uberstationurl.php?callsign=[call_letters]&partner_token=[token]
        var playerURL = 'http://api.dar.fm/uberstationurl.php?callback=json&callsign=' + callsign + '&partner_token=' + apiKey;
        var playerURLEncoded = encodeURI(playerURL);

        $.ajax({
            url: playerURLEncoded,
            method: "GET"
        }).then(function(response) {
            var radioURL = response.result[0].websiteurl;
            var streamURL = response.result[0].url;
            console.log(response.result[0]);

            $("#player").attr("style", "display: block;");
            $("#player").attr("src", streamURL);

            // var audioPlayer = $("<audio>");
            // audioPlayer.attr("src", streamURL);
            // audioPlayer.attr("autoplay", "true");
            // audioPlayer.attr("controls", "true");
            // audioPlayer.attr("volume", "1.0");

            // container.prepend(audioPlayer);

            // <audio src="http://www.partyviberadio.com:8000/;listen.pls?sid=1" autoplay="true" controls="true" volume="1.0"></audio>
        });


        /*
        // api.dar.fm/player_api.php?callsign=KBZT&onnow_display=true&station_display=true&volume_display=true&partner_token=1234567890
        var webPlayerURL = 'http://api.dar.fm/player_api.php?callsign=' + callsign + '&onnow_display=true&station_display=true&volume_display=true&partner_token=' + apiKey;
        var webPlayerURLEncoded = encodeURI(webPlayerURL);

        $.ajax({
            url: webPlayerURLEncoded,
            method: "GET"
        }).then(function(response) {
            console.log(webPlayerURLEncoded);
        });
        */
    });
});

/*
darInit("bastille", $(".image-viewer"), "1234567890", styles = {
    width: '250',
    clear: 'left',
    border: '1px solid #CCCCCC',
    ‘background-color': 'transparent'
});
*/