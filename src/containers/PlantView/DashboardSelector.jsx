import React, { useState } from 'react';
import { Card, Switch, Space, Typography, Alert } from 'antd';
import { DashboardOutlined, BarChartOutlined } from '@ant-design/icons';
import PlantMonitoringView from './index.jsx';
import GrafanaPlantView from './GrafanaPlantView.jsx';

const { Title, Text } = Typography;

const DashboardSelector = (props) => {
  const [useGrafana, setUseGrafana] = useState(false);

  const handleDashboardChange = (checked) => {
    setUseGrafana(checked);
  };

  return (
    <div className="dashboard-selector">
      {/* Dashboard Type Selector */}
      <Card 
        style={{ 
          background: '#fff', 
          borderRadius: 16, 
          boxShadow: '0 1px 2px rgba(0,0,0,0.04)', 
          marginBottom: 24 
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <Title level={4} style={{ margin: 0 }}>
              <Space>
                {useGrafana ? <BarChartOutlined /> : <DashboardOutlined />}
                {useGrafana ? 'Grafana Dashboard' : 'React Dashboard'}
              </Space>
            </Title>
            <Text type="secondary">
              {useGrafana 
                ? 'Advanced monitoring with Grafana visualizations' 
                : 'Custom React-based dashboard with Ant Design charts'
              }
            </Text>
          </div>
          <Space>
            <Text>React</Text>
            <Switch 
              checked={useGrafana}
              onChange={handleDashboardChange}
              checkedChildren="Grafana"
              unCheckedChildren="React"
            />
            <Text>Grafana</Text>
          </Space>
        </div>
      </Card>

      {/* Configuration Alert for Grafana */}
      {useGrafana && (
        <Alert
          message="Grafana Configuration Required"
          description={
            <div>
              <p>To use the Grafana dashboard, you need to:</p>
              <ol>
                <li>Set up a Grafana instance (see GRAFANA_SETUP.md)</li>
                <li>Configure environment variables in your .env file</li>
                <li>Import the dashboard templates</li>
                <li>Set up data sources (InfluxDB/Prometheus)</li>
              </ol>
              <p>
                <strong>Environment Variables:</strong><br />
                REACT_APP_GRAFANA_URL=http://localhost:3000<br />
                REACT_APP_GRAFANA_API_KEY=your_api_key_here
              </p>
            </div>
          }
          type="info"
          showIcon
          style={{ marginBottom: 24 }}
        />
      )}

      {/* Dashboard Component */}
      {useGrafana ? (
        <GrafanaPlantView {...props} />
      ) : (
        <PlantMonitoringView {...props} />
      )}
    </div>
  );
};

export default DashboardSelector; 