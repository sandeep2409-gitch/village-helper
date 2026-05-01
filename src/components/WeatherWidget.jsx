import React from 'react';
import { Droplets, Wind, MapPin } from 'lucide-react';

const WeatherWidget = ({ weather, locationName }) => {
  if (!weather) return null;

  return (
    <div className="glass-panel weather-widget">
      <h3 style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
        <MapPin size={24} color="var(--primary-color)" />
        {locationName}
      </h3>
      <div className="weather-temp">{Math.round(weather.main.temp)}°C</div>
      <div className="weather-desc">{weather.weather[0].description}</div>
      
      <div className="weather-details">
        <div className="weather-stat">
          <Droplets size={20} color="#3b82f6" />
          <span>{weather.main.humidity}%</span>
        </div>
        <div className="weather-stat">
          <Wind size={20} color="#64748b" />
          <span>{weather.wind.speed} m/s</span>
        </div>
      </div>
    </div>
  );
};

export default WeatherWidget;
