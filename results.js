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
    var stationID = '';

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
        var whichGenre = '[data-genre="' + stations[i].genre + '"]';
        var genreCard = $(whichGenre);

        // add a link to that station
        var link = $("<a>");
        link.attr("href", "#"); // stations[i].websiteurl);
        // link.attr("target", "_blank");
        link.attr("class", "station")
        link.attr("data-callsign", stations[i].callsign);
        link.attr("data-stationid", stations[i].station_id);
        link.html(stations[i].callsign);
        genreCard.append(link);
    }

    // change callsign
    $(".station").on("click", function(event) {
        callsign = $(event.target).data('callsign');
        stationID = $(event.target).data('stationid');

        var playerURL = 'http://api.dar.fm/uberstationurl.php?callback=json&callsign=' + callsign + '&partner_token=' + apiKey;
        var playerURLEncoded = encodeURI(playerURL);

        $.ajax({
            url: playerURLEncoded,
            method: "GET"
        }).then(function(response) {
            var radioURL = response.result[0].websiteurl;
            var streamURL = response.result[0].url;

            $("#player").attr("src", streamURL);
            $("#player").attr("style", "display: block;");
            getCurrentSong();
        });
    });

    function getCurrentSong() {
        var songURL = 'http://api.dar.fm/playlist.php?station_id=' + stationID + '&partner_token=' + apiKey;

        $.ajax({
            url: songURL,
            method: "GET"
        }).then(function(response) {
            console.log(response);
        });
    }
});