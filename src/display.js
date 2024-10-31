document.addEventListener("DOMContentLoaded", () => {
    // get the weather data from the  local storage from coding at homepage.js
    const weatherData = JSON.parse(localStorage.getItem("weatherData"));
    console.log(weatherData);

    //display the location information
    document.getElementById("location").textContent = `Location: ${weatherData.location.name}`;
    document.getElementById("region").textContent = `Region: ${weatherData.location.region}`;
    document.getElementById("country").textContent = `Country: ${weatherData.location.country}`;
    document.getElementById("local-time").textContent = `Local Time: ${weatherData.location.localtime}`

    // get the selected date from the forecast data
    const selectedDate = weatherData.forecast.forecastday[0].date;

    // get the current date in YYYY-MM-DD format
    const currentDate = new Date().toISOString().split("T")[0];
    console.log(selectedDate === currentDate);

    const futureForecast = weatherData.forecast.forecastday[0];
    const forecastDetails = futureForecast.day;
    const astroDetails = futureForecast.astro;

    // compare is the weather date equal or not with current date
    if (selectedDate === currentDate) {
        //display current weather details only if the date matches the current date
        document.getElementById("current-temp").textContent = `Current Temp: ${weatherData.current.temp_c} °C`;
        document.getElementById("forecast-temp").textContent = `Forecast Temp: ${forecastDetails.avgtemp_c} °C`;
        document.getElementById("feels-like").textContent = `Feels Like Temp: ${weatherData.current.feelslike_c} °C`;
        document.getElementById("humidity").textContent = `Humidity: ${weatherData.current.humidity}%`;
        document.getElementById("wind-speed").textContent = `Wind Speed: ${weatherData.current.wind_mph} mph`;
        document.getElementById("description").textContent = `Condition: ${weatherData.current.condition.text}`;

        //display current condition icon if available
        const conditionIcon = document.createElement("img");
        conditionIcon.src = `https:${weatherData.current.condition.icon}`;
        conditionIcon.alt = weatherData.current.condition.text;
        document.getElementById("condition-icon").appendChild(conditionIcon);
        document.getElementById("description").textContent = `Condition: ${forecastDetails.condition.text}`;

        // astronomical details
        document.getElementById("sunrise").textContent = `Sunrise: ${astroDetails.sunrise}`;
        document.getElementById("sunset").textContent = `Sunset: ${astroDetails.sunset}`;
        document.getElementById("moonrise").textContent = `Moonrise: ${astroDetails.moonrise}`;
        document.getElementById("moonset").textContent = `Moonset: ${astroDetails.moonset}`;

        Cloth(forecastDetails.condition.code)

    // compare if the weather date is more than current date
    } else if (selectedDate > currentDate) {

        //display future forecast details only if the selected date is in the future
        document.getElementById("forecast2-temp").textContent = `Avg Temp: ${forecastDetails.avgtemp_c} °C`;
        document.getElementById("max-temp").textContent = `Max Temp: ${forecastDetails.maxtemp_c} °C`;
        document.getElementById("min-temp").textContent = `Min Temp: ${forecastDetails.mintemp_c} °C`;
        document.getElementById("max-wind").textContent = `Max Wind: ${forecastDetails.maxwind_mph} mph`;
        document.getElementById("description").textContent = `Condition: ${forecastDetails.condition.text}`;

        // astronomical details
        document.getElementById("sunrise").textContent = `Sunrise: ${astroDetails.sunrise}`;
        document.getElementById("sunset").textContent = `Sunset: ${astroDetails.sunset}`;
        document.getElementById("moonrise").textContent = `Moonrise: ${astroDetails.moonrise}`;
        document.getElementById("moonset").textContent = `Moonset: ${astroDetails.moonset}`;

        //display condition icon for future forecast
        const futureIcon = document.createElement("img");
        futureIcon.src = `https:${forecastDetails.condition.icon}`;
        futureIcon.alt = forecastDetails.condition.text;
        document.getElementById("condition-icon").appendChild(futureIcon);

        Cloth(forecastDetails.condition.code)
    } else {
        console.log("No valid forecast data available for this date.");
    }

    
});

// store all the itenary that user upload
const itenary = [];

// function to get the value from the input and call display function
window.addItem = function () {
    const location = document.getElementById("activity-location").value.trim();
    const title = document.getElementById("activity-title").value.trim();
    const time = document.getElementById("activity-time").value;
    const duration = document.getElementById("activity-duration").value.trim();
    const description =  document.getElementById("activity-description").value.trim();

    if (location && title && time && duration && description) {
        const activity = { location, title, time, duration,description };
        itenary.push(activity);
        itenaryDisplay();

        // Clear inputs
        document.getElementById("activity-location").value = "";
        document.getElementById("activity-title").value = "";
        document.getElementById("activity-time").value = "";
        document.getElementById("activity-duration").value = "";
        document.getElementById("activity-description").value = "";
    }
};

// show the summary of the added itenary
function itenaryDisplay() {
    const listContainer = document.getElementById("itinerary-list");
    listContainer.innerHTML = "";

    itenary.forEach((item, index) => {
        const itemElement = document.createElement("div");
        itemElement.classList.add("itinerary-item");
        
        itemElement.innerHTML = `
            <div class="itinerary-time">
                ${item.time}
            </div>
            <div class="itinerary-content">
                <div class="activity-title">${item.title}</div>
                <div class="activity-details">
                    <span>${item.location}</span>
                    <span class="dot">•</span>
                    <span>${item.duration}</span>
                </div>
                <div class="activity-description">
                    ${item.description}
                </div>
            </div>
        `;
        
        listContainer.appendChild(itemElement);
    });
}


// show the recommend clothing
function Cloth(conditionCode) {
    let shirtRecommendation = "Light T-Shirt";
    let pantRecommendation = "Comfortable Pants";
    let sunglassesRecommendation = "No Sunglasses";

    // Adjust recommendations based on the condition code
    if ([1000, 1003].includes(conditionCode)) {
        shirtRecommendation = "Breathable Cotton Shirt";
        pantRecommendation = "Light Shorts";
        sunglassesRecommendation = "Sunglasses";
    } else if ([1006, 1009].includes(conditionCode)) {
        shirtRecommendation = "Long-Sleeve Shirt";
        pantRecommendation = "Chinos or Jeans";
    } else if ([1063, 1183, 1195, 1240].includes(conditionCode)) {
        shirtRecommendation = "Quick-Dry Shirt";
        pantRecommendation = "Waterproof Pants";
    } else if ([1066, 1114, 1210, 1225].includes(conditionCode)) {
        shirtRecommendation = "Thermal Jacket";
        pantRecommendation = "Insulated Pants";
        sunglassesRecommendation = "Sunglasses (for snow glare)";
    }

    // Update the HTML with the recommendations
    document.getElementById('shirt').innerHTML += shirtRecommendation;
    document.getElementById('pant').innerHTML += pantRecommendation;
    document.getElementById('sunglasses').innerHTML += sunglassesRecommendation;
}



const { app, BrowserWindow } = require('electron'); 
const fs = require('fs');
const path = require('path');

var btnCreate = document.getElementById('btnCreate')
var fileName = document.getElementById('fileName')


// function to save the file in txt
btnCreate.addEventListener('click', function(){
    // store all the content for the txt(weatherdata,cloth,itenary)
    const fileContents = JSON.stringify({
        weatherData: JSON.parse(localStorage.getItem("weatherData")),
        clothingRecommendations: {
            shirt: document.getElementById('shirt').textContent.replace(':', '').trim(),
            pants: document.getElementById('pant').textContent.replace(':', '').trim(),
            sunglasses: document.getElementById('sunglasses').textContent.replace(':', '').trim()
        },
        itinerary: itenary
    }, null, 2);

    
    const pathName = path.join(__dirname, 'Files');
    // Make sure the Files directory exists and if not it will create the file
    if (!fs.existsSync(pathName)){
        fs.mkdirSync(pathName);
    }

    // add the .txt at the end as file format
    let fullFileName = fileName.value;
    if (!fullFileName.endsWith('.txt')) {
        fullFileName += '.txt';
    }

    // Create full file path
    let file = path.join(pathName, fullFileName);
    
    // Write the file
    fs.writeFile(file, fileContents, (err) => {
        // show the error when cant save the file
        if(err){ 
            console.error(err);
            alert('Error saving file!');
            return;
        }
        
        // show the modal
        const myModal = new bootstrap.Modal(document.getElementById('save'));
        myModal.show();
        
        // when modal is hidden it go to the itenary.html
        document.getElementById('save').addEventListener('hidden.bs.modal', function () {
            window.location.href = 'itenary.html';
        });
    });
});