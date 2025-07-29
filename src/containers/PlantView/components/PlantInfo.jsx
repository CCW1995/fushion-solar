import React from 'react';
import { Row, Col, Card, Typography } from 'antd';
import {
  GoldOutlined,
  CloudOutlined,
  GlobalOutlined
} from '@ant-design/icons';

const { Text } = Typography;

// Environmental benefit items configuration
const environmentalBenefits = [
  {
    key: 'coal_saved',
    label: 'Standard coal saved',
    icon: <GoldOutlined className="benefit-icon" />,
    unit: '(tons)',
  },
  {
    key: 'co2_avoided',
    label: 'CO₂ avoided',
    icon: <CloudOutlined className="benefit-icon" />,
    unit: '(tons)',
  },
  {
    key: 'trees_planted',
    label: 'Equivalent trees planted',
    icon: <GlobalOutlined className="benefit-icon" />,
    unit: '',
  }
];

// Alarm categories configuration
const alarmCategories = [
  { key: 'critical', label: 'Critical' },
  { key: 'major', label: 'Major' },
  { key: 'minor', label: 'Minor' },
  { key: 'warning', label: 'Warning' }
];

const PlantInfo = ({ plantInfo, alarmCount, envBenefit }) => {
  // Helper function to format date
  const formatDate = (dateString) => {
    return dateString?.split('T')[0] || '';
  };

  // Helper function to format number
  const formatNumber = (value) => {
    return Number(value || 0).toFixed(2);
  };

  return (
    <Card className="section-card plant-info-card">
      <Row gutter={[30, 16]}>
        {/* Environmental Benefits Section */}
        <Col xs={24} md={24} lg={6} xl={6}>
          <div className="environmental-benefit">
            {environmentalBenefits.map((benefit) => (
              <div className="benefit-item" key={benefit.key}>
                <div className="benefit-header">
                  {benefit.icon}
                </div>
                <div>
                  <div className="benefit-values">
                    <Text className="value">{formatNumber(envBenefit?.[benefit.key])}</Text>
                    {benefit.unit && <Text className="unit">{benefit.unit}</Text>}
                  </div>
                  <Text className="benefit-label">{benefit.label}</Text>
                </div>
              </div>
            ))}
          </div>
        </Col>

        {/* Alarm Section */}
        <Col xs={24} md={24} lg={8} xl={8}>
          <div className="alarm-section">
            <div className="alarm-header">
              <Text className="alarm-count">{alarmCount?.total_alarm || 0}</Text>
              <Text className="alarm-label">Alarm</Text>
            </div>
            <div className="alarm-categories">
              {alarmCategories.map((category) => (
                <div className="alarm-category" key={category.key}>
                  <Text className="category-label">{category.label}</Text>
                  <Text className="category-count">{alarmCount?.[category.key] || 0}</Text>
                </div>
              ))}
            </div>
          </div>
        </Col>

        {/* Plant Details Section */}
        <Col xs={24} md={24} lg={10} xl={10}>
          <div className="plant-details-vertical">
            <div className="plant-detail-item">
              <Text className="detail-label">Plant name</Text>
              <Text className="detail-value">{plantInfo?.station_name || '-'}</Text>
            </div>
            <div className="plant-detail-item">
              <Text className="detail-label">Plant address</Text>
              <Text className="detail-value">{plantInfo?.station_address || '-'}</Text>
            </div>
            <div className="plant-detail-item">
              <Text className="detail-label">Total string capacity</Text>
              <Text className="detail-value">{plantInfo?.capacity || 0} kWP</Text>
            </div>
            <div className="plant-detail-item">
              <Text className="detail-label">Grid connection date</Text>
              <Text className="detail-value">{formatDate(plantInfo?.grid_connection_date)}</Text>
            </div>
          </div>
        </Col>
      </Row>
    </Card>
  );
};

export default PlantInfo; 