// dallas - other music (kxt), alternative (renegade radio)

$(document).ready(function() {
    // getting past CORS
    jQuery.ajaxPrefilter(function(options) {
        if (options.crossDomain && jQuery.support.cors) {
            options.url = 'https://cors-anywhere.herokuapp.com/' + options.url;
        }
    });

    // global vars
    var apiKey = '4363387309';

    var callsign = '';
    var stationID = '';
    var genres = [];
    var stations = [];
    var container = $(".container");
    var dataGenre = $(".data-genre");
    
    var storedGenres = JSON.parse(localStorage.getItem("genres"));
    var storedStations = JSON.parse(localStorage.getItem("stations"));

    // get info from localStorage
    if (storedGenres !== null) {
        genres = storedGenres;
    }

    if (storedStations !== null) {
        stations = storedStations;
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

        // genre title
        var span = $("<span>");
        span.addClass("card-title");
        span.html(genres[i]);
        cardContent.append(span);

        // container for stations
        var stationLinksDiv = $("<div>");
        stationLinksDiv.addClass("card-action");
        stationLinksDiv.attr("data-genre", genres[i]);
        card.append(stationLinksDiv);

        // Adds card content to result page
        $(".card-info").append(row);
    }

    // fill in the stations found for a genre
    for (var i = 0; i < stations.length; i++) {
        // locate the card to put it in
        var whichGenre = '[data-genre="' + stations[i].genre + '"]';
        var genreCard = $(whichGenre);

        // each station has a unique callsign and station_id
        var link = $("<a>");
        link.attr("href", "#");
        link.attr("class", "station")
        link.attr("data-callsign", stations[i].callsign);
        link.attr("data-stationid", stations[i].station_id);
        link.html(stations[i].callsign);
        genreCard.append(link);
    }

    // when you click on a station, it changes the src for the audio player using the callsign
    $(".station").on("click", function(event) {
        callsign = $(event.target).data('callsign');
        stationID = $(event.target).data('stationid');

        var playerURL = 'http://api.dar.fm/uberstationurl.php?callback=json&callsign=' + callsign + '&partner_token=' + apiKey;
        var playerURLEncoded = encodeURI(playerURL);

        $.ajax({
            url: playerURLEncoded,
            method: "GET"
        }).then(function(response) {
            var streamURL = response.result[0].url;

            $("#player").attr("src", streamURL);
            $("#player").attr("style", "display: block;");

            getCurrentSong();
        });
    });

    // get current song info
    function getCurrentSong() {
        var songURL = 'http://api.dar.fm/playlist.php?callback=json&station_id=' + stationID + '&partner_token=' + apiKey;

        // if (refresh) {
        //     clearTimeout(refresh);
        //     refresh = null;
        // }
        // refresh = setTimeout(function(){ getCurrentSong(); }, 100);

        $.ajax({
            url: songURL,
            method: "GET"
        }).then(function(response) {
            $("#song-info").empty();
            var artist = 'unknown';
            var title = 'unknown';

            //  show the song title, artist, and current station
            var song = $("<p>");
            song.attr("style", "color: white;");
            if (response.result[0].artist !== undefined) {
                artist = response.result[0].artist;
            }
            if (response.result[0].title !== undefined) {
                title = response.result[0].title;
            }

            console.log(response.result[0].artist);

            song.html(title + ' - ' + artist + ' // Now playing on ' + callsign);
            $("#song-info").append(song);

            getAlbumArt(response.result[0].artist, response.result[0].title);
        });
    }

    // last fm api key
    var lastFMKey = 'bd9e30016f70dbefbda1a9172d668e5e';

    // get album art using last fm
    function getAlbumArt(artist, track) {
        var albumURL = 'http://ws.audioscrobbler.com/2.0/?method=track.getInfo&api_key=' + lastFMKey + '&artist=' + artist + '&track=' + track + '&format=json';
        
        $.ajax({
            url: encodeURI(albumURL),
            method: "GET"
        }).then(function(response) {
            var img = $("<img>");

            // if album art listed, then use that - otherwise, use placeholder
            if (response.track.album.image[0]['#text'] !== undefined) {
                img.attr("src", response.track.album.image[0]['#text']);
            } else {
                img.attr("src", 'https://via.placeholder.com/100');
            }

            $("#song-info").append(img);
        });
    }
});