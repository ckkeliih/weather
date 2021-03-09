const express = require("express");
const https = require("https");
const bodyParser = require("body-parser");

const app = express();

app.use(bodyParser.urlencoded({extended: true}));

//displays index.html of root path
app.get("/", function(req, res) {
  res.sendFile(__dirname + "/index.html")
});

//invoked after hitting go in the html form
app.post("/", function(req, res) {
    
    // takes in the zip from the html form, display in // console. Takes in as string, ex. for zip 02139
        var lat = String(req.body.latInput);
        console.log(req.body.latInput);

        var lon = String(req.body.lonInput);
        console.log(req.body.lonInput);
    
    //build up the URL for the JSON query, API Key is // secret and needs to be obtained by signup 
        const units = "imperial";
        const apiKey = "12f0882419161c36a8f0837248f8440f";
        const url = "https://api.openweathermap.org/data/2.5/weather?lat=" + lat +  "&lon=" + lon + "&APPID=" + apiKey;
    
    // this gets the data from Open WeatherPI
    https.get(url, function(response){
        console.log(response.statusCode);
        
        // gets individual items from Open Weather API
        response.on("data", function(data){
            const weatherData = JSON.parse(data);
            const temp = weatherData.main.temp;
            const humidity = weatherData.main.humidity;
            const windSpeed = weatherData.wind.speed;
            const city = weatherData.name;
            const cloud = weatherData.clouds.all;
            const weatherDescription = weatherData.weather[0].description;
            const icon = weatherData.weather[0].icon;
            const imageURL = "http://openweathermap.org/img/wn/" + icon + "@2x.png";
            
            // displays the output of the results
            res.write("<h1> The weather is " + weatherDescription + "<h1>");
            res.write("<h2>The GPS coordinates for " + city + " is " + lat + "° " + lon + "°.<br>" + "<h2>The Temperature is " + temp + " Degrees Fahrenheit" + " with a " + humidity + "% humidity, a wind speed of " + windSpeed + " mph and cloudiness of " + cloud + "%.<h2>");
            res.write("<img src=" + imageURL +">");
            res.send();
        });
    });
})


//Code will run on 3000 or any available open port
app.listen(process.env.PORT || 3000, function() {
console.log ("Server is running on port")
});
