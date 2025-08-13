import React, { useState, useEffect } from 'react';
import { Typography } from 'antd';
import EnergyFlow from '../../../components/EnergyFlow';

const { Title } = Typography;

const PlantFlow = ({
  powerData
}) => {
  console.log(powerData)

  return (
    <div className="plant-flow-card" style={{ display: 'grid', placeItems: 'center' }}>
      <EnergyFlow 
        pvPower={powerData?.pv ?? 0}
        loadPower={powerData?.load ?? 0}
        gridPower={powerData?.grid ?? 0}
      />
    </div>
  );
};

export default PlantFlow; 