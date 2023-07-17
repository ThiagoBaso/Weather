
const apikey = "969df3010aa28c1ea007d41a559a6107";
const apiBgKey = "DbQ6dk2JtpFh85A9XNf6Uihx_tPySSzg9vjY2yhwldw";

const cityInput = document.querySelector('#cityInput');
const searchBtn = document.querySelector('#search');

const iconElement = document.querySelector('#iconWeather');
const tempElement = document.querySelector('#temp');
const descElement = document.querySelector('#desc');
const cityElement = document.querySelector('#city');
const flagElement = document.querySelector('#flag');
const windElement = document.querySelector('#wind');
const humiElement = document.querySelector('#humidity');


if (navigator.geolocation){
    navigator.geolocation.getCurrentPosition(function(position){
        const lat = position.coords.latitude;
        const lon = position.coords.longitude;
        
        getNameCity(lat,lon);
    })
}


//Functions
const getLocalData = async(lat,lon) => {
    const local =  await fetch(`https://us1.locationiq.com/v1/reverse.php?key=pk.cf9678f69d015cd1b5a1375fdad19cb6&lat=${lat}&lon=${lon}&format=json`);
    const dataLocal = await local.json();
    return dataLocal.address;
}

const getNameCity = async(lat,lon) => {
    const data = await getLocalData(lat,lon);

    showWeatherData(data.city_district);
}

const getBg = async(city) => {
    const apiBgURL = `https://api.unsplash.com/search/photos?page=1&query=${city}&client_id=${apiBgKey}`

    const resBg = await fetch(apiBgURL);
    const dataBg = await resBg.json();
    const bg = dataBg.results[0].urls.regular;

    document.documentElement.style.setProperty("--bg", `url(${bg})`);
}

const getWeatherData = async(city) => {
    const apiWeatherURL = `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=${apikey}&lang=pt_br`;

    const res = await fetch(apiWeatherURL);
    const data = await res.json();

    return data;
}

const showWeatherData = async (city) => {
    const data = await getWeatherData(city);
    const dataLocal = await getLocalData(data.coord.lat, data.coord.lon);
    
    console.log(dataLocal);
    console.log(data);
    iconElement.setAttribute("src", `http://openweathermap.org/img/wn/${data.weather[0].icon}@4x.png`)
    cityElement.innerText = data.name + ", " + data.sys.country;
    tempElement.innerText = parseInt(data.main.temp) + "℃";
    descElement.innerText = data.weather[0].description;
    flagElement.setAttribute("src", `https://flagsapi.com/${data.sys.country}/flat/32.png`)
    windElement.innerText = data.wind.speed + " m/s";
    humiElement.innerText = data.main.humidity + "%";

    
    
    getBg(dataLocal.country);
}   


//Events
searchBtn.addEventListener("click", (e) => {
    e.preventDefault();

    const city = cityInput.value;

    showWeatherData(city);
})

cityInput.addEventListener("keyup", (e) => {
    if (e.code === "Enter") {
        const city = e.target.value;

        showWeatherData(city);
    }
})