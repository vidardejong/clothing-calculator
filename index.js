const gridContainer = document.querySelector(".gridContainer");

const inputCard = document.querySelector(".inputCard");
const clothesCard = document.querySelector(".clothesCard");
const descCard = document.querySelector(".descCard");

const restBtn = document.getElementById("restBtn");
const walkBtn = document.getElementById("walkBtn");
const runBtn = document.getElementById("runBtn");

const sliderValueDisplay = document.getElementById("sliderValueDisplay");
const locationSelection = document.querySelector(".locationSelection");
const cityInput = document.querySelector(".cityInput");
const errorDisplay = document.querySelector(".errorDisplay");

const clothesContainer = document.querySelector(".clothesContainer");
const weatherInfo = document.querySelector(".weatherInfo");

const apiKey = "06167aac9d119ffa7c6c3c0181130655";

function setActivity(level) {
    [restBtn, walkBtn, runBtn].forEach(btn => btn.classList.remove("active"));

    if (level === "low") restBtn.classList.add("active");
    if (level === "medium") walkBtn.classList.add("active");
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

    weatherInfo.innerHTML = "";

    const cityDisplay = document.createElement("p");
    const tempDisplay = document.createElement("p");
    const windDisplay = document.createElement("p");
    const humidityDisplay = document.createElement("p");
    const weatherDescDisplay = document.createElement("p");
    const weatherEmoji = document.createElement("p");

    cityDisplay.textContent = city;
    tempDisplay.textContent = `${(temp).toFixed(1)}°C`;
    windDisplay.textContent = `Wind: ${(speed).toFixed(1)} m/s`;
    humidityDisplay.textContent = `Humidity: ${humidity}%`;
    weatherDescDisplay.textContent = description;
    weatherEmoji.textContent = getWeatherEmoji(id);

    cityDisplay.classList.add("cityDisplay");
    tempDisplay.classList.add("tempDisplay");
    windDisplay.classList.add("windDisplay");
    humidityDisplay.classList.add("humidityDisplay");
    weatherDescDisplay.classList.add("weatherDescDisplay");
    weatherEmoji.classList.add("weatherEmoji");


    weatherInfo.appendChild(cityDisplay);
    weatherInfo.appendChild(tempDisplay);
    weatherInfo.appendChild(windDisplay);
    weatherInfo.appendChild(humidityDisplay);
    weatherInfo.appendChild(weatherDescDisplay);
    weatherInfo.appendChild(weatherEmoji);
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
    const buttons = [restBtn, walkBtn, runBtn];

    const activeBtn = buttons.find(btn => btn.classList.contains("active"));

    if (!activeBtn) {
        displayError("Please select activity level");
        return null;
    }

    switch (activeBtn) {
        case restBtn: 
            return 0.35;
        case walkBtn: 
            return 0;
        case runBtn: 
            return -0.8;
        default:
            return null;
    } 
}

function getTempSensitivity(tempSensitivityString) {
    switch(tempSensitivityString){
        case "Very easily cold": 
            return 0.5;
        case "Easily cold": 
            return 0.25;
        case "Average": 
            return 0;
        case "Easily warm": 
            return -0.25;
        case "Very easily warm": 
            return -0.5;
        default: 
            return null;
    }
}

function displayClothes(cloScore, isRaining) {
    
    clothesCard.innerHTML = "";
    clothesContainer.innerHTML = "";

    let clothes;

    if (!isRaining) {
        switch (cloScore) {
            case 0: {
                clothes = ["T-shirt", "Shorts", "Sneakers"];
                break;
            }
            case 1: {
                clothes = ["T-shirt", "Pants", "Sneakers"];
                break;
            }
            case 2: {
                clothes = ["Long Sleeve",  "Pants", "Sneakers"];
                break;
            }
            case 3: {
                clothes = ["T-shirt", "Hoodie", "Pants", "Sneakers"];
                break;
            }
            case 4: {
                clothes = ["T-shirt", "Hoodie", "Light Jacket", "Pants", "Sneakers"];
                break;
            }
            case 5: {
                clothes = ["T-shirt", "Hoodie", "Insulated Jacket" , "Pants", "Boots", "Beanie"];
                break;
            }
            case 6: {
                clothes = ["Thermal Base Layer", "Hoodie", "Winter Jacket", "Warm Pants", "Boots", "Beanie", "Gloves"];
                break;
            }
            case 7: {
                clothes = ["Thermal Base Layer", "Hoodie", "Heavy Parka", "Insulated Pants", "Winter Boots", "Beanie", "Gloves", "Scarf"];
                break;
            }
        }
    } 
    else {
        switch (cloScore) {
            case 0: {
                clothes = ["T-shirt", "Shorts", "Sneakers", "Umbrella"];
                break;
            }
            case 1: {
                clothes = ["T-shirt", "Pants", "Sneakers", "Umbrella"];
                break;
            }
            case 2: {
                clothes = ["Long Sleeve", "Rain Jacket", "Pants", "Sneakers"];
                break;
            }
            case 3: {
                clothes = ["T-shirt", "Hoodie", "Rain Jacket", "Pants", "Sneakers"];
                break;
            }
            case 4: {
                clothes = ["T-shirt", "Hoodie", "Rain Jacket", "Pants", "Waterproof Shoes"];
                break;
            }
            case 5: {
                clothes = ["T-shirt", "Hoodie", "Waterproof Insulated Jacket" , "Pants", "Boots", "Beanie"];
                break;
            }
            case 6: {
                clothes = ["Thermal Base Layer", "Hoodie", "Waterproof Winter Jacket", "Warm Pants", "Boots", "Beanie", "Gloves"];
                break;
            }
            case 7: {
                clothes = ["Thermal Base Layer", "Hoodie", "Waterproof Parka", "Insulated Pants", "Winter Boots", "Beanie", "Gloves", "Scarf"];
                break;
            }
        }
    }

    const img = document.createElement("img");
    img.src = (isRaining) ? `/img/${cloScore}rain.png` : `/img/${cloScore}.png`;
    img.alt = clothes.join(", ")
    clothesCard.appendChild(img);
    

    clothes.forEach(item => {
        const child = document.createElement("p");
        child.textContent = item;
        clothesContainer.appendChild(child);
    });
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

    const metabolicRate = getMetabolicRate();
    if(!metabolicRate) return;

    const tempSensitivity = getTempSensitivity(sliderValueDisplay.textContent);
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
                weather: {id, main, description}} = weatherData;

        const tempCelsius = temp - 273.15;
        const feels_likeCelsius = feels_like - 273.15;
        const isRaining = (main == "Thunderstorm" || main == "Drizzle" || main == "Rain") ? true : false;
        
        const bci = 1 + (20 - feels_likeCelsius) / 20; // base clothing insulation
        const cloValue = bci + metabolicRate + tempSensitivity;
        const cloScore = Math.round((cloValue - 0.75) / 0.35);

        inputCard.style.gridColumn = "1 / span 4";
        clothesCard.style.display = "flex";
        descCard.style.display = "flex";

        displayClothes(cloScore, isRaining);
        displayWeatherInfo(city, tempCelsius, humidity, speed, description, id);
    }
    catch(error){
        console.error(error);
        displayError(error);
    }

    
}