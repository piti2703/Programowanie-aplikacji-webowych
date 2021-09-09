import { App, WeatherObject } from './app';
import './main.scss';

const app = new App();

function renderPanes () {
  app.weatherPanes.forEach(weatherObject => {
    fillElementWithData(createCard(), weatherObject);
  });
}

document.addEventListener('DOMContentLoaded', () => {
  renderPanes();
})

function fillElementWithData (element: HTMLElement, data: WeatherObject) {
  (element.querySelector(".city") as HTMLElement).innerText = "Current weather in " + data.name;
  (element.querySelector(".icon") as HTMLImageElement).src =
    "https://openweathermap.org/img/wn/" + data.icon + ".png";
  (element.querySelector(".description") as HTMLElement).innerText = data.description;
  (element.querySelector(".temp") as HTMLElement).innerText = data.temp + "°C";
  (element.querySelector(".humidity") as HTMLElement).innerText =
    "Humidity: " + data.humidity + "%";
  (element.querySelector(".wind") as HTMLElement).innerText =
    "Wind speed: " + data.speed + " km/h";
  (element.querySelector(".pressure") as HTMLElement).innerText =
    "Pressure: " + data.pressure + " hPa";
}

function createCard(): HTMLDivElement {
  const content = document.querySelector(".weather-cards");
  const card = document.createElement("div");
  content.appendChild(card);
  card.classList.add("card");

  const h2 = document.createElement("h2");
  const h1 = document.createElement("h1");

  card.appendChild(h2);
  h2.classList.add("city");
  card.appendChild(h1);
  h1.classList.add("temp");


  const flex = document.createElement("div");
  card.appendChild(flex);
  flex.classList.add("flex");

  const img = document.createElement("img");
  flex.appendChild(img);
  img.classList.add("icon");

  const description = document.createElement("div");
  flex.appendChild(description);
  description.classList.add("description");

  const humidity = document.createElement("div");
  card.appendChild(humidity);
  humidity.classList.add("humidity");

  const wind = document.createElement("div");
  card.appendChild(wind);
  wind.classList.add("wind");

  const pressure = document.createElement("div");
  card.appendChild(pressure);
  pressure.classList.add("pressure");

  return card;
}

// searching logic
document
  .querySelector("form.search")
  .addEventListener("submit", function (event: Event) {
    event.preventDefault();
    const inputElement: HTMLInputElement = (event.currentTarget as HTMLElement).querySelector("input[name='city']");
    app.fetchWeather(inputElement.value, (weather: WeatherObject) => {
      fillElementWithData(createCard(), weather);
    });
    inputElement.value = '';
  });
