import React, { Component } from "react";
import { connect } from "react-redux";
import _ from "lodash";

import { Get, Post, Put, Delete } from "utils/axios";
import { requestError, requestSuccess } from "utils/requestHandler";

const HOC = (WrappedComponent) => {
  class WithHOC extends Component {
    state = {
      loading: false,
      requestCount: 0,
      users: [],
      selectedUser: {},

      showCreateModal: false,
      showDeleteModal: false,
      showUpdateModal: false,
    };

    onChangeUserHOC = (key, val) => this.setState({ [key]: val });

    load = (param) => {
      this.setState((prevState) => {
        const newCount = param ? prevState.requestCount + 1 : prevState.requestCount - 1
        return {
          loading: newCount > 0,
          requestCount: newCount,
        }
      })
    };

    getUsers = () => {
      Get(`/users`, this.getUsersSuccess, this.getUsersError, this.load);
    };
    getUsersSuccess = (payload) => {
      let temp = _.map(payload, (user) => {
        let tempRole = _.find(this.props.data.DictionaryReducer.roles, {
          id: user.role_id,
        });

        return {
          ...user,
          role_name: tempRole?.name ?? "test",
        };
      });

      this.setState({ users: temp });
    };
    getUsersError = (error) => requestError(error, 'Error');

    getSelectedUser = (id) =>
      Get(
        `/users/${id}`,
        this.getSelectedUserSuccess,
        this.getSelectedUserError,
        this.load
      );
    getSelectedUserSuccess = (payload) => this.setState({ selected: payload });
    getSelectedUserError = (error) => requestError(error, 'Error');

    createUser = (dataToSubmit, companyId) =>
      Post(
        `/users`,
        dataToSubmit,
        (payload) => this.createUserSuccess(payload, companyId),
        this.createUserError,
        this.load
      );
    createUserSuccess = (payload, companyId) => {
      this.getUsers();
      this.setState({ showCreateModal: false });

      if (payload.role_id === 4) {
        this.props.createCompanyUser({
          user_id: payload.id,
          company_id: +companyId,
        });
      }
      requestSuccess("You have successfully created an user.", "Success");
    };
    createUserError = (error) => requestError(error.message, 'Error');

    deleteUser = (id) =>
      Delete(
        `/users/${id}`,
        this.deleteUserSuccess,
        this.deleteUserError,
        this.load
      );
    deleteUserSuccess = () => {
      this.getUsers();
      this.setState({ showDeleteModal: false });
      requestSuccess("You have successfully deleted the user.", "Success");
    };
    deleteUserError = (error) => requestError(error, 'Error');

    updateUser = (id, dataToSubmit) =>
      Put(
        `/users/${id}`,
        dataToSubmit,
        this.updateUserSucces,
        this.updateUserError,
        this.load
      );
    updateUserSucces = (payload) => {
      this.getUsers();
      this.getSelectedUser(payload.id);
      requestSuccess("You have successfully updated the user.", "Success");
    };
    updateUserError = (error) => requestError(error.message, 'Error');

    updatePW = (id, dataToSubmit) =>
      Put(
        `/users/${id}/reset_password`,
        dataToSubmit,
        this.updatePWSuccess,
        this.updatePWError,
        this.load
      );
    updatePWSuccess = () =>
      requestSuccess("You have successfully updated the password.", "Success");
    updatePWError = (error) => requestError(error.message, 'Error');

    updateCompanyID = (dataToSubmit) =>
      Put(
        ``,
        dataToSubmit,
        this.updateCompanyIDSuccess,
        this.updateCompanyIDError,
        this.load
      );
    updateCompanyIDSuccess = () =>
      requestSuccess("You have successfully updated the company ID.", "Success");
    updateCompanyIDError = (error) => requestError(error.message, 'Error');

    render = () => {
      return (
        <WrappedComponent
          {...this.props}
          users={this.state.users}
          selectedUser={this.state.selectedUser}
          onLoadUsers={this.state.loading}
          showCreateModal={this.state.showCreateModal}
          showDeleteModal={this.state.showDeleteModal}
          showUpdateModal={this.state.showUpdateModal}
          getUsers={this.getUsers}
          getSelectedUser={this.getSelectedUser}
          createUser={this.createUser}
          deleteUser={this.deleteUser}
          updateUser={this.updateUser}
          updatePW={this.updatePW}
          updateCompanyID={this.updateCompanyID}
          onChangeUserHOC={this.onChangeUserHOC}
        />
      );
    };
  }
  const mapStateToProps = (state) => ({ data: state });
  return connect(mapStateToProps)(WithHOC);
};

export default HOC;
