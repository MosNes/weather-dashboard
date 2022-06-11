//---------------------------GLOBAL VARIABLES--------------------------------------

const apiKey = "4cab09c32f1d271efdfae18ead81ae10";
var todaysDate = luxon.DateTime.now();
var searchInputEl = $("#city-input")



//---------------------------FUNCTIONS---------------------------------------------

// returns the forecast for the chosen city
var getWeather = async (city,stateCode) => {
    //returns the latidude and longitude of the inputted city
    await fetch('http://api.openweathermap.org/geo/1.0/direct?q='+city+','+stateCode+',us&limit=1&appid='+apiKey)
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
        .then(function(data) {
            //get object containing the current weather
            let currentWeather = data.current;

            //get array containing the forecast data
            let forecastArray = data.daily;

            //create card for current weather
            let 

        })
      
      });
    
    };

var submitHandler = () => {
    //gets the value of the search input box, trims whitespace, converts to lowercase, and splits on "," to convert it to an
    //array containing the city and the state code
    let input = searchInputEl.val().trim().toLowerCase().split(",");

    //get city string
    let city = input[0];

     //remove all spaces from the state code
    let stateCode = input[1].replace(/\s/g,"");

    //if state code is longer than 2 characters, display message and stop
    if (stateCode.length > 2) {
        window.alert("Please use the state abbreviation, e.g. 'NC' or 'NY'");
        return;
    }

    //run the getWeather function using the input
    getWeather(city,stateCode);

    //reset search field
    searchInputEl.val("");
};

//---------------------------INITIALIZATIONS---------------------------------------

$("#submit-button").on("click",submitHandler);