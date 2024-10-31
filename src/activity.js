const fs = require('fs');
const path = require('path');

document.addEventListener('DOMContentLoaded', function() {
    const weatherInfo = document.getElementById('weatherInfo');
    const activitiesList = document.getElementById('activitiesList');
    const pathName = path.join(__dirname, 'Files');

    // activities list for the weather conditions   
    const ActivitiesWeather = {
        sunny: [
            {
                name: "Outdoor Photography",
                description: "Capture beautiful moments and scenery in natural lighting.",
                url: "images/photography.jpg"

            },
            {
                name: "Local Market Visit",
                description: "Explore local culture through traditional markets and street food.",
                url: "images/market.jpg",

            },
            {
                name: "Nature Walking",
                description: "Explore local parks, trails, or scenic areas on foot.",
                url: "images/walking.jpg",

            },
            {
                name: "Beach Activities",
                description: "Swimming, sunbathing, or beach sports if near the coast.",
                url: "images/beach.jpg",


            }
        ],
        rainy: [
            {
                name: "Museum Visit",
                description: "Explore local history, art, or science museums.",
                url: "images/musuem.jpg"

            },
            {
                name: "Café Hopping",
                description: "Try local coffee shops and experience café culture.",
                url: "images/cafe.jpg"

            },
            {
                name: "Shopping",
                description: "Visit local shopping centers or boutiques.",
                url: "images/shopping.jpg"

            },
            {
                name: "Indoor Entertainment",
                description: "Movies, bowling, or arcade games.",
                url: "images/indoor.jpg"

            }
        ]
    };

    // function to retrieve all the itenary files to make user able to select the file
    function loadItineraryFiles() {
        try {
            // read all the files in the Files directory
            const files = fs.readdirSync(pathName);
            const fileOptions = files
                .filter(file => file.endsWith('.txt'))
                .map(file => {
                    // read the file content as JSON
                    const content = JSON.parse(fs.readFileSync(path.join(pathName, file), 'utf8'));
                    return {
                        // remove the .txt for better readibilty for user
                        name: file.replace('.txt', ''), 
                        location: content.weatherData.location.name || '',
                        filename: file,
                    };
                });
            
            // display all the file names under option at select field 
            const selectHTML = `
                <select id="fileSelect" class="file-select">
                    <option value="">Select an itinerary</option>
                    ${fileOptions.map(file => `
                        <option value="${file.location}" data-filename="${file.filename}">
                            ${file.name}
                        </option>
                    `).join('')}
                </select>
            `;
            
            // button for trigger the search activities based on the selected file
            const searchGroup = document.querySelector('.search-group');
            searchGroup.innerHTML = `
                ${selectHTML}
                <button id="searchButton" class="search-btn">
                    Find Activities
                </button>
            `;
            
            //call the activvities function is user click search
            document.getElementById('searchButton').addEventListener('click', Activities);
        } catch (error) {
            console.error('Error loading files:', error);
            const searchGroup = document.querySelector('.search-group');
            searchGroup.innerHTML = '<p class="error">Error loading itinerary files</p>';
        }
    }

    // display the summary of weather and the recommend activities
    async function Activities() {
        const fileSelect = document.getElementById('fileSelect');
        const selectedOption = fileSelect.options[fileSelect.selectedIndex];
        const selectedLocation = fileSelect.value;
        const selectedFilename = selectedOption.dataset.filename;
        
        // if user not seleact a fiel
        if (!selectedLocation) {
            alert('Please select an itinerary');
            return;
        }

        // display the summary of weather and the recommend activities
        try {
            const filePath = path.join(pathName, selectedFilename);
            const fileContent = JSON.parse(fs.readFileSync(filePath, 'utf8'));
            const weatherData = fileContent.weatherData;
            const itineraryData = fileContent.itinerary;

            weatherInfo.innerHTML = `
                <div class="weather-card">
                    <div class="weather-header">
                        <img src="https:${weatherData.current.condition.icon}" alt="Weather icon">
                        <h3>Weather in ${weatherData.location.name}</h3>
                    </div>
                    <div class="weather-details">
                        <div class="weather-item">
                            <img src="icon/termometer.svg" alt="Temperature">
                            <span>
                                <span class="value">${weatherData.current.temp_c}°C</span>
                                <span class="label">Temperature</span>
                            </span>
                        </div>
                        <div class="weather-item">
                            <img src="icon/weather.svg" alt="Condition">
                            <span>
                                <span class="value">${weatherData.current.condition.text}</span>
                                <span class="label">Condition</span>
                            </span>
                        </div>
                        <div class="weather-item">
                            <img src="icon/humidity.svg" alt="Humidity">
                            <span>
                                <span class="value">${weatherData.current.humidity}%</span>
                                <span class="label">Humidity</span>
                            </span>
                        </div>
                    </div>
                </div>
            `;

            // check the weather condition and display the activities based on the weather condition
            const isRainy = weatherData.current.condition.text.toLowerCase().includes('rain');
            const activities = isRainy ? ActivitiesWeather.rainy : ActivitiesWeather.sunny;

            activitiesList.innerHTML = `
                <h2>Recommended Activities for ${selectedFilename.replace('.txt', '')}</h2>
                <div class="activities-grid">
                    ${activities.map(activity => `
                        <div class="activity-card">
                            <div class="activity-image">
                                <img src="${activity.url}" alt="${activity.name}">
                            </div>
                            <div class="activity-content">
                                <h3>${activity.name}</h3>
                                <p>${activity.description}</p>
                                <div class="activity-overlay">
                                    <button class="add-to-itinerary" onclick="addItenarary('${activity.name}')">
                                        <i class="fas fa-plus"></i> Add to Itinerary
                                    </button>
                                </div>
                            </div>
                        </div>
                    `).join('')}
                </div>
            `;
        // show error when weatther data is not present and error fetching
        } catch (error) {
            console.error('Error:', error);
            weatherInfo.innerHTML = `
                <p class="error">
                    ${error.message === 'Weather data not available' 
                        ? 'Location not found. Please check the selected itinerary and try again.' 
                        : 'Error fetching weather data. Please try again.'}
                </p>`;
            activitiesList.innerHTML = '';
        }
    }


    // call this function first when page being open or reload
    loadItineraryFiles();
});

// function to add ritem into the itenary 
window.addItenarary = function(name) {
    // Get the current filename from the select element
    const fileSelect = document.getElementById('fileSelect');
    const selectedFilename = fileSelect.options[fileSelect.selectedIndex].dataset.filename;
    
    // Store the activity details in localStorage
    localStorage.setItem('Activity', JSON.stringify({
        title: name,
        description: '',
        time: '',
        location: '',
        duration: ''
    }));
    
    // Store the filename so when to redirect to itenarydetails it show information realted to the file
    localStorage.setItem('File', selectedFilename);
    
    // Redirect to itinerary details page
    window.location.href = 'itenaryDetails.html';
};