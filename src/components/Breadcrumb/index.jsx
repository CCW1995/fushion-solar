import React from "react";
import { Breadcrumb, BreadcrumbItem } from "reactstrap";
import { connect } from 'react-redux'

import "./index.scss";

const BreadcrumbComponent = ({
  styles = {
    color: "black",
  },
  pathData,
  data
}) => {
  const { currentState = [] } = data.PathReducer
  return (
    <Breadcrumb>
      { pathData || currentState.map((item, index) => (
        <BreadcrumbItem
          key={index}
          style={{
            display: "flex",
            alignItems: 'center',
            paddingTop: "10px",
          }}
        >
          <div
            style={{
              fontWeight:
                index === currentState.length - 1 ? "bold" : "normal",
            }}
          >
            <span 
              style={{ ... styles, cursor: 'pointer' }}
              onClick={  () => item.onClick ? item.onClick() : {}}
            >
              {item?.label}
            </span>
          </div>
        </BreadcrumbItem>
      ))}
    </Breadcrumb>
  );
};

const mapStateToProps = (state) => ({ data: state });
export default connect(mapStateToProps)(BreadcrumbComponent);
