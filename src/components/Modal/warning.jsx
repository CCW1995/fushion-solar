import React from "react";
import { HiOutlineExclamation } from "react-icons/hi";
import { Modal, ModalHeader, ModalBody, ModalFooter, Button } from "reactstrap";
import _ from "lodash";

import LoadingOverlay from "components/Indicator/LoadingOverlay";
import ERPIcon from "components/Icon"

const WarningModal = ({
  size,
  mode, //warning, error
  title,
  isOpen,
  loading,
  message,
  modalTitle,
  rightActionText,

  onClose,
  onClickRightAction,
}) => {

  const closeButton = (
    <button className="custom-modal-close" onClick={onClose} >
      <ERPIcon custom='x'/>
    </button>
  )

  return (
    <Modal className="custom-modal" isOpen={isOpen} size={size || 'md'}>
      <ModalHeader close={ closeButton }>{modalTitle || 'Warning'}</ModalHeader>
      <ModalBody>
        <div className={ `custom-modal-${ mode || 'warning' }` }>
          <HiOutlineExclamation />
          <div>
            { title && <p>{ title }</p> }
            { message }
          </div>
        </div>
      </ModalBody>
      <ModalFooter>
        <Button className="ml-auto" color="danger" onClick={onClickRightAction}>
          {rightActionText || 'Yes'}
        </Button>
      </ModalFooter>
      {loading && <LoadingOverlay />}
    </Modal>
  );
};

export default WarningModal;
