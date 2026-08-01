const gridContainer = document.querySelector(".gridContainer");

const inputCard = document.querySelector(".inputCard");
const clothingCard = document.querySelector(".clothingCard");
const descCard = document.querySelector(".descCard");

const walkBtn = document.getElementById("walkBtn");
const jogBtn = document.getElementById("jogBtn");
const runBtn = document.getElementById("runBtn");

const sliderValueDisplay = document.getElementById("sliderValueDisplay");
const locationSelection = document.querySelector(".locationSelection");
const cityInput = document.querySelector(".cityInput");
const errorDisplay = document.querySelector(".errorDisplay");
const weatherDisplay = document.querySelector(".weatherDisplay");
const descDisplay = document.querySelector(".descDisplay");

function setActivity(level){
    [walkBtn, jogBtn, runBtn].forEach(btn => btn.classList.remove("active"));

    if (level === "low") walkBtn.classList.add("active");
    if (level === "medium") jogBtn.classList.add("active");
    if (level === "high") runBtn.classList.add("active");
}

function updateSlider(slider){
    const textValues = ["Very easily cold", "Easily cold", "Average", "Easily warm", "Very easily warm"];
    sliderValueDisplay.textContent = textValues[slider.value - 1];
}

async function getWeatherData(city){
    const apiKey = "06167aac9d119ffa7c6c3c0181130655";
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

function displayWeatherInfo(city, temp, humidity, speed, description, id){
    weatherDisplay.textContent = "";
    weatherDisplay.style.display = "flex";

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


    weatherDisplay.appendChild(cityDisplay);
    weatherDisplay.appendChild(tempDisplay);
    weatherDisplay.appendChild(windDisplay);
    weatherDisplay.appendChild(humidityDisplay);
    weatherDisplay.appendChild(weatherDescDisplay);
    weatherDisplay.appendChild(weatherEmoji);
}

function getWeatherEmoji(weatherId){
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

function displayError(message){
    errorDisplay.textContent = message;
}

function getMetabolicRate(){
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

function getTempSensitivity(tempSensitivityString){
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

function displayClothes(tops, bottom, accessories){

    tops = tops.map(top => top.replaceAll("_", " "));
    bottom = bottom.replaceAll("_", " ");
    accessories = accessories.map(accessory => accessory.replaceAll("_", " "));

    const recommendedClothes = document.createElement("p");
    recommendedClothes.textContent = `Recommended clothes: ${tops}, ${bottom}, ${accessories}`;
    recommendedClothes.classList.add("recommendedClothes");
    descDisplay.appendChild(recommendedClothes);

}

async function calculateClothing(){
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
        clothingCard.style.display = "grid";
        descCard.style.display = "block";

        displayClothes(tops, bottom, accessories);
        displayWeatherInfo(city, tempCelsius, humidity, speed, description, id);
    }
    catch(error){
        console.error(error);
        displayError(error);
    }
    
}