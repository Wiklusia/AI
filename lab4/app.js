document.addEventListener("DOMContentLoaded", () => {
    const weatherButton = document.getElementById("weatherButton");
    const addressInput = document.getElementById("addressInput");
    const weatherResults = document.getElementById("weatherResults");

    const apiKey = "39ae48ce48d85b4cc60576e16f5a499b";  // Zamień na własny klucz API OpenWeatherMap

    weatherButton.addEventListener("click", () => {
        const city = addressInput.value.trim();
        if (city === "") {
            alert("Proszę wprowadzić adres lub miasto");
            return;
        }

        getCurrentWeather(city);

        getWeatherForecast(city);
    });

    function getCurrentWeather(city) {
        const url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric&lang=pl`;
        const xhr = new XMLHttpRequest();
        
        xhr.open("GET", url, true);
        xhr.onreadystatechange = function () {
            if (xhr.readyState === 4 && xhr.status === 200) {
                const data = JSON.parse(xhr.responseText);
                displayCurrentWeather(data);
                console.log(data);
            } else if (xhr.readyState === 4) {
                alert("Nie udało się pobrać bieżącej pogody.");
            }
        };
        xhr.send();
    }

    function getWeatherForecast(city) {
        const url = `https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${apiKey}&units=metric&lang=pl`;

        fetch(url)
            .then(response => {
                if (!response.ok) {
                    throw new Error("Nie udało się pobrać prognozy pogody.");
                }
                return response.json();
            })
            .then(data => {console.log(data);displayWeatherForecast(data)})
            .catch(error => alert(error));
        
    }

    function displayCurrentWeather(data) {
        const { main, weather, name } = data;
        const description = weather[0].description;
        const temp = main.temp;

        const currentWeatherHTML = `
            <h3>Bieżąca pogoda dla ${name}</h3>
            <p>Temperatura: ${temp}°C</p>
            <p>Opis: ${description}</p>
        `;
        weatherResults.innerHTML = currentWeatherHTML;
    }

    function displayWeatherForecast(data) {
        const forecastHTML = `<h3>Prognoza pogody na 5 dni</h3>`;
        const forecastList = data.list;

        let forecastContent = forecastList
            .filter((_, index) => index % 8 === 0) 
            .map(item => {
                const date = new Date(item.dt_txt).toLocaleDateString("pl-PL");
                const temp = item.main.temp;
                const description = item.weather[0].description;

                return `
                    <div>
                        <p><strong>${date}</strong></p>
                        <p>Temperatura: ${temp}°C</p>
                        <p>Opis: ${description}</p>
                    </div>
                `;
            })
            .join("");

        weatherResults.innerHTML += forecastHTML + forecastContent;
    }
});
