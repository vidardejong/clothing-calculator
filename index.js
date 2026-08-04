const gridContainer = document.querySelector(".gridContainer");

const inputCard = document.querySelector(".inputCard");
const clothesCard = document.querySelector(".clothesCard");
const descCard = document.querySelector(".descCard");

const walkBtn = document.getElementById("walkBtn");
const jogBtn = document.getElementById("jogBtn");
const runBtn = document.getElementById("runBtn");

const sliderValueDisplay = document.getElementById("sliderValueDisplay");
const locationSelection = document.querySelector(".locationSelection");
const cityInput = document.querySelector(".cityInput");
const errorDisplay = document.querySelector(".errorDisplay");

const clothesContainer = document.querySelector(".clothesContainer");

const apiKey = "06167aac9d119ffa7c6c3c0181130655";

function setActivity(level) {
    [walkBtn, jogBtn, runBtn].forEach(btn => btn.classList.remove("active"));

    if (level === "low") walkBtn.classList.add("active");
    if (level === "medium") jogBtn.classList.add("active");
    if (level === "high") runBtn.classList.add("active");
}

function updateSlider(slider) {
    const textValues = ["Very easily cold", "Easily cold", "Average", "Easily warm", "Very easily warm"];
    sliderValueDisplay.textContent = textValues[slider.value - 1];
}

async function getWeatherData(city) {
    const apiUrl = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}`;

    try{
        const response = await fetch(apiUrl);
        if(!response.ok){
            throw new Error(`error: ${response.status}`);
        }
        const weatherData = await response.json();
        return weatherData;
    }
    catch(error){
        displayError(error)
        return null;
    }
}

function displayWeatherInfo(city, temp, humidity, speed, description, id) {

    const cityDisplay = document.createElement("p");
    const tempDisplay = document.createElement("p");
    const windDisplay = document.createElement("p");
    const humidityDisplay = document.createElement("p");
    const weatherDescDisplay = document.createElement("p");
    const weatherEmoji = document.createElement("p");

    cityDisplay.textContent = city;
    tempDisplay.textContent = `${(temp).toFixed(1)}°C`;
    windDisplay.textContent = `${(speed).toFixed(1)} m/s`;
    humidityDisplay.textContent = `Humidity: ${humidity}%`;
    weatherDescDisplay.textContent = description;
    weatherEmoji.textContent = getWeatherEmoji(id);

    cityDisplay.classList.add("cityDisplay");
    tempDisplay.classList.add("tempDisplay");
    windDisplay.classList.add("windDisplay");
    humidityDisplay.classList.add("humidityDisplay");
    weatherDescDisplay.classList.add("weatherDescDisplay");
    weatherEmoji.classList.add("weatherEmoji");


    descCard.appendChild(cityDisplay);
    descCard.appendChild(tempDisplay);
    descCard.appendChild(windDisplay);
    descCard.appendChild(humidityDisplay);
    descCard.appendChild(weatherDescDisplay);
    descCard.appendChild(weatherEmoji);
}

function getWeatherEmoji(weatherId) {
    switch(true){
        case (weatherId >= 200 && weatherId < 300):
            return "⛈️";
        case (weatherId >= 300 && weatherId < 400):
            return "🌧️";
        case (weatherId >= 500 && weatherId < 600):
            return "🌧️";
        case (weatherId >= 600 && weatherId < 700):
            return "🌨️";
        case (weatherId >= 600 && weatherId < 700):
            return "🌨️";
        case (weatherId >= 700 && weatherId < 800):
            return "🌫️";
        case (weatherId === 800):
            return "☀️";
        case (weatherId >= 801 && weatherId < 810):
            return "☁️";
        default: return "❓";
    }
}

function displayError(message) {
    errorDisplay.textContent = message;
}

function getMetabolicRate() {
    const buttons = [walkBtn, jogBtn, runBtn];

    const activeBtn = buttons.find(btn => btn.classList.contains("active"));

    if (!activeBtn) {
        displayError("Please select activity level");
        return null;
    }

    switch (activeBtn) {
        case walkBtn: 
            return 1;
        case jogBtn: 
            return 0.6;
        case runBtn: 
            return 0.3;
        default:
            return null;
    } 
}

function getTempSensitivity(tempSensitivityString) {
    switch(tempSensitivityString){
        case "Very easily cold": 
            return 0.3;
        case "Easily cold": 
            return 0.15;
        case "Average": 
            return 0;
        case "Easily warm": 
            return -0.15;
        case "Very easily warm": 
            return -0.3;
        default: 
            return null;
    }
}

function generateOutfit(feelsLike, clo, weatherId, cloudCover, isDay) {
    let tops = [];
    let bottom = "";
    let accessories = [];

    
    if (clo < 0.3) {
        tops.push("t-shirt");
        bottom = "shorts";
    } else if (clo < 0.6) {
        tops.push("longsleeve");
        bottom = "light_pants";
    } else if (clo < 0.9) {
        tops.push("t-shirt", "hoodie");
        bottom = "pants";
    } else if (clo < 1.3) {
        tops.push("base_layer", "autumn_jacket");
        bottom = "pants";
    } else {
        tops.push("base_layer", "fleece", "winter_jacket");
        bottom = "pants_with_thermals";
    }

    const isRaining = weatherId >= 200 && weatherId < 600;
    if (isRaining) {
        tops[tops.length - 1] = "rain_jacket"; 
        accessories.push("umbrella");
    }

    if (cloudCover < 30 && isDay) {
        accessories.push("sunglasses");
    }
    if (feelsLike < 8) accessories.push("beanie");
    if (feelsLike < 5) accessories.push("gloves");
    
    return { tops, bottom, accessories };
}

function addClothingImage(itemName) {
    const img = document.createElement("img");
    img.src = `img/${itemName}.png`;
    img.alt = itemName;
    img.classList.add("clothes-item");
    clothesCard.appendChild(img);
}

function displayClothes(tops, bottom, accessories) {

    clothesCard.innerHTML = "";

    tops.forEach(topItem => {
        addClothingImage(topItem);
    });

    if (bottom) {
        addClothingImage(bottom);
    }

    accessories.forEach(accessoryItem => {
        addClothingImage(accessoryItem);
    });

    const clothesArray = tops.push(bottom).concat(accessories);

    const clothesArray = [...tops, bottom, ...accessories];

    clothesArray.forEach(item => {
        const child = document.createElement("p");
        child.classList.add("clothes");
        child.textContent = item.replaceAll("_", " ");
        clothesContainer.appendChild(child);
    });

    

    descCard.appendChild(document.createElement("hr"));
}

async function getCityFromGeolocation(lat, lon) {
    const apiUrl = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${apiKey}`

    try{
        const response = await fetch(apiUrl);
        if(!response.ok){
            throw new Error(`error: ${response.status}`);
        }
        const weatherData = await response.json();
        const { name: city } = weatherData;
        return city;
    }
    catch(error){
        displayError(error)
        return null;
    }
}

async function success(pos) {
    const lat = pos.coords.latitude;
    const lon = pos.coords.longitude;

    const city = await getCityFromGeolocation(lat, lon);

    if (city) {
        cityInput.value = city;
    }
}

function error() {
    if (error.code === 1) {
        displayError("Please allow access to geolocation");
    }
    else {
        displayError("Position unavailabe");
    }
}

const options = {
    enableHighAccuracy: true,
    timeout: 5000,
    maximumAge: 0
};

function getGeolocation() {
    if(!navigator.geolocation) {
        displayError("No geolocation available");
    }

    navigator.geolocation.getCurrentPosition(success, error, options);
}

async function calculateClothing() {
    errorDisplay.textContent = "";

    let metabolicRate = getMetabolicRate();
    if(!metabolicRate) return;

    let tempSensitivity = getTempSensitivity(sliderValueDisplay.textContent);
    const now = new Date();
    const isDay = now.getHours() >= 6 && now.getHours() <= 18;

    if (!cityInput.value){
        displayError("Please enter a city");
        return;
    }
    
    try{
        const weatherData = await getWeatherData(cityInput.value);
        const { name: city,
                main: {temp, feels_like, humidity},
                wind: {speed},
                clouds: {all},
                weather: [{description, id}]} = weatherData;

        const tempCelsius = temp - 273.15;
        const feels_likeCelsius = feels_like - 273.15;

        let clo = Math.max(0, ((33 - feels_like) / 15) * metabolicRate + tempSensitivity);
        const {tops, bottom, accessories} = generateOutfit(feels_likeCelsius, clo, id, all, isDay);

        inputCard.style.gridColumn = "1 / span 4";
        clothesCard.style.display = "flex";
        descCard.style.display = "flex";

        displayClothes(tops, bottom, accessories);
        displayWeatherInfo(city, tempCelsius, humidity, speed, description, id);
    }
    catch(error){
        console.error(error);
        displayError(error);
    }
    
}