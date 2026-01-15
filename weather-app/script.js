const container = document.querySelector('.weather-container');
const search = document.querySelector('.search-box button');
const weatherBox = document.querySelector('.weather-box');
const weatherDetails = document.querySelector('.weather-details');
const error404 = document.querySelector('.not-found');
const cityInput = document.querySelector('#city-input');

search.addEventListener('click', () => {
    const city = document.querySelector('.search-box input').value;

    if (city === '')
        return;

    fetchWeather(city);
});

cityInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        const city = cityInput.value;
        if (city === '') return;
        fetchWeather(city);
    }
});

function fetchWeather(city) {
    // 1. Geocoding
    fetch(`https://geocoding-api.open-meteo.com/v1/search?name=${city}&count=1&language=pt&format=json`)
        .then(response => response.json())
        .then(geoData => {
            if (!geoData.results) {
                container.style.height = '400px';
                weatherBox.style.display = 'none';
                weatherDetails.style.display = 'none';
                error404.style.display = 'block';
                error404.classList.add('fadeIn');
                container.classList.add('error');
                container.classList.remove('active');
                return;
            }

            const { latitude, longitude, name, country } = geoData.results[0];

            // 2. Weather Data
            fetch(`https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current=temperature_2m,relative_humidity_2m,weather_code,wind_speed_10m&timezone=auto`)
                .then(response => response.json())
                .then(weatherData => {
                    if (weatherData.error) {
                        alert("Erro ao buscar dados do tempo.");
                        return;
                    }

                    const current = weatherData.current;
                    const temp = current.temperature_2m;
                    const humidity = current.relative_humidity_2m;
                    const wind = current.wind_speed_10m;
                    const code = current.weather_code;

                    error404.style.display = 'none';
                    error404.classList.remove('fadeIn');
                    container.classList.remove('error');

                    const image = document.querySelector('.weather-box img');
                    const temperature = document.querySelector('.weather-box .temperature');
                    const description = document.querySelector('.weather-box .description');
                    const humiditySpan = document.querySelector('.weather-details .humidity span');
                    const windSpan = document.querySelector('.weather-details .wind span');

                    // Map WMO codes to images/descriptions
                    // Simple mapping
                    let weatherDesc = '';
                    let imgSrc = '';

                    // Images from flaticon or similar (using generic cloud/sun URLs for demo)
                    // Clear
                    if (code === 0) {
                        imgSrc = 'https://cdn-icons-png.flaticon.com/512/6974/6974833.png';
                        weatherDesc = 'Céu Limpo';
                    }
                    // Cloudy
                    else if (code >= 1 && code <= 3) {
                        imgSrc = 'https://cdn-icons-png.flaticon.com/512/1163/1163624.png';
                        weatherDesc = 'Parcialmente Nublado';
                    }
                    // Fog
                    else if (code === 45 || code === 48) {
                        imgSrc = 'https://cdn-icons-png.flaticon.com/512/2930/2930095.png';
                        weatherDesc = 'Neblina';
                    }
                    // Rain / Drizzle
                    else if ((code >= 51 && code <= 67) || (code >= 80 && code <= 82)) {
                        imgSrc = 'https://cdn-icons-png.flaticon.com/512/3351/3351979.png';
                        weatherDesc = 'Chuva';
                    }
                    // Snow
                    else if (code >= 71 && code <= 77) {
                        imgSrc = 'https://cdn-icons-png.flaticon.com/512/642/642102.png';
                        weatherDesc = 'Neve';
                    }
                    // Thunderstorm
                    else if (code >= 95 && code <= 99) {
                        imgSrc = 'https://cdn-icons-png.flaticon.com/512/1146/1146860.png';
                        weatherDesc = 'Tempestade';
                    }
                    else {
                        imgSrc = 'https://cdn-icons-png.flaticon.com/512/1163/1163657.png';
                        weatherDesc = 'Nublado';
                    }

                    image.src = imgSrc;
                    temperature.innerHTML = `${Math.round(temp)}<span>°C</span>`;
                    description.innerHTML = `${weatherDesc}`;
                    humiditySpan.innerHTML = `${humidity}%`;
                    windSpan.innerHTML = `${wind} km/h`;

                    weatherBox.style.display = '';
                    weatherDetails.style.display = 'flex';
                    weatherBox.classList.add('fadeIn');
                    weatherDetails.classList.add('fadeIn');
                    container.classList.add('active');

                    // console.log(`Weather in ${name}, ${country}: ${temp}C, ${weatherDesc}`);
                });
        })
        .catch(err => {
            console.error(err);
        });
}
