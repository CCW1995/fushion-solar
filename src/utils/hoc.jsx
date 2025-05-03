import React, { Component } from "react";
import { connect } from 'react-redux'
import { Get, Post, Put } from "utils/axios";
import { setPath } from 'actions/path'
import { requestError, requestSuccess } from "utils/requestHandler";

const HOC = (WrappedComponent) => {
  class WithHOC extends Component {
    state = {
      loading: false,
      requestCount: 0,
      samples: [],
      selectedSample: {},
      showCreateModal: false,
      showUpdateModal: false,
      errors: [],
    };

    onChangeSampleHOC = (key, val) => this.setState({ [key]: val });

    load = (param) => {
      this.setState((prevState) => {
        const newCount = param ? prevState.requestCount + 1 : prevState.requestCount - 1
        return {
          loading: newCount > 0,
          requestCount: newCount,
        }
      })
    };

    getSamples = () =>
      Get(
        `/api/samples`,
        this.getSamplesSuccess,
        this.getSamplesError,
        this.load
      );
    getSamplesSuccess = (payload) =>
      this.setState({ samples: payload.data });
    getSamplesError = (error) => requestError(error.message, "Error");

    getSelectedSample = (id) =>
      Get(
        `/api/samples/${id}`,
        this.getSelectedSampleSuccess,
        this.getSelectedSampleError,
        this.load
      );
    getSelectedSampleSuccess = (payload) =>
      this.setState({
        selectedSample: payload.data,
        showUpdateModal: true,
      });
    getSelectedSampleError = (error) => requestError(error.message, "Error");

    createSample = (dataToSubmit) =>
      Post(
        `/api/samples`,
        dataToSubmit,
        this.createSampleSuccess,
        this.createSampleError,
        this.load
      );
    createSampleSuccess = () => {
      this.getSamples();
      this.setState({ showCreateModal: false });
      requestSuccess(
        "You have successfully created a sample.",
        "Success"
      );
    };
    createSampleError = (error) => {
      this.setState({ errors: error.info });
      requestError(error.message, "Error")
    };

    updateSample = (dataToSubmit) =>
      Put(
        `/api/samples/${this.state.selectedSample.id}`,
        dataToSubmit,
        this.updateSampleSuccess,
        this.updateSampleError,
        this.load
      );
    updateSampleSuccess = () => {
      this.getSamples();
      this.setState({ showUpdateModal: false });
      requestSuccess(
        "You have successfully updated the job position.",
        "Success"
      );
    };
    updateSampleError = (error) => {
      this.setState({ errors: error.info });
      requestError(error.message, "Error")    
    };

    render = () => {
      return (
        <>
          <WrappedComponent
            {...this.props}
            {...this.state}
            onLoadSample={this.state.loading}

            getSamples={this.getSamples}
            getSelectedSample={this.getSelectedSample}
            createSample={this.createSample}
            updateSample={this.updateSample}
            onChangeSampleHOC={this.onChangeSampleHOC}
          />
        </>
      );
    };
  }
  const mapStateToProps = state => ({data: state})
	return connect(mapStateToProps, {setPath})(WithHOC);
};

export default HOC;
