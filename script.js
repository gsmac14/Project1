$(document).ready(function() {
    // getting past CORS
    jQuery.ajaxPrefilter(function(options) {
        if (options.crossDomain && jQuery.support.cors) {
            options.url = 'https://cors-anywhere.herokuapp.com/' + options.url;
        }
    });

    // global variables
    var callsign = '';
    var city = '';
    var state = '';
    var stations = [];
    var genres = [];

    // search button event handler
    $("#search-button").on("click", function(event) {
        event.preventDefault();

        // TODO: make sure the input is valid
        city = $("#city-input").val();
        // state = ;

        // if the input is valid, go to the results page and display the list of radio stations
        getStations();
        
        // TODO: otherwise, tell the user to search again
    });
    
    // return a list of radio stations using dar fm api
    function getStations() {
        // dar fm
        var apiKey = '4363387309';

        // for now, we are hard coding city & state
        city = 'san diego';
        state = 'ca';
        
        var darURL = 'http://api.dar.fm/darstations.php?callback=json&city=' + city + '&state=' + state + '&exact=1&partner_token=' + apiKey;
        var darURLEncoded = encodeURI(darURL);

        $.ajax({
            url: darURLEncoded,
            method: "GET"
        }).then(function(response) {
            var results = response.result[0].stations;

            for (var i = 0; i < results.length; i++) {
                localStorage.clear();

                // add to list of genres
                if (!genres.includes(results[i].genre)) {
                    genres.push(results[i].genre);
                }

                // station info
                var station = {
                    genre: results[i].genre,
                    callsign: results[i].callsign,
                    dial: results[i].dial,
                    slogan: results[i].slogan
                }

                stations.push(station);
            }

            localStorage.setItem('genres', JSON.stringify(genres));
            localStorage.setItem('stations', JSON.stringify(stations));

            window.location.href = './results.html';
        });
    }

    // get list of previously searched stations from local storage, if any
    function init() {
        var storedStations = JSON.parse(localStorage.getItem("stations"));
        var storedGenres = JSON.parse(localStorage.getItem("genres"));

        if (storedStations !== null) {
            stations = storedStations;
        }

        if (storedGenres !== null) {
            genres = storedGenres;
        }
    }

    init();
});





/*
// get user's location based off of ip address
var queryURL = "http://ip-api.com/json/";

$.ajax({
    url: queryURL,
    method: "GET"
}).then(function(response) {
    city = response.city;
    state = response.region;

    getStations();
});
*/