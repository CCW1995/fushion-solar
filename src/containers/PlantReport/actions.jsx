import React, { Component } from "react";
import { connect } from "react-redux";

import { setPath } from "actions/path";
import { withRouter } from "react-router-dom";
import { setStationInfo } from "reducers/station";
import { Get } from "utils/axios";

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
        order = 'ASC',
        page = 1,
        limit = 10,
        brand = '',
        plant = '',
        dimension = 'By plant',
        timeGranularity = 'Daily',
        statisticalPeriod = null
      } = params;

      // Build query string only with filled values
      const queryParams = [
        `page=${page}`,
        `limit=${limit}`,
        brand ? `brand=${encodeURIComponent(brand)}` : null,
        plant ? `plant=${encodeURIComponent(plant)}` : null,
        dimension ? `dimension=${encodeURIComponent(dimension)}` : null,
        timeGranularity ? `timeGranularity=${encodeURIComponent(timeGranularity)}` : null,
        statisticalPeriod ? `statisticalPeriod=${encodeURIComponent(statisticalPeriod.format('YYYY-MM-DD'))}` : null
      ].filter(Boolean).join('&');

      Get(
        `/plant/report?${queryParams}`,
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

    render = () => {
      return (
        <WrappedComponent
          {...this.props}
          {...this.state}
          onChangeHOC={this.onChangeHOC}
          getPlantReport={this.getPlantReport}
        />
      );
    };
  }
  
  const mapStateToProps = (state) => ({ data: state });
  return connect(mapStateToProps, { setStationInfo, setPath, withRouter })(WithHOC);
};

export default HOC;
