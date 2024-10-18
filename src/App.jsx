import React, { useState, useEffect } from "react";
import './App.css';
import pic from './Aplle.png'

const WeatherApp = () => {
  const [weatherData, setWeatherData] = useState(null);
  const [forecastData, setForecastData] = useState(null);
  const [location, setLocation] = useState("");
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const API_KEY = "ecf07bafe5f67fa8a66abd728beb563b";

  const fetchWeatherData = async (city) => {
    if (!city) return;
    setIsLoading(true);
    setError(null);
    try {
      const weatherResponse = await fetch(
        `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}&units=metric`
      );
      if (!weatherResponse.ok) {
        throw new Error("City not found");
      }
      const weather = await weatherResponse.json();
      setWeatherData(weather);

      const forecastResponse = await fetch(
        `https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${API_KEY}&units=metric`
      );
      if (!forecastResponse.ok) {
        throw new Error("Forecast data not available");
      }
      const forecast = await forecastResponse.json();
      setForecastData(forecast);
    } catch (error) {
      setError(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      fetchWeatherData(location);
    }, 500); // Debounce API calls for 500ms
    return () => clearTimeout(timer);
  }, [location]);

  return (
    <div className="container">
      <header className="app-header">
        <img
          src={pic} 
          alt="Weather Icon"
          className="header-image"
          />
          <h1>Weather App</h1>
      </header>
      <div className="input-container">
        <input
          type="text"
          className="input"
          value={location}
          onChange={(e) => setLocation(e.target.value)}
          placeholder="Enter city name"
        />
      </div>

      {isLoading && <p className="loading-text">Loading...</p>}
      {error && <p className="error-text">Error: {error}</p>}

      {weatherData && (
        <div className="current-weather">
          <h2>Current Weather in {weatherData.name}</h2>
          <p>{weatherData.weather[0].description}</p>
          <p>Temperature: {weatherData.main.temp}°C</p>
          <img
            className="weather-icon"
            src={`http://openweathermap.org/img/wn/${weatherData.weather[0].icon}@2x.png`}
            alt={weatherData.weather[0].description}
          />
        </div>
      )}
      {forecastData && (
        <>
  <h1 style={{textAlign:'center',color:'#4c83ff'}}>Forecast 5/3</h1>
        <div className="forecast">
          {forecastData.list.map((forecast, index) => (
            <div key={index} className="forecast-day">
               <p style={{fontWeight:'bolder'}}>{new Date(forecast.dt * 1000).toLocaleDateString()} {new Date(forecast.dt * 1000).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</p>
              <p>Temp: {forecast.main.temp}°C</p>
              <p>{forecast.weather[0].description}</p>
              <img
                className="weather-icon"
                src={`http://openweathermap.org/img/wn/${forecast.weather[0].icon}@2x.png`}
                alt={forecast.weather[0].description}
              />
            </div>
          ))}
        </div>
        </>
      )}
    </div>
  );
};

export default WeatherApp;






