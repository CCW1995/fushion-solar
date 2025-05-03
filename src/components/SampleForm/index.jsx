import React from "react";
import { Row, Col, Card, CardBody } from "reactstrap";

import "./index.scss";
import FormHeader from "./Header";
import HorizontalStep from "components/Step/horizontal";
import { Steps } from "antd";
import FormInput from "components/Input/formInput";
import CustomCard from "components/Card";
import CustomButton from "components/Button";

//Sample

{/* <CustomForm
  headerTitle={"Edit Customer"}
>
</CustomForm> */}

const CustomForm = ({
  headerTitle,
}) => {
  return (
    <>
      <Card className="form-header-card">
        <CardBody className="form-header-body">
          <FormHeader
            headerTitle={headerTitle}
            subheaders={[
              {
                subheaderLabel: "Customer Name",
                subheaderContent: "John Doe",
              },
              {
                subheaderLabel: "GST No.",
                subheaderContent: "-",
              },
              {
                subheaderLabel: "Customer ID",
                subheaderContent: "0030",
              },
              {
                subheaderLabel: "Customer Group",
                subheaderContent: "Trade Debter",
              },
              {
                subheaderLabel: "Registration No.",
                subheaderContent: "123456",
              },
              {
                subheaderLabel: "Customer Type",
                subheaderContent: "Corporation",
              },
            ]}>
          </FormHeader>

          <HorizontalStep
            containerStyle={{ width: "50%", paddingTop: "16px" }}
            size={"small"}
            type={"default"}
            items={[
              {
                title: "Customer Info",
              },
              {
                title: "Add Sales Rep",
              },
              {
                title: "Documents",
              },
              {
                title: "Terms & Conditions",
              },
            ]}
          >
          </HorizontalStep>
        </CardBody>
      </Card>

      <Row>
        <Col xl={9} lg={8} md={6} sm={12} style={{ padding: "16px" }}>
          <CustomCard
            mode={"default"}
            containerClass={"card-content"}
            children={
              <>
                <div className="form-card-title">1. CUSTOMER INFO</div>
                <Row>
                  <Col xl={3} lg={4} md={6} sm={12}>
                    <FormInput
                      type={"cust-id"}
                      value={""}
                      label={"Customer ID"}
                      errors={""}
                      context={"cust-id"}
                      required={true}
                      placeholder={"A00-0000"}
                      onChangeData={() => { }}
                    >
                    </FormInput>
                  </Col>

                  <Col xl={3} lg={4} md={6} sm={12}>
                    <FormInput
                      type={"cust-name"}
                      value={""}
                      label={"Customer Name"}
                      errors={""}
                      context={"cust-name"}
                      required={true}
                      placeholder={"ABC Sdn Bhd"}
                      onChangeData={() => { }}
                    >
                    </FormInput>
                  </Col>

                  <Col xl={3} lg={4} md={6} sm={12}>
                    <FormInput
                      type={"gst-no"}
                      value={""}
                      label={"GST No."}
                      errors={""}
                      context={"gst-no"}
                      required={false}
                      placeholder={"0-000"}
                      onChangeData={() => { }}
                    >
                    </FormInput>
                  </Col>

                  <Col xl={3} lg={4} md={6} sm={12}>
                    <FormInput
                      value={null}
                      label={"Date GST Status Verified"}
                      errors={[]}
                      context={"date-gst-status-verified"}
                      required={false}
                      placeholder={"Select a date"}
                      onChangeData={() => { }}
                    >
                    </FormInput>
                  </Col>

                  <Col>
                    <CustomCard
                      mode={"borderless"}
                      children={
                        <>
                          <Row>
                            <Col xl={6} lg={6} md={12} sm={12}>
                              <b className="inner-content-title">GC Control Account</b>
                              <p className="inner-content-desc">Debtor A/C</p>
                            </Col>

                            <Col xl={3} lg={4} md={6} sm={12}>
                              <FormInput
                                value={[]}
                                label={"COA"}
                                errors={[]}
                                context={"typeahead"}
                                required={false}
                                placeholder={"Select"}
                                onChangeData={() => { }}
                              >
                              </FormInput>
                            </Col>

                            <Col xl={3} lg={4} md={6} sm={12}>
                              <FormInput
                                value={[]}
                                label={"Analysis Code"}
                                errors={[]}
                                context={"typeahead"}
                                required={false}
                                placeholder={"Select"}
                                onChangeData={() => { }}
                              >
                              </FormInput>
                            </Col>
                          </Row>
                        </>
                      }
                    >
                    </CustomCard>
                  </Col>
                </Row>
              </>
            }
          />
          <hr></hr>
          <div className="button-row">
            <Col style={{ display: "contents" }}>
              <CustomButton
                color={"white"}
                size={"sm"}
                onClick={true}
                children={"Cancel"}>
              </CustomButton>
            </Col>

            <Col style={{ display: "contents" }}>
              <CustomButton
                color={"red"}
                size={"sm"}
                onClick={true}
                children={"Continue"}>
              </CustomButton>
            </Col>
          </div>
        </Col>

        <Col xl={3} lg={4} md={6} sm={12} style={{ padding: "16px" }}>
          <CustomCard
            mode={"default"}
            containerClass={"card-content"}
            children={
              <>
                <div className="form-card-title">ADDRESS</div>
                <Row>
                  <Col xl={12} lg={12} md={12} sm={12}>
                    <FormInput
                      type={"address"}
                      value={""}
                      label={"Address"}
                      errors={""}
                      context={"address"}
                      required={false}
                      placeholder={"Address"}
                      onChangeData={() => { }}
                    >
                    </FormInput>
                  </Col>

                  <Col xl={6} lg={6} md={6} sm={12}>
                    <FormInput
                      type={"postcode"}
                      value={""}
                      label={"Postcode"}
                      errors={""}
                      context={"postcode"}
                      required={false}
                      placeholder={"Postcode"}
                      onChangeData={() => { }}
                    >
                    </FormInput>
                  </Col>

                  <Col xl={6} lg={6} md={6} sm={12}>
                    <FormInput
                      type={"city"}
                      value={""}
                      label={"City"}
                      errors={""}
                      context={"city"}
                      required={false}
                      placeholder={"City"}
                      onChangeData={() => { }}
                    >
                    </FormInput>
                  </Col>

                  <Col xl={6} lg={6} md={6} sm={12}>
                    <FormInput
                      type={"state"}
                      value={""}
                      label={"State"}
                      errors={""}
                      context={"state"}
                      required={false}
                      placeholder={"State"}
                      onChangeData={() => { }}
                    >
                    </FormInput>
                  </Col>

                  <Col xl={6} lg={6} md={6} sm={12}>
                    <FormInput
                      type={"country"}
                      value={""}
                      label={"Country"}
                      errors={""}
                      context={"country"}
                      required={false}
                      placeholder={"Country"}
                      onChangeData={() => { }}
                    >
                    </FormInput>
                  </Col>

                  <Col>
                    <CustomCard
                      mode={"borderless"}
                      children={
                        <>
                          <Row>
                            <Col xl={12} lg={12} md={12} sm={12}>
                              <b className="inner-content-title">Contact Person</b>
                            </Col>

                            <Col xl={6} lg={6} md={12} sm={12}>
                              <FormInput
                                type={"text"}
                                value={""}
                                label={"Name"}
                                errors={""}
                                context={"contact-person-name"}
                                required={true}
                                placeholder={"Name"}
                                onChangeData={() => { }}
                              >
                              </FormInput>
                            </Col>

                            <Col xl={6} lg={6} md={12} sm={12}>
                              <FormInput
                                type={"text"}
                                value={""}
                                label={"Title"}
                                errors={""}
                                context={"title"}
                                required={false}
                                placeholder={"Title"}
                                onChangeData={() => { }}
                              >
                              </FormInput>
                            </Col>

                            <Col xl={12} lg={12} md={12} sm={12}>
                              <FormInput
                                type={"number"}
                                value={""}
                                label={"Contact No."}
                                errors={""}
                                context={"phone-number"}
                                required={true}
                                placeholder={"Contact No."}
                                onChangeData={() => { }}
                              >
                              </FormInput>
                            </Col>
                          </Row>
                        </>
                      }
                    >
                    </CustomCard>
                  </Col>
                </Row>
              </>
            }
          />
        </Col>
      </Row>
    </>
  );
};

export default CustomForm;
