const WeatherTab = document.querySelector(".your-Weather");
const SearchTab = document.querySelector(".search-Weather");
const grantAcces = document.querySelector(".grantAcces");
const SearchCity = document.querySelector(".SearchCity");
const loader = document.querySelector(".loader");
const weatherInfo = document.querySelector(".weatherInfo");
const error = document.querySelector(".error")

const API_KEY = "d1845658f92b31c64bd94f06f7188c9c";
let currTab = WeatherTab;
currTab.classList.add("Curr-Tab");
getfromSessionStorage();

function SwitchTab(clickedTab){
  if(clickedTab != currTab){
      currTab.classList.remove("Curr-Tab");
      currTab = clickedTab;
      currTab.classList.add("Curr-Tab");

      if(!SearchCity.classList.contains("active")){
         grantAcces.classList.remove("active");
         weatherInfo.classList.remove("active");
         SearchCity.classList.add("active");
         error.classList.remove("active");
        }
      else{
         weatherInfo.classList.remove("active");
         SearchCity.classList.remove("active");
         error.classList.remove("active");
         getfromSessionStorage();
        }
    }
}

WeatherTab.addEventListener("click", () => {
    SwitchTab(WeatherTab);
});

SearchTab.addEventListener("click", () => {
    SwitchTab(SearchTab);
});

function getfromSessionStorage(){
    const localCoordinates = sessionStorage.getItem("User-Coordinates");
    
    if(!localCoordinates){
        grantAcces.classList.add("active");
    }
    else{
        const Coordinates = JSON.parse(localCoordinates);
        fetchWeatherInfo(Coordinates);
    }
}

async function fetchWeatherInfo(Coordinates){
    const {lat, lon} = Coordinates;
    grantAcces.classList.remove("active");
    loader.classList.add("active");


    try {
        const response = await fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric`);
        if (!response.ok) {
            throw new Error('Failed to fetch weather data');
        }
        const  data = await response.json();

        loader.classList.remove("active");
        weatherInfo.classList.add("active");
        render(data);
    }
    catch(err){
        loader.classList.remove("active");
        error.classList.add("active");
    }

}

function render(weatherInfo){

    const cityName = document.querySelector(".cityName");
    const cityFlag = document.querySelector(".cityFlag");
    const Desc = document.querySelector(".weather-Desc");
    const DescIcon= document.querySelector(".weather-Desc-icon");
    const temp = document.querySelector(".temp");
    const windSpeed = document.querySelector(".wind-speed");
    const humidity = document.querySelector(".humidity");
    const clouds = document.querySelector(".clouds");

    cityName.innerText = weatherInfo?.name;
    cityFlag.src = `https://flagcdn.com/144x108/${weatherInfo?.sys?.country.toLowerCase()}.png`;
    Desc.innerText = weatherInfo?.weather?.[0]?.description;
    DescIcon.src = `http://openweathermap.org/img/w/${weatherInfo?.weather?.[0]?.icon}.png`;
    temp.innerText = `${weatherInfo?.main?.temp} °C`;
    windSpeed.innerText = `${weatherInfo?.wind?.speed} m/s`;
    humidity.innerText = `${weatherInfo?.main?.humidity}%`;
    clouds.innerText = `${weatherInfo?.clouds?.all}%`;
}

function getLocation (){
    if(navigator.geolocation){
        navigator.geolocation.getCurrentPosition(showPosition);
    }
    else{
        error.classList.add("active");
    }
}

function showPosition(position){
    const UserCoordinates = {
        lat : position.coords.latitude ,
        lon : position.coords.longitude,
    }

    sessionStorage.setItem("User-Coordinates" , JSON.stringify(UserCoordinates));
    fetchWeatherInfo(UserCoordinates);
}


const grantBtn = document.querySelector(".Access-Btn");
grantBtn.addEventListener("click", getLocation);

const searchInput = document.querySelector("[searchData]");

SearchCity.addEventListener("submit" , (e)=>{
    e.preventDefault();
    let cityName = searchInput.value;

    if(cityName === "") return;
    else fetchCityWeatherInfo(cityName);
})

async function fetchCityWeatherInfo(city){
    error.classList.remove("active");
    loader.classList.add("active");
    weatherInfo.classList.remove("active");
    grantAcces.classList.remove("active");

    try{
        const response = await fetch( `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}&units=metric` );
        if (!response.ok) {
            throw new Error('Failed to fetch weather data');
        }
        const data = await response.json();
        loader.classList.remove("active");
        weatherInfo.classList.add("active");
        render(data);

    }
    catch(err){
        loader.classList.remove("active");
        error.classList.add("active");
    }
}

