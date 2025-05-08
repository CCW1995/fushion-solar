import React from 'react';
import { Row, Col, Card, Typography } from 'antd';
import {
  GoldOutlined,
  CloudOutlined,
  GlobalOutlined
} from '@ant-design/icons';

const { Text } = Typography;

const PlantInfo = ({ energyData }) => {
  return (
    <Card className="section-card plant-info-card">
      <Row gutter={[30, 16]}>
        <Col xs={24} md={6}>
          <div className="environmental-benefit">
            <div className="benefit-item">
              <div className="benefit-header">
                <GoldOutlined className="benefit-icon" />
              </div>
              <div>
                <div className="benefit-values">
                  <Text className="value">{energyData.standardCoal}</Text>
                  <Text className="unit">(tons)</Text>
                </div>
                <Text className="benefit-label">Standard coal saved</Text>
              </div>
            </div>
            <div className="benefit-item">
              <div className="benefit-header">
                <CloudOutlined className="benefit-icon" />
              </div>
              <div>
                <div className="benefit-values">
                  <Text className="value">{energyData.co2Avoided}</Text>
                  <Text className="unit">(tons)</Text>
                </div>
                <Text className="benefit-label">CO₂ avoided</Text>
              </div>
            </div>
            <div className="benefit-item">
              <div className="benefit-header">
                <GlobalOutlined className="benefit-icon" />
              </div>
              <div>
                <div className="benefit-values">
                  <Text className="value">{energyData.treesPlanted}</Text>
                </div>
                <Text className="benefit-label">Equivalent trees planted</Text>
              </div>
            </div>
          </div>
        </Col>
        <Col xs={24} md={8}>
          <div className="alarm-section">
            <div className="alarm-header">
              <Text className="alarm-count">{energyData.alarms.total}</Text>
              <Text className="alarm-label">Alarm</Text>
            </div>
            <div className="alarm-categories">
              <div className="alarm-category">
                <Text className="category-label">Critical</Text>
                <Text className="category-count">{energyData.alarms.critical}</Text>
              </div>
              <div className="alarm-category">
                <Text className="category-label">Major</Text>
                <Text className="category-count">{energyData.alarms.major}</Text>
              </div>
              <div className="alarm-category">
                <Text className="category-label">Minor</Text>
                <Text className="category-count">{energyData.alarms.minor}</Text>
              </div>
              <div className="alarm-category">
                <Text className="category-label">Warning</Text>
                <Text className="category-count">{energyData.alarms.warning}</Text>
              </div>
            </div>
          </div>
        </Col>
        <Col xs={24} md={10}>
        <div className="plant-details-vertical">
        <div className="plant-detail-item">
          <Text className="detail-label">Plant name</Text>
          <Text className="detail-value">{energyData.plantDetails.name}</Text>
        </div>
        <div className="plant-detail-item">
          <Text className="detail-label">Plant address</Text>
          <Text className="detail-value">{energyData.plantDetails.address}</Text>
        </div>
        <div className="plant-detail-item">
          <Text className="detail-label">Total string capacity</Text>
          <Text className="detail-value">{energyData.plantDetails.capacity}</Text>
        </div>
        <div className="plant-detail-item">
          <Text className="detail-label">Grid connection date</Text>
          <Text className="detail-value">{energyData.plantDetails.connectionDate}</Text>
        </div>
      </div>
        </Col>
      </Row>
    </Card>
  );
};

export default PlantInfo; 