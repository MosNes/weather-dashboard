//---------------------------GLOBAL VARIABLES--------------------------------------

const apiKey = "4cab09c32f1d271efdfae18ead81ae10";
var todaysDate = luxon.DateTime.now();
var searchInput = $("#city-input")



//---------------------------FUNCTIONS---------------------------------------------

// returns the forecast for the chosen city
var getWeather = async () => {
    //returns the latidude and longitude of the inputted city
    await fetch('http://api.openweathermap.org/geo/1.0/direct?q=Charlotte,nc,us&limit=1&appid='+apiKey)
    //parses the JSON response
    .then(async function(response) {
        let responseJSON = await response.json();
        return responseJSON;
    })
    //gets the latitude and longitude, then uses it to make the API call to get the forecast
    .then(async function(data) {
        var latitude = data[0].lat;
        var longitude =data[0].lon;
        console.log("lat",latitude);
        console.log("long",longitude)
        await fetch('https://api.openweathermap.org/data/2.5/onecall?lat='+latitude+'&lon='+longitude+'&exclude=minutely,hourly,alerts&appid='+apiKey)
        //parses the JSON response
        .then(async function(response) {
            let responseJSON = await response.json();
            console.log(responseJSON);
            return responseJSON;
        })
      
      });
    
    };

var formatInput = () => {
    console.log(searchInput.text());
};

//---------------------------INITIALIZATIONS---------------------------------------

$("#submit-button").on("click",formatInput);