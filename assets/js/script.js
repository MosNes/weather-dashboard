//---------------------------GLOBAL VARIABLES--------------------------------------

const apiKey = "4cab09c32f1d271efdfae18ead81ae10";
var todaysDate = luxon.DateTime.now();



//---------------------------FUNCTIONS---------------------------------------------

// returns the latitude and longitude for the city based on the search string
var getGeoCoding = () => {
    fetch('http://api.openweathermap.org/geo/1.0/direct?q=Charlotte,nc,us&limit=1&appid='+apiKey)
    .then(function(response) {
        return response.json();
    })
    .then(function(data) {
        console.log(data);
    })
};


//returns weather conditions for the current day and a 7 day forecast
var getWeather = () => {
    //query string = q={city name},{country code}, {state code} eg q=Charlotte,us,nc
    fetch('https://api.openweathermap.org/data/2.5/weather?q=Charlotte,us,nc&appid='+apiKey)
    .then(function(response) {
        return response.json();
    })
    .then(function(data) {
        console.log(data);
    })
};

//---------------------------INITIALIZATIONS---------------------------------------
