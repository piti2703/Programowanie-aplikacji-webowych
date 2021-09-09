export interface WeatherObject {
    name: string,
    icon: string,
    description: string,
    temp: number,
    humidity: number,
    pressure: number,
    speed: number
}
interface WeatherResponse {
    weather: [{
        icon: string,
        description: string
    }],
    name: string,
    wind: { speed: number },
    main: {
        temp: number,
        humidity: number,
        pressure: number
    }
}
export class App {
    weatherPanes: WeatherObject[] = []
    apiKey = "e7bafc754d9c229668d2a99fd72e4290"

    constructor() {
        this.weatherPanes = JSON.parse(localStorage.getItem('weatherPanes')) || [];
    }

    writeToLocalStorage () {
        localStorage.setItem('weatherPanes', JSON.stringify(this.weatherPanes));
    }

    fetchWeather (city: string, callback: (weather: WeatherObject) => void) {
        fetch(
          "https://api.openweathermap.org/data/2.5/weather?q=" +
          city +
          "&units=metric&appid=" +
          this.apiKey
        )
          .then((response) => {
              if (!response.ok) {
                  alert("No weather found.");
                  throw new Error("No weather found.");
              }
              return response.json();
          })
          .then((data) => this.parseWeatherData(data))
          .then((data: WeatherObject) => callback(data));
    }

    parseWeatherData (data: WeatherResponse): WeatherObject {
        const { name } = data;
        const { icon, description } = data.weather[0];
        const { temp, humidity, pressure } = data.main;
        const { speed } = data.wind;

        const weatherData = {
            name,
            icon,
            description,
            temp,
            humidity,
            pressure,
            speed
        }

        this.weatherPanes.push(weatherData);



        this.writeToLocalStorage();
        // fillElementWithData(createCard(), weatherData);
        return weatherData;
    }
}