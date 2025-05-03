import React, { Component } from "react";
import { compose } from "redux";
import { Card, CardBody } from "reactstrap";
import { Row, Col } from "antd";
import _ from "lodash";

import PageTitle from "components/Title/PageTitle";
import LoadingOverlay from "components/Indicator/LoadingOverlay";
import ERPTable from "components/Table";

import UsersHOC from "./actions/index";
import CompanyHOC from "./actions/company";

class Users extends Component {
	componentDidMount = () => {
		// this.props.getUsers()
	};

	render = () => {
		return (
			<>
				<PageTitle
					heading={"Users"}
					subheading={"Listings of all the users present in the system."}
					icon="pe-7s-user icon-gradient bg-happy-itmeo"
					buttons={[
						{
							color: "primary",
							onClick: () => {
								this.props.onChangeUserHOC("showCreateModal", true);
							},
							content: "Create User",
						},
					]}
				/>
				<Row gutter={16}>
					<Col span={24}>
						<Card className="main-card mb-3">
							<CardBody>
								<ERPTable
									pageSize={10}
									data={this.props.users}
									columns={[
										{
											Header: "Name",
											Cell: (row) => {
												return (
													<p>{`${row.original?.first_name ?? ""} ${
														row.original?.last_name ?? ""
													}`}</p>
												);
											},
										},
										{
											Header: "Email",
											accessor: "email",
										},
										{
											Header: "Contact",
											Cell: (row) => (
												<p>{row.original.mobile_contact || "N/A"}</p>
											),
										},
										{
											Header: "Role",
											accessor: "role_name",
										},
									]}
									showPagination={true}
								/>
							</CardBody>
						</Card>
					</Col>
				</Row>
				{this.props.onLoadUsers && <LoadingOverlay />}
			</>
		);
	};
}

export default compose(CompanyHOC, UsersHOC)(Users);
