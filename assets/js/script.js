//---------------------------GLOBAL VARIABLES--------------------------------------

const apiKey = "4cab09c32f1d271efdfae18ead81ae10";
var todaysDate = luxon.DateTime.now();
const searchInputEl = $("#city-input");
const currentWeatherContainerEl = $("#current-weather-card");
const forecastContainerEl= $("#forecast-card-container");
var searchHistory = {};


//---------------------------FUNCTIONS---------------------------------------------
var displayCurrentWeather = (data,city) => {

    //clears current card if present
    currentWeatherContainerEl.empty();

    //create elements
    let cardEl = $("<div>").addClass("card");
    let cardBodyEl = $("<div>").addClass("card-body");
    let cardTitleEl = $("<h3>").addClass("card-title").text(city);
    let iconContainerEl = $("<p>").addClass("card-text mb-2");
    //the @2x in the URI returns a larger icon for this larger card
    let iconEl = $("<img>").attr("src","http://openweathermap.org/img/wn/"+data.weather[0].icon+"@2x.png")
    let cardSubtitleEl = $("<h5>").addClass("card-subtitle mb-2 text-muted").text(luxon.DateTime.fromSeconds(parseInt(data.dt)).toLocaleString(luxon.DateTime.DATE_SHORT));
    let tempEl = $("<p>").addClass("card-text mb-2").text("Temp: "+data.temp);
    let windEl = $("<p>").addClass("card-text mb-2").text("Wind: "+data.wind_speed+" mph");
    let humidityEl = $("<p>").addClass("card-text mb-2").text("Humidity: "+data.humidity+" %");
    let uvEl = $("<p>").addClass("card-text mb-2").text("UV Index: ");
    let uvPillEl = $("<span>").addClass("badge").text(data.uvi);
    
    //gets the UV Index as a number and changes the color of the uvPillEl depending on the index's severity
    let uvIndex = parseInt(data.uvi);
    if(uvIndex < 2){
        uvPillEl.addClass("bg-success");
    }
    else if (uvIndex > 6) {
        uvPillEl.addClass("bg-danger");
    }
    else {
        uvPillEl.addClass("bg-warning");
    }

    //add elements to DOM
    uvEl.append(uvPillEl);
    iconContainerEl.append(iconEl);
    //jQuery can append multiple items in one call
    cardBodyEl.append(cardTitleEl,cardSubtitleEl,iconContainerEl,tempEl,windEl,humidityEl,uvEl);
    cardEl.append(cardBodyEl);
    currentWeatherContainerEl.append(cardEl);

};

var displayForecastCard = (data) => {
    //create elements
    let cardEl = $("<div>").addClass("card bg-dark col-2 mb-4");
    let cardBodyEl = $("<div>").addClass("card-body");
    let cardTitleEl = $("<h4>").addClass("card-title text-light")
    //this weather API uses UNIX strings for its datetime values .fromSeconds(parseInt(data.dt)) converts the UNIX string into a more traditional datetime object
    .text(luxon.DateTime.fromSeconds(parseInt(data.dt)).toLocaleString(luxon.DateTime.DATE_SHORT));
    let iconContainerEl = $("<p>").addClass("card-text mb-2");
    //removed the @2x from this URI to return a smaller Icon for these smaller cards
    let iconEl = $("<img>").attr("src","http://openweathermap.org/img/wn/"+data.weather[0].icon+".png");
    //added .day to get the daytime temp
    let tempEl = $("<p>").addClass("card-text text-light mb-2").text("Temp: "+data.temp.day);
    let windEl = $("<p>").addClass("card-text text-light mb-2").text("Wind: "+data.wind_speed+" mph");
    let humidityEl = $("<p>").addClass("card-text text-light mb-2").text("Humidity: "+data.humidity+" %");

    //add elements to DOM
    iconContainerEl.append(iconEl);
    cardBodyEl.append(cardTitleEl,iconContainerEl,tempEl,windEl,humidityEl,)
    cardEl.append(cardBodyEl);
    forecastContainerEl.append(cardEl);
};


// returns the forecast for the chosen city
var getWeather = async (city, stateCode) => {
    //returns the latidude and longitude of the inputted city
    await fetch('http://api.openweathermap.org/geo/1.0/direct?q=' + city + ',' + stateCode + ',us&limit=1&appid=' + apiKey)
        //parses the JSON response
        .then(async function (response) {
            if (response.ok) {
                let newResponse = await response.json();
                return newResponse;
            } else {
                //if not successful, redirect to home page
                document.location.replace("./index.html");
            }
        })

        //gets the latitude and longitude, then uses it to make the API call to get the forecast
        .then(async function (data) {
            var latitude = data[0].lat;
            var longitude = data[0].lon;
            //this fetch has to be nested inside of this .then statement, because it can only run once the previous promises are resolved
            //units=imperial to get temp in Farenheit and windspeed in mph
            //excludes minutely forecasts, hourly forecasts, and weather alerts
            await fetch('https://api.openweathermap.org/data/2.5/onecall?lat=' + latitude + '&lon=' + longitude + '&units=imperial&exclude=minutely,hourly,alerts&appid=' + apiKey)
                //parses the new JSON response
                .then(async function (response) {
                    if (response.ok) {
                        let newResponse = await response.json();
                        return newResponse;
                    } else {
                        //if not successful, redirect to home page
                        document.location.replace("./index.html");
                    }
                })

                //displays the weather info from the parsed data
                .then(async function (data) {
                    let currentWeather = data.current;
                    //capitalizes the first letter of the city
                    let capitalizedCity = city => {
                        return city.charAt(0).toUpperCase()+city.slice(1);
                    }
                    displayCurrentWeather(currentWeather, capitalizedCity(city));
                    let forecastArray = data.daily;

                    //removes any existing cards from the forecast container
                    forecastContainerEl.empty();
                    
                    //constructs forecast cards to display current weather
                    for (var i = 0; i < 5; i++){
                        displayForecastCard(forecastArray[i]);
                        console.log("run"+i);
                    }
                    

                  

                })
        })
};


//gets the latitude and longitude, then uses it to make the API call to get the forecast


var submitHandler = () => {
    //gets the value of the search input box, trims whitespace, converts to lowercase, and splits on "," to convert it to an
    //array containing the city and the state code
    let input = searchInputEl.val().trim().toLowerCase().split(",");

    //get city string
    let city = input[0];

    //remove all spaces from the state code
    let stateCode = input[1].replace(/\s/g, "");

    //if state code is longer than 2 characters, display message and stop
    if (stateCode.length > 2) {
        window.alert("Please use the state abbreviation, e.g. 'NC' or 'NY'");
        return;
    }

    //run the getWeather function using the input
    getWeather(city, stateCode);

    //reset search field
    searchInputEl.val("");
};

//---------------------------INITIALIZATIONS---------------------------------------

$("#submit-button").on("click", submitHandler);