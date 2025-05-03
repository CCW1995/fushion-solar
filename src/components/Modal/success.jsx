import React from "react";
import { HiOutlineCheckCircle } from "react-icons/hi";
import { Modal, ModalHeader, ModalBody } from "reactstrap";
import _ from "lodash";

import LoadingOverlay from "components/Indicator/LoadingOverlay";
import ERPIcon from "components/Icon"

const Confirmation = ({
  size,
  title,
  isOpen,
  loading,
  message,

  onClose,
}) => {

  const closeButton = (
    <button className="custom-modal-close" onClick={onClose} >
      <ERPIcon custom='x'/>
    </button>
  )

  return (
    <>
      <Modal className="custom-modal" isOpen={isOpen} size={size || 'md'}>
        <ModalHeader close={ closeButton } />
        <ModalBody>
          <div className="custom-modal-success">
            <HiOutlineCheckCircle />
            <div>
              { title && <p>{ title }</p> }
              { message }
            </div>
          </div>
        </ModalBody>
      </Modal>
      {loading && <LoadingOverlay />}
    </>
  );
};

export default Confirmation;
