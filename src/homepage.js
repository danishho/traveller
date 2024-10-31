 //picture rollover
 const picture = document.getElementById("picture");

 if (picture) {
   // Event listener for mouse enter (hover in)
   picture.addEventListener("mouseenter", () => {
     picture.setAttribute('picture', picture.style.backgroundImage);
     picture.style.backgroundImage = 'url("images/p1.jpg")'; // Ensure this matches your alternate image file name
   });

   // Event listener for mouse leave (hover out)
   picture.addEventListener("mouseleave", () => {
     picture.style.backgroundImage = picture.getAttribute('picture'); // Restore original image
     picture.removeAttribute('picture'); // Remove the attribute
   });
 }

// get the button action when user click the button and call the search button
document.getElementById('weather').addEventListener('submit', Search);

// fetch weather data
function Search(event){
    event.preventDefault()
    const location = document.getElementById('location').value;
    const date = document.getElementById('date').value;
    // fetch the data based on location and date
    fetch(`https://api.weatherapi.com/v1/forecast.json?key=e062e8f0bc134706acf85520242710&q=${location}&dt=${date}`)
    .then((response) => response.json())
    .then((data)=>{
        console.log(data);
        // store the data in the local storage
        localStorage.setItem('weatherData', JSON.stringify(data));
        // go to the details.html
        window.location.href = 'details.html'; 
    })



}
 
