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
        var id = String(req.body.idInput);
        console.log(req.body.idInput);
    
    //build up the URL for the JSON query, API Key is // secret and needs to be obtained by signup 
        const units = "imperial";
        const apiKey = "12f0882419161c36a8f0837248f8440f";
        const url = "https://api.openweathermap.org/data/2.5/weather?id=" + id +  "&units=" + units + "&APPID=" + apiKey;
    
    // this gets the data from Open WeatherPI
    https.get(url, function(response){
        console.log(response.statusCode);
        
        // gets individual items from Open Weather API
        response.on("data", function(data){
            const weatherData = JSON.parse(data);
            const temp = weatherData.main.temp;
            const city = weatherData.name;
            const wind = weatherData.wind.speed;
            const deg = weatherData.wind.deg;
            const clouds = weatherData.clouds.all;
            const icon = weatherData.weather[0].icon;
            const imageURL = "http://openweathermap.org/img/wn/" + icon + "@2x.png";
            
            // displays the output of the results
            res.write("<h1>The Temperature in " + city + " is " + temp + " Degrees Fahrenheit<h1>");
            res.write("<h2>The wind is blowing at " + wind + "mph from " + deg + " Degrees with " + clouds + "% cloudiness.<h2>");
            res.write("<img src=" + imageURL +">");
            res.send();
          
        });
    });
})


//Code will run on 3000 or any available open port
app.listen(process.env.PORT || 3000, function() {
console.log ("Server is running on port")
});
