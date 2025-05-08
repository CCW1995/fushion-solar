import React from 'react';
import { Typography } from 'antd';

const { Title } = Typography;
import plantFlow from 'assets/Images/plant-flow.png';

const PlantFlow = () => {
  return (
    <div className="plant-flow-card" style={{ display: 'grid', placeItems: 'center' }}>
      <img src={plantFlow} alt="Plant Flow" style={{ width: '100%' }}/>
    </div>
  );
};

export default PlantFlow; 