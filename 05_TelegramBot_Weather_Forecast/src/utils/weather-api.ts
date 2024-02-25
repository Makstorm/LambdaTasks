import { ForecastEntry, WeatherForecast } from "../models";
import axios from "axios";

export const getWeatherForecast = async (city: string, step: number) => {
  try {
    const weatherForecast = await axios.get<WeatherForecast>(
      `https://api.openweathermap.org/data/2.5/forecast?appid=c97bfd693fbed2d72af94be318e03201&q=${city}&lang=ua&units=metric`
    );

    const forecasts: ForecastEntry[] = weatherForecast.data.list;

    const filteredForecasts = forecasts.filter((e, i) => {
      const date = new Date(e.dt * 1000);

      return step === 3
        ? new Date().getTime() < date.getTime()
        : date.getUTCHours() % step === 0 &&
            new Date().getTime() < date.getTime();
    });

    const formatedForecast = await getFormatedForecast(filteredForecasts);
    return `Погода в ${city} з кроком в ${step} год.\n` + formatedForecast;
  } catch (error) {
    console.error("Error fetching weather forecast:", error);
  }
};

const getFormatedForecast = async (forecast: ForecastEntry[]) => {
  let output = "";
  let currentDate = "";

  forecast.forEach((item: ForecastEntry) => {
    const dateTime = new Date(item.dt * 1000);
    const date = dateTime.toLocaleDateString("uk-UA", {
      weekday: "long",
      month: "short",
      day: "numeric",
    });
    const time = dateTime.toLocaleTimeString("uk-UA", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
    });

    if (currentDate !== date) {
      if (currentDate !== "") output += "\n";
      output += `${date}:\n`;
      currentDate = date;
    }

    const temp = item.main.temp.toFixed(1);
    const feelsLike = item.main.feels_like.toFixed(1);
    const weather = item.weather[0].description;

    output += `    ${time}, ${temp}°C, Відчувається як ${feelsLike}°C, ${weather}\n`;
  });

  return output;
};
