const fs = require('fs');
const path = require('path');

// when the page is reload it will call the loadfileDetails function
document.addEventListener('DOMContentLoaded', () => {
    loadFileDetails();
});

// this will display the selected weather details
function loadFileDetails() {
    // get the file name from local storage which store the file name of selected weather
    const fileName = localStorage.getItem('File');

    // create the full path of the file naem
    const filePath = path.join(__dirname, 'Files', fileName);
    
    // read the file
    fs.readFile(filePath, 'utf8', (err, data) => {
        // show error if cant read the file
        if (err) {
            console.error('Error reading file:', err);
            return;
        }

        try {
            // the the whole data in the file
            const fileData = JSON.parse(data);
            // take only weather related data
            const weatherData = fileData.weatherData;
            // take only itenerary related data
            const itinerary = fileData.itinerary;

            //take the activity info from the local storage
            const activity = localStorage.getItem('Activity');
            //check if gave the new activity to add to the itenary
            if (activity) {
                //add the activity to the itenary at the 
                fileData.itinerary.push(JSON.parse(activity));
                //clear the stored activity
                localStorage.removeItem('Activity');
                //save the updated activity at txt file
                fs.writeFileSync(filePath, JSON.stringify(fileData, null, 2));
            }
            // show the weather details
            document.querySelector('main').innerHTML = `
                <div class="details-container">
                    <div class="weather-section">
                        <h2>Weather Details</h2>
                        <div class="weather-card">
                            <div class="weather-header">
                                <img src="https:${weatherData.current.condition.icon}" alt="${weatherData.current.condition.text}">
                                <div class="weather-main">
                                    <h3>${weatherData.location.name}, ${weatherData.location.country}</h3>
                                    <p class="temperature">${weatherData.current.temp_c}°C</p>
                                    <p class="condition">${weatherData.current.condition.text}</p>
                                </div>
                            </div>
                            <div class="weather-details">
                                <p>Humidity: ${weatherData.current.humidity}%</p>
                                <p>Wind: ${weatherData.current.wind_kph} km/h</p>
                                <p>Feels like: ${weatherData.current.feelslike_c}°C</p>
                            </div>
                            <div class="clothing-recommendations">
                                <h3>Clothing Recommendations</h3>
                                ${Cloth(fileData)}
                            </div>
                        </div>
                    </div>

                    <div class="itinerary-section">
                        <div class="itinerary-header">
                            <h2>Itinerary Details</h2>
                            <button class="add-itinerary-btn">Add New Activity</button>
                        </div>
                        <div class="itineraries-list">
                            ${itinerary.map((item, index) => `
                                <div class="itinerary-item" data-index="${index}">
                                    <div class="itinerary-time">
                                        <input type="time" value="${item.time}" class="time-input">
                                    </div>
                                    <div class="itinerary-content">
                                        <input type="text" value="${item.title}" class="title-input" placeholder="Activity Title">
                                        <input type="text" value="${item.location}" class="location-input" placeholder="Location">
                                        <input type="text" value="${item.duration}" class="duration-input" placeholder="Duration">
                                        <textarea class="description-input" placeholder="Description">${item.description || ''}</textarea>
                                    </div>
                                    <div class="itinerary-actions">
                                        <button class="delete-btn" onclick="deleteItinerary(${index})">
                                            <i class="fas fa-trash"></i>
                                        </button>
                                    </div>
                                </div>
                            `).join('')}
                        </div>
                        <div class="save-section">
                            <button class="save-changes-btn" data-bs-toggle="modal" data-bs-target="update">Save Changes</button>
                        </div>
                    </div>
                </div>
            `;

            // Add event listeners
            add_save_itenary(filePath, fileData);

        } catch (e) {
            console.error('Error parsing file:', e);
        }
    });
}

// display all the recommend clothing
function Cloth(fileData) {
    const recommendations = fileData.clothingRecommendations;
    
    return `
        <div class="cloth-card">
            <img src="icon/shirt.svg" alt="Shirt" width="30">
            <p>: ${recommendations.shirt}</p>
        </div>
        <div class="cloth-card">
            <img src="icon/pant.svg" alt="Pants" width="30">
            <p>: ${recommendations.pants}</p>
        </div>
        <div class="cloth-card">
            <img src="icon/sunglass.svg" alt="Sunglasses" width="30">
            <p>: ${recommendations.sunglasses}</p>
        </div>
    `;
}

// function to respond when user click add itenary or save the changes
function add_save_itenary(filePath, fileData) {
    const addBtn = document.querySelector('.add-itinerary-btn');
    const saveBtn = document.querySelector('.save-changes-btn');

    // when user click add it will add the field for itenary details
    addBtn.addEventListener('click', () => {
        const newItinerary = {
            time: '',
            title: '',
            location: '',
            duration: '',
            description: ''
        };

        const itinerariesList = document.querySelector('.itineraries-list');
        const newIndex = itinerariesList.children.length;
        
        const newItem = document.createElement('div');
        newItem.className = 'itinerary-item';
        newItem.dataset.index = newIndex;
        newItem.innerHTML = createItenerary(newItinerary, newIndex);
        itinerariesList.appendChild(newItem);

    });

    // function that save the change of the itenary details
    saveBtn.addEventListener('click', () => {
        const updatedItineraries = [];
        const itineraryItems = document.querySelectorAll('.itinerary-item');
        
        itineraryItems.forEach(item => {
            updatedItineraries.push({
                time: item.querySelector('.time-input').value,
                title: item.querySelector('.title-input').value,
                location: item.querySelector('.location-input').value,
                duration: item.querySelector('.duration-input').value,
                description: item.querySelector('.description-input').value
            });
        });

        // update the itenary at the retrieve txt file in js
        fileData.itinerary = updatedItineraries;
        
        // re write the txt file 
        fs.writeFile(filePath, JSON.stringify(fileData, null, 2), err => {
            if (err) {
                console.error('Error saving changes:', err);
                alert('Error saving changes');
                return;
            }
            
            // Ssow the modal after successful save
            const modalElement = document.getElementById('update');
            const myModal = new bootstrap.Modal(modalElement);
            
            // remove the modal
            modalElement.addEventListener('hidden.bs.modal', function () {
                document.querySelector('.modal-backdrop').remove();
                document.body.classList.remove('modal-open');
                document.body.style.overflow = '';
                document.body.style.paddingRight = '';
            });
            
            myModal.show();
        });
    });


}


// remove the itenary
function deleteItinerary(index) {
    const itineraryItem = document.querySelector(`[data-index="${index}"]`);
    if (itineraryItem) {
        itineraryItem.remove();
    }
}

// create the itenary fields for user input
function createItenerary(item, index) {
    return `
        <div class="itinerary-time">
            <input type="time" value="${item.time}" class="time-input">
        </div>
        <div class="itinerary-content">
            <input type="text" value="${item.title}" class="title-input" placeholder="Activity Title">
            <input type="text" value="${item.location}" class="location-input" placeholder="Location">
            <input type="text" value="${item.duration}" class="duration-input" placeholder="Duration">
            <textarea class="description-input" placeholder="Description">${item.description || ''}</textarea>
        </div>
        <div class="itinerary-actions">
            <button class="delete-btn" onclick="deleteItinerary(${index})">
                <i class="fas fa-trash"></i>
            </button>
        </div>
    `;
}
