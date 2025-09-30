import React, { Component } from "react";
import { connect } from "react-redux";

import { setPath } from "actions/path";
import { withRouter } from "react-router-dom";
import { setStationInfo } from "reducers/station";
import { Get } from "utils/axios";
import dayjs from 'dayjs';

// Helper function to format date based on period
const formatDateByPeriod = (date, period) => {
  if (!date) return null;
  
  switch (period) {
    case 'daily':
      return dayjs(date).format('YYYY-MM-DD');
    case 'monthly':
      return dayjs(date).format('YYYY-MM');
    case 'yearly':
      return dayjs(date).format('YYYY');
    case 'lifetime':
      return dayjs(date).format('YYYY'); // Year format for lifetime
    default:
      return dayjs(date).format('YYYY-MM-DD');
  }
};

const HOC = (WrappedComponent) => {
  class WithHOC extends Component {
    state = {
      loading: false,
      inverterReportData: [],
      inverterReportTotal: 0,
    };

    onChangeHOC = (val, context) => this.setState({ [context]: val });

    load = (val) => this.setState({ loading: val })

    getInverterReport = (params = {}) => {
      const {
        page = 1,
        limit = 10,
        inverterBrand = '',
        deviceName = '',
        period = 'daily',
        date = null
      } = params;

      // Format date based on period
      const formattedDate = formatDateByPeriod(date, period);

      // Build query string only with filled values
      const queryParams = [
        `page=${page}`,
        `limit=${limit}`,
        inverterBrand ? `inverterBrand=${encodeURIComponent(inverterBrand)}` : null,
        deviceName ? `stationName=${encodeURIComponent(deviceName)}` : null,
        period ? `period=${encodeURIComponent(period)}` : null,
        formattedDate ? `date=${encodeURIComponent(formattedDate)}` : null
      ].filter(Boolean).join('&');

      Get(
        `/report/inverter/list?${queryParams}`,
        this.getInverterReportSuccess,
        this.getInverterReportError,
        this.load
      );
    }
    
    getInverterReportSuccess = payload => {
      this.setState({ 
        inverterReportData: payload.data || [], 
        inverterReportTotal: payload.pageMeta?.itemCount || 0 
      })
    }
    
    getInverterReportError = (error) => {
      console.error('Error fetching inverter report:', error);
      // You can add proper error handling here
    }

    exportInverterReport = (params = {}) => {
      const {
        inverterBrand = '',
        deviceName = '',
        period = 'daily',
        date = null
      } = params;

      // Format date based on period
      const formattedDate = formatDateByPeriod(date, period);

      // Build query string only with filled values
      const queryParams = [
        inverterBrand ? `inverterBrand=${encodeURIComponent(inverterBrand)}` : null,
        deviceName ? `deviceName=${encodeURIComponent(deviceName)}` : null,
        period ? `period=${encodeURIComponent(period)}` : null,
        formattedDate ? `date=${encodeURIComponent(formattedDate)}` : null
      ].filter(Boolean).join('&');

      // Make API call to export endpoint
      Get(
        `/report/inverter/export?${queryParams}`,
        this.exportInverterReportSuccess,
        this.exportInverterReportError,
        this.load
      );
    }

    exportInverterReportSuccess = (response) => {
      // Create blob from CSV response and trigger download
      const blob = new Blob([response], { type: 'text/csv;charset=utf-8;' });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `inverter-report-${new Date().toISOString().slice(0, 10)}.csv`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    }

    exportInverterReportError = (error) => {
      console.error('Error exporting inverter report:', error);
    }

    render = () => {
      return (
        <WrappedComponent
          {...this.props}
          {...this.state}
          onChangeHOC={this.onChangeHOC}
          getInverterReport={this.getInverterReport}
          exportInverterReport={this.exportInverterReport}
        />
      );
    };
  }
  
  const mapStateToProps = (state) => ({ data: state });
  return connect(mapStateToProps, { setStationInfo, setPath, withRouter })(WithHOC);
};

export default HOC;
