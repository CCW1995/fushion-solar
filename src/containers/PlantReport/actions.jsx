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
      plantReportData: [],
      plantReportTotal: 0,
    };

    onChangeHOC = (val, context) => this.setState({ [context]: val });

    load = (val) => this.setState({ loading: val })

    getPlantReport = (params = {}) => {
      const {
        page = 1,
        limit = 10,
        dimension = 'station',
        inverterBrand = '',
        period = 'daily',
        date = null,
        stationName = ''
      } = params;

      // Format date based on period
      const formattedDate = formatDateByPeriod(date, period);

      // Build query string only with filled values
      const queryParams = [
        `page=${page}`,
        `limit=${limit}`,
        dimension ? `dimension=${encodeURIComponent(dimension)}` : null,
        inverterBrand ? `inverterBrand=${encodeURIComponent(inverterBrand)}` : null,
        period ? `period=${encodeURIComponent(period)}` : null,
        formattedDate ? `date=${encodeURIComponent(formattedDate)}` : null,
        stationName ? `stationName=${encodeURIComponent(stationName)}` : null
      ].filter(Boolean).join('&');

      Get(
        `/report/station/list?${queryParams}`,
        this.getPlantReportSuccess,
        this.getPlantReportError,
        this.load
      );
    }
    
    getPlantReportSuccess = payload => {
      this.setState({ 
        plantReportData: payload.data || [], 
        plantReportTotal: payload.pageMeta?.itemCount || 0 
      })
    }
    
    getPlantReportError = (error) => {
      console.error('Error fetching plant report:', error);
      // You can add proper error handling here
    }

    exportPlantReport = (params = {}) => {
      const {
        dimension = 'station',
        period = 'daily',
        date = null,
        inverterBrand = '',
        stationName = ''
      } = params;

      // Format date based on period
      const formattedDate = formatDateByPeriod(date, period);

      // Build query string only with filled values
      const queryParams = [
        dimension ? `dimension=${encodeURIComponent(dimension)}` : null,
        period ? `period=${encodeURIComponent(period)}` : null,
        formattedDate ? `date=${encodeURIComponent(formattedDate)}` : null,
        inverterBrand ? `inverterBrand=${encodeURIComponent(inverterBrand)}` : null,
        stationName ? `stationName=${encodeURIComponent(stationName)}` : null
      ].filter(Boolean).join('&');

      // Make API call to export endpoint
      Get(
        `/report/station/export?${queryParams}`,
        this.exportPlantReportSuccess,
        this.exportPlantReportError,
        this.load
      );
    }

    exportPlantReportSuccess = (response) => {
      // Create blob from CSV response and trigger download
      const blob = new Blob([response], { type: 'text/csv;charset=utf-8;' });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `station-report-${new Date().toISOString().slice(0, 10)}.csv`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    }

    exportPlantReportError = (error) => {
      console.error('Error exporting plant report:', error);
    }

    render = () => {
      return (
        <WrappedComponent
          {...this.props}
          {...this.state}
          onChangeHOC={this.onChangeHOC}
          getPlantReport={this.getPlantReport}
          exportPlantReport={this.exportPlantReport}
        />
      );
    };
  }
  
  const mapStateToProps = (state) => ({ data: state });
  return connect(mapStateToProps, { setStationInfo, setPath, withRouter })(WithHOC);
};

export default HOC;
