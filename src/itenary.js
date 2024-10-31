const fs = require('fs');
const path = require('path');

//  store the file name to delete it added by at html button have function on click that trigger setup delete function
let fileToDelete = '';

document.addEventListener('DOMContentLoaded', () => {
    displayFiles();
    
    // setup the confirm delete button
    const confirmDeleteBtn = document.getElementById('confirmDelete');
    // if button delete is clicked it will call the deleteFile function
    if (confirmDeleteBtn) {
        confirmDeleteBtn.addEventListener('click', deleteFile);
    }
});

// display all the files 
function displayFiles() {
    const filesContainer = document.querySelector('.file-itenary');
    const pathName = path.join(__dirname, 'Files');

    // read all files from the directory
    fs.readdir(pathName, (err, files) => {
        // show the error message when cant reading the directory
        if (err) {
            console.error('Error reading directory:', err);
            return;
        }

        // clear the container
        filesContainer.innerHTML = '';

        if (files.length === 0) {
            filesContainer.innerHTML = '<p class="no-files">No itinerary files found</p>';
            return;
        }

        // iterate each file and create elements
        files.forEach(file => {
            const filePath = path.join(pathName, file);
            
            // Read file content
            fs.readFile(filePath, 'utf8', (err, data) => {
                if (err) {
                    console.error('Error reading file:', err);
                    return;
                }

                try {
                    const fileData = JSON.parse(data);
                    const weatherData = fileData.weatherData;
                    const itinerary = fileData.itinerary;

                    const fileElement = document.createElement('div');
                    fileElement.classList.add('file-item');
                    
                    fileElement.innerHTML = `
                        <div class="file-content">
                            <div class="file-header">
                                <h3 class="file-name">${file}</h3>
                            </div>
                            <div class="file-info">
                                <div class="weather-icon">
                                    <img src="https:${weatherData.current.condition.icon}" alt="${weatherData.current.condition.text}">
                                </div>
                                <div class="file-details">
                                    <div class="weather-summary">
                                        <h4>Weather Details:</h4>
                                        <p>Location: ${weatherData.location.name}, ${weatherData.location.country}</p>
                                        <p>Temperature: ${weatherData.current.temp_c}°C</p>
                                        <p>Condition: ${weatherData.current.condition.text}</p>
                                    </div>
                                    <div class="itinerary-summary">
                                        <h4>Itineraries (${itinerary.length}):</h4>
                                        <div class="itinerary-list">
                                            ${itinerary.slice(0, 2).map(item => `
                                                <div class="itinerary-preview">
                                                    <span class="time">${item.time}</span>
                                                    <span class="title">${item.title}</span>
                                                    <span class="location">${item.location}</span>
                                                </div>
                                            `).join('')}
                                            ${itinerary.length > 2 ? `<p class="more-items">+${itinerary.length - 2} more items...</p>` : ''}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div class="file-actions">
                            <button class="view-btn" onclick="viewFile('${file}')">
                                View
                            </button>
                            <button class="delete-btn" data-bs-toggle="modal" data-bs-target="#deleteModal" onclick="setupDelete('${file}')">
                                Delete
                            </button>
                        </div>
                    `;
                    // append the html code into the html 
                    filesContainer.appendChild(fileElement);
                } catch (e) {
                    console.error('Error parsing file:', e);
                }
            });
        });
    });
}

// when user click the file it wil run this functiom
function viewFile(fileName) {
    // store the filename in localStorage to defined the which file details to show at itenarydetails
    localStorage.setItem('File', fileName);
    // redirect to itenaryDetails.html
    window.location.href = 'itenaryDetails.html';
}

// to put file name in the modal
window.setupDelete = function(fileName) {
    fileToDelete = fileName;
    const modalBody = document.querySelector('#deleteModal .modal-body p');
    modalBody.textContent = `Are you sure you want to delete "${fileName}"?`;
}

// 
window.deleteFile = function() {
    // create full path of the file location
    const filePath = path.join(__dirname, 'Files', fileToDelete);

    // delete the file
    fs.unlink(filePath, (err) => {
        if (err) {
            console.error('Error deleting file:', err);
            return;
        }
        
        // hide the modal when user click button
        const deleteModal = bootstrap.Modal.getInstance(document.getElementById('deleteModal'));
        deleteModal.hide();
        
        // clear the fileToDelete
        fileToDelete = '';
        
        // refresh the file list
        displayFiles();
    });
}
