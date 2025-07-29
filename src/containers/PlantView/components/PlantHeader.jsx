import React from 'react';
import { HomeOutlined } from '@ant-design/icons';

const PlantHeader = ({ plantName, realtimeInfo }) => {
  return (
    <div className="plant-header-enhanced">
      {/* Left: Icon, status dot, plant name */}
      <div className="plant-header-left">
        <span className="plant-icon-wrapper">
          <HomeOutlined className="plant-icon" />
          <span 
            className="status-dot" 
            style={{ 
              backgroundColor: realtimeInfo.station_health === 'healthy' ? '#2ecc40' : '#ff4d4f' 
            }}
          />
        </span>
        <span className="plant-name">{plantName}</span>
      </div>
      
      {/* Right: Weather info (currently disabled) */}
      <div className="plant-header-right">
        <div className="weather-row">
          {/* Weather functionality can be added here in the future */}
        </div>
      </div>
    </div>
  );
};

export default PlantHeader; 