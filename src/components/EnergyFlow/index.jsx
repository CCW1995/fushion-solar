import React from 'react';
import { 
  WiDaySunny, 
  //WiHome, 
  WiStrongWind 
} from 'react-icons/wi';
import './index.scss';

const EnergyFlow = ({ 
  pvPower = 0.000, 
  loadPower = 1.313, 
  gridPower = 1.313 
}) => {
  return (
    <div className="energy-flow-diagram">
      <div className="energy-flow-container">
        {/* PV Node */}
        <div className="energy-node pv-node">
          <div className="node-icon">
            <WiDaySunny />
          </div>
          <div className="node-value">
            {pvPower.toFixed(3)} kW
          </div>
          <div className="node-label">PV</div>
        </div>

        {/* Load Node */}
        <div className="energy-node load-node">
          <div className="node-icon">
            <WiDaySunny />
          </div>
          <div className="node-value">
            {loadPower.toFixed(3)} kW
          </div>
          <div className="node-label">Load</div>
        </div>

        {/* Grid Node */}
        <div className="energy-node grid-node">
          <div className="node-icon">
            <WiStrongWind />
          </div>
          <div className="node-value">
            {gridPower.toFixed(3)} kW
          </div>
          <div className="node-label">Grid</div>
        </div>

        {/* Connection Lines */}
        <div className="connection-lines">
          {/* PV to Load curved connection box */}
          <div className="connection-line pv-to-load-connection"></div>
          
          {/* PV to Grid curved connection box (mirrored) */}
          <div className="connection-line pv-to-grid-connection"></div>
          
          {/* Grid to Load */}
          <div className="connection-line load-grid-line">
            <div className="flow-arrow load-grid-arrow"></div>
          </div>
        </div>


      </div>
    </div>
  );
};

export default EnergyFlow; 