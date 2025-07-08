import React from 'react';
// import { Row, Col } from 'antd';
import { HomeOutlined } from '@ant-design/icons';

const PlantHeader = ({ plantName, realtimeInfo }) => {
  return (
    <div className="plant-header-enhanced">
      {/* Left: Icon, status dot, plant name */}
      <div className="plant-header-left">
        <span className="plant-icon-wrapper">
          <HomeOutlined className="plant-icon" />
          <span className="status-dot" style={{ backgroundColor: realtimeInfo.station_health === 'healthy' ? '#2ecc40' : '#ff4d4f' }}/>
        </span>
        <span className="plant-name">{plantName}</span>
      </div>
      {/* Right: Weather info */}
      <div className="plant-header-right">
        <div className="weather-row">
          {/* Weather icon and label */}
          {/* <span className="weather-icon-label">
            <span className="weather-icon">
              <img src="https://cdn.jsdelivr.net/gh/twitter/twemoji@14.0.2/assets/svg/1f327.svg" alt="rain" style={{ width: 20, verticalAlign: 'middle' }} />
            </span>
            <span className="weather-label">{weatherData.status}</span>
          </span> */}
          {/* Temperature and current day/date */}
          {/* <span className="weather-temp-group">
            <span className="weather-temp">{weatherData.temperature}°C</span>
            <span className="weather-temp-date">{currentDay.day}  {currentDay.date}</span>
          </span> */}
          {/* Days */}
          {/* <span className="weather-days">
            {weatherData.days.map((day, idx) => (
              <span
                key={day.day}
                className={`weather-day${idx === 0 ? ' active' : ''}`}

              >
                <span className="weather-day-icon">
                  <img src="https://cdn.jsdelivr.net/gh/twitter/twemoji@14.0.2/assets/svg/1f327.svg" alt="rain" style={{ width: 20, verticalAlign: 'middle' }} />
                </span>
                <span className="weather-day-label">{day.day}</span>
              </span>
            ))}
          </span> */}
        </div>
      </div>
    </div>
  );
};

export default PlantHeader; 