import React, { Component } from "react";
import { connect } from "react-redux";

import { Get, Post, Put } from "utils/axios";
import { requestError, requestSuccess } from "utils/requestHandler";

const HOC = (WrappedComponent) => {
  class WithHOC extends Component {
    state = {
      loading: false,
      requestCount: 0,
      companies: [],
      selectedCompanyUser: null,
    };

    onChangeCompanyHOC = (key, val) => this.setState({ [key]: val });

    load = (param) => {
      this.setState((prevState) => {
        const newCount = param ? prevState.requestCount + 1 : prevState.requestCount - 1
        return {
          loading: newCount > 0,
          requestCount: newCount,
        }
      })
    };

    getCompanies = () =>
      Get(
        `/companies`,
        this.getCompanysSuccess,
        this.getCompanysError,
        this.load
      );
    getCompanysSuccess = (payload) => this.setState({ companies: payload });
    getCompanysError = (error) => requestError(error, 'Error');

    getCompanyUser = (id) =>
      Get(
        `/users/${id}/company`,
        this.getCompanyUserSuccess,
        this.getCompanyUserError,
        this.load
      );
    getCompanyUserSuccess = (payload) =>
      this.setState({ selectedCompanyUser: payload });
    getCompanyUserError = (error) => requestError(error, 'Error');

    updateCompanyUser = (id, companyId) =>
      Put(
        `/users/${id}/update_company`,
        { company_id: companyId },
        this.updateCompanyUserSuccess,
        this.updateCompanyUserError,
        this.load
      );
    updateCompanyUserSuccess = (payload) => {
      this.getCompanyUser(payload.user_id);
      requestSuccess("You have successfully updated the company user.", "Success");
    };
    updateCompanyUserError = (error) => requestError(error.message, 'Error');

    createCompanyUser = (dataToSubmit) =>
      Post(
        `/companies/${dataToSubmit.company_id}/users `,
        dataToSubmit,
        this.createCompanyUserSuccess,
        this.createCompanyUserError,
        this.load
      );
    createCompanyUserSuccess = (payload) =>
      requestSuccess("You have successfully created a company user.", "Success");
    createCompanyUserError = (error) => requestError(error.message, 'Error');

    render = () => {
      return (
        <WrappedComponent
          {...this.props}
          companies={this.state.companies}
          onLoadCompanies={this.state.loading}
          selectedCompanyUser={this.state.selectedCompanyUser}
          getCompanies={this.getCompanies}
          getCompanyUser={this.getCompanyUser}
          createCompanyUser={this.createCompanyUser}
          updateCompanyUser={this.updateCompanyUser}
          onChangeCompanyHOC={this.onChangeCompanyHOC}
        />
      );
    };
  }
  const mapStateToProps = (state) => ({ data: state });
  return connect(mapStateToProps)(WithHOC);
};

export default HOC;
