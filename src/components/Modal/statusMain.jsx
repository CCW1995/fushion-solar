import React from "react";
import { HiOutlineExclamation, HiOutlineCheckCircle } from "react-icons/hi";
import { Button } from "reactstrap";
import _ from "lodash";

import LoadingOverlay from "components/Indicator/LoadingOverlay";

const StatusMain = ({
  mode, //warning, success, error
  title,
  isOpen,
  loading,
  message,
  dismissText,

  onClose,
}) => {

  return (
    <>
      <div className="app-main__dialog" style={{ display: isOpen ? 'inherit' : 'none' }}>
        <div className="custom-modal text-right">
        <div className={ `custom-modal-${ mode || 'warning' }` }>
          { mode === 'success' ? <HiOutlineCheckCircle /> : <HiOutlineExclamation /> }
          <div>
            { title && <p>{ title }</p> }
            { message }
          </div>
        </div>
          <Button
            className="ml-auto mt-3"
            color="danger"
            onClick={onClose}>
            {dismissText || 'Dismiss'}
          </Button>
        </div>
      </div>
      {loading && <LoadingOverlay />}
    </>
  )
}

export default StatusMain;