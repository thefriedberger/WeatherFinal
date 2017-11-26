
var options = {
  enableHighAccuracy: true,
  timeout: 5000,
  maximumAge: 0
}
function success(pos) {
	var crd = pos.coords;
	var lat = crd.latitude;
	var lon = crd.longitude
	
	console.log(lat);
	console.log(lon);
	getLocationCurrent(lat, lon);
	getLocationForecast(lat, lon);
	getLocationName(lat, lon);
}

function error(er) {
	
}
navigator.geolocation.getCurrentPosition(success, error, options);

var xhttp1;//for getting current location weathe

function getLocationCurrent(lat, lon){
	var data;
	xhttp1 = new XMLHttpRequest();
	xhttp1.addEventListener("load", getWeather);
	xhttp1.open("GET", "http://api.openweathermap.org/data/2.5/weather?lat="+lat+"&lon="+lon+"&APPID=29bb226f726114879207742f5261bfad");
	xhttp1.send();
}

var geo; //for getting current location name (city/town)

function getLocationName(lat, lon) {
	var data;
	geo = new XMLHttpRequest();
	geo.addEventListener("load", getWeather);
	geo.open("GET", "http://open.mapquestapi.com/geocoding/v1/reverse?key=C9ml1AscuDGhkLOtfoKQvTUYXbNlaauw&location="+lat+","+lon);
	geo.send();
}
function findLocation() {
	currentLocation = JSON.parse(geo.responseText);
	console.log(currentLocation);
	var location =  currentLocation.results[0].locations[0].adminArea5 + ', ' + currentLocation.results[0].locations[0].adminArea3;
	return location;
}

function getWeather(e) {
	currentWeather = JSON.parse(xhttp1.responseText);
	console.log(currentWeather); //use as a reference to look into api
	
	
		//finds the current temp and displays it
	var temp = document.getElementById("temp");
	temp.innerHTML = Math.floor((currentWeather.main.temp * (9/5)) - 459.67) + '&#176';
	
	var date = document.getElementById('date');
	date.innerHTML = findDate(0,"full");
	//finds current location and displays it
	var location = document.getElementById("location");
	myLocation = findLocation();
	location.innerHTML = myLocation;
	
	//finds current wind speed and displays it
	var windSpeed = document.getElementById("speed");
	windSpeed.innerHTML = currentWeather.wind.speed;
	
	//finds wind chill and displays
	/*
	var currentWindChill = channel.wind.chill;
	var windChill = document.getElementById("chill");
	windChill.innerHTML = 'Feels like ' + currentWindChill + '&#176';	
	*/
		
}
var xhttp2;

function getLocationForecast(lat, lon) {
	var data;
	xhttp2 = new XMLHttpRequest();
	xhttp2.addEventListener("load", getForecast);
	xhttp2.open("GET", "http://api.openweathermap.org/data/2.5/forecast?lat="+lat+"&lon="+lon+"&APPID=29bb226f726114879207742f5261bfad");
	xhttp2.send();
}
function getForecast() {
	currentForecast = JSON.parse(xhttp2.responseText);
	console.log(currentForecast);
	
	list = currentForecast.list;
		//loop through the 5 day forecast
	for (var i = 0; i < 5; i++) {
		//display date for forecasts this doens't work as the APIs don't have any dates that can be used. Will have to increment manually
		
		var forecastDay = list[i].dt;
		var day = document.getElementsByClassName("day");
		day[i].innerHTML += findDate(i);
		
		/*
		Determine which images to display for projected weather
		determine background color for each card
		use this to apply animation, but might externalize the drawing as it's getting crowded
		*/
		var weather = list[i].weather[0].description;
		var layer = document.getElementsByClassName("animation");
		if (weather == "few clouds" || weather == "broken clouds") { //set class for partly cloudy/sunny
			layer[i].classList.add("partly");
			layer[i].appendChild(makeWind('breeze1')); //add some wind
		}else if (weather == "Clouds" || weather  == "Mostly Cloudy"|| weather == "scattered clouds") { //set class for cloudy/mostly cloudy
			layer[i].classList.add("cloudy");
			layer[i].appendChild(makeWind('breeze1')); //add some wind
		} else if (weather == "clear sky") { //set class for sunny
			layer[i].classList.add("sunny");
		}else if (weather == "moderate rain") { //set class for normal rain
			layer[i].classList.add("rainy"); 
		}else if (weather == "light rain" || weather == "Showers") { //set class for light rain
			layer[i].classList.add('lightRain');
		}else if (weather == "Scattered Thunderstorms") { //Scattered thunderstorms, only two bolts
			layer[i].classList.add('rainy');
			layer[i].insertBefore(makeLightning('lightning1'), layer[i].childNodes[0]); //add lightning as the first child of the layer[i]
			layer[i].insertBefore(makeLightning('lightning2'), layer[i].childNodes[0]); //add lightning as the first child of the layer[i]
		}else if (weather == "Thunderstorms") { //I hope that's how they refer to normal thunderstorms
			layer[i].classList.add('rainy');
			layer[i].insertBefore(makeLightning('lightning1'), layer[i].childNodes[0]); //add lightning as the first child of the layer[i]
			layer[i].insertBefore(makeLightning('lightning2'), layer[i].childNodes[0]); //add lightning as the first child of the layer[i]
			layer[i].insertBefore(makeLightning('lightning3'), layer[i].childNodes[0]); //add lightning as the first child of the layer[i]
		}else if (weather == "Breezy" ) { //set class for breezy
			layer[i].classList.add("breezy");
			layer[i].appendChild(makeWind('breeze1')); //add some wind
			layer[i].appendChild(makeWind('breeze2'));
			layer[i].appendChild(makeWind('breeze3'));
		}else { //default screen response if I don't know have an animation for the weather
			layer[i].classList.add('defaultWeather');
		}
		
		//get the high temperatures for each day, put them in
		var highTemp = Math.floor((list[i].main.temp_max * (9/5)) - 459.67);
		var high = document.getElementsByClassName("high");
		high[i].innerHTML += highTemp + '&#176';
		
		//get the lows for each day, put them in
		var lowTemp = Math.floor((list[i].main.temp_min * (9/5)) - 459.67);
		var low = document.getElementsByClassName("low");
		low[i].innerHTML += lowTemp + '&#176';
	}
}
function findDate(i, length) {
	var d = new Date();
	var date = d.getDate();//gets the number date
	var days = ["Sun","Mon","Tue","Wed","Thu","Fri","Sat"];
	var day = days[d.getDay()+i];//gets the name day
	var months = ["Jan",'Feb','Mar','Apr','May','June','July','Aug','Sep','Oct','Nov','Dec'];
	var month = months[d.getMonth()];
	var year = d.getFullYear();
	var total;
	if(length == "full") {
		total = day + ", " + " " + date +" " + month + " " + year;
	}else{
		total = day;
	}
	return total;
}
//function to create the svg for wind animation
function makeWind(classNum) {
	var svg = document.createElementNS("http://www.w3.org/2000/svg",'svg');
	var path = document.createElementNS("http://www.w3.org/2000/svg",'path');
	svg.classList.add('breeze');
	svg.classList.add(classNum);
	svg.setAttribute('viewBox','0 0 100 100');
	path.setAttribute('d','M0,50 C0,50 20,20 40,15 C60,10 76,15 80,30 C80,40 60,45 55,35 C55,25 65,23 75,20 C85,20 95,25 100,28');
	svg.appendChild(path);
	return svg;
}
//create lightning bolt
function makeLightning(classNum){
	var svg = document.createElementNS("http://www.w3.org/2000/svg",'svg');
	var poly = [ document.createElementNS("http://www.w3.org/2000/svg",'polygon'),
				 document.createElementNS("http://www.w3.org/2000/svg",'polygon'), 
				 document.createElementNS("http://www.w3.org/2000/svg",'polygon') ];
	svg.classList.add("lightning");
	svg.classList.add(classNum);
	svg.setAttribute('viewBox', '0 0 100 100');
	poly[0].setAttribute('points',"60,10 80, 10 40,60 30,60");
	poly[1].setAttribute('points',"45,60 35,60 15,100 20,100");
	poly[2].setAttribute('points',"28,100 17,100 0,140");
	for (var i = 0; i < poly.length; i++) {
		svg.appendChild(poly[i]);
	}
	return svg;
}
var theButton = document.getElementById("toggleBox");
theButton.addEventListener("click", animate);

function animate() {
	var topBar = document.getElementById("top");
	var middleBar = document.getElementById("middle");
	var bottomBar = document.getElementById("bottom");
	
	if (topBar.className == "bar noAnimation") {
		topBar.className = "bar topMoveForward";
		middleBar.className = "bar middleMoveForward";
		bottomBar.className = "bar bottomMoveForward";
	} else {
		topBar.className = "bar topMoveBack";
		middleBar.className = "bar middleMoveBack";
		bottomBar.className = "bar bottomMoveBack";
		setTimeout(function() {
			topBar.className = "bar noAnimation";
			middleBar.className = "bar noAnimation";
			bottomBar.className = "bar noAnimation";
		},1500);
	}
}
//eventListener to flip the card
var card = document.getElementById("card");
card.addEventListener('click', flip);
function flip() {
	if (card.className == "card noAnimation") {
		card.className = "card cardFlip";
	} else {
		card.className = "card reverseFlip";
		setTimeout(function () {
			card.className = "card noAnimation";
		},1500);
	}
}