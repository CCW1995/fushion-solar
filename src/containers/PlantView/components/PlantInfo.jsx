import React from 'react';
import { Row, Col, Card, Typography } from 'antd';
import {
  GoldOutlined,
  CloudOutlined,
  GlobalOutlined
} from '@ant-design/icons';

const { Text } = Typography;

const PlantInfo = ({ plantInfo, alarmCount, envBenefit }) => {
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
                  <Text className="value">{Number(envBenefit.coal_saved).toFixed(2)}</Text>
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
                  <Text className="value">{Number(envBenefit.co2_avoided).toFixed(2)}</Text>
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
                  <Text className="value">{Number(envBenefit.trees_planted).toFixed(2)}</Text>
                </div>
                <Text className="benefit-label">Equivalent trees planted</Text>
              </div>
            </div>
          </div>
        </Col>
        <Col xs={24} md={8}>
          <div className="alarm-section">
            <div className="alarm-header">
              <Text className="alarm-count">{alarmCount.total_alarm}</Text>
              <Text className="alarm-label">Alarm</Text>
            </div>
            <div className="alarm-categories">
              <div className="alarm-category">
                <Text className="category-label">Critical</Text>
                <Text className="category-count">{alarmCount.critical}</Text>
              </div>
              <div className="alarm-category">
                <Text className="category-label">Major</Text>
                <Text className="category-count">{alarmCount.major}</Text>
              </div>
              <div className="alarm-category">
                <Text className="category-label">Minor</Text>
                <Text className="category-count">{alarmCount.minor}</Text>
              </div>
              <div className="alarm-category">
                <Text className="category-label">Warning</Text>
                <Text className="category-count">{alarmCount.warning}</Text>
              </div>
            </div>
          </div>
        </Col>
        <Col xs={24} md={10}>
        <div className="plant-details-vertical">
        <div className="plant-detail-item">
          <Text className="detail-label">Plant name</Text>
          <Text className="detail-value">{plantInfo.station_name}</Text>
        </div>
        <div className="plant-detail-item">
          <Text className="detail-label">Plant address</Text>
          <Text className="detail-value">{plantInfo.station_address}</Text>
        </div>
        <div className="plant-detail-item">
          <Text className="detail-label">Total string capacity</Text>
          <Text className="detail-value">{plantInfo.capacity} MWp</Text>
        </div>
        <div className="plant-detail-item">
          <Text className="detail-label">Grid connection date</Text>
          <Text className="detail-value">{plantInfo.grid_connection_date?.split('T')[0]}</Text>
        </div>
      </div>
        </Col>
      </Row>
    </Card>
  );
};

export default PlantInfo; 