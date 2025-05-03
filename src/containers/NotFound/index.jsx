import { useEffect, useState } from "react";
import { connect } from "react-redux";
import { Button } from "reactstrap";

import WithHOC from "./action";
import { setPath } from "actions/path";
import { getItem } from "utils/tokenStore";

import "./index.scss";


const NotFound = (props) => {
  const {
    location,
    logNotFound
  } = props

  const [from, setFrom] = useState(window.location.href)

  useEffect(() => {
    const location = window.location.href
    setFrom(location)
    logNotFound(location)
  }, [location.pathname])

  useEffect(() => {
    props.setPath([
      { label: "404 Not Found" }
    ])
  }, [])

  return (
    <div className="not-found">
      <p className="title">404 Not Found</p>
      {from && (
        <p className="subtitle">Attempted to visit non-existing link of: <br/> <u>{from}</u></p>
      )}

      <Button
        color="primary"
        onClick={() => {
          if (getItem("ERP_ACCESS_TOKEN")) {
            props.history.push("/dashboard");
          } else {
            props.history.push("/login");
          }
        }}
      >
        Return to {getItem("ERP_ACCESS_TOKEN") ? "Dashboard" : "Login"}
      </Button>
    </div>
  )
}

const mapStateToProps = (state) => ({ data: state });
export default connect(mapStateToProps, { setPath })(WithHOC(NotFound));