//Loading our Environment variable
if (process.env.NODE_ENV !== 'production') {
    require('dotenv').config();
}

// API key
const WEATHER_API = process.env.WEATHER_API;


//Express
const express = require('express');
const path = require('path');
const PORT = process.env.PORT || 80;


// Using Fetch module
const fetch = require('node-fetch');


// Creating app
const app = express();
app.use(express.json());
// app.use(express.static('public'));
app.use(express.static(__dirname + '/static'));

// Setting the view engine
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use(express.urlencoded());



// Get requests
app.get('/', (req, res) => {
    res.render('index');
});



// POST requests
app.post('/search', (req, res) => {

    //Getting the city name
    let city = req.body.city;
    let url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${WEATHER_API}&units=metric`;
    // Function to fetch the weather data
    const request = async (url) => {
        const response = await fetch(url);
        const obj = await response.json();
        let myurl = `http://openweathermap.org/img/wn/${obj.weather[0].icon}@2x.png`;
        let sentdata = await {
            "cityname": obj.name,
            "weather" : obj.weather[0].description,
            "temp": obj.main.temp,
            "feels": obj.main.feels_like,
            "longitude": obj.coord.lon,
            "latitude": obj.coord.lat,
            "wind": obj.wind.speed,
            "pressure": obj.main.pressure,
            "country": obj.sys.country,
            "image": myurl,
            "humidity" :obj.main.humidity,
            "visibility" : obj.visibility
        }

        // Rendering the searchres page with the received data
        res.render('searchres', sentdata);
        console.log("Searched results for the city " + sentdata.cityname + " successfully.");
    }

    // Calling the function
    request(url);
});




// Running our app
app.listen(PORT, () => {
    console.log("Server Started");
});
