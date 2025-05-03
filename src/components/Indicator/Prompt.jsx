import React from "react";
import { Modal, ModalHeader, ModalBody, ModalFooter, Button } from "reactstrap";

const PromptModal = ({ showPromptModal, onClickYes, onClickNo, content }) => {
  return (
    <Modal isOpen={showPromptModal} size={"md"}>
      <ModalHeader>Confirmation modal</ModalHeader>
      <ModalBody>{content}</ModalBody>
      <ModalFooter>
        <Button color="primary" onClick={onClickYes}>
          Yes
        </Button>
        <Button color="danger" onClick={onClickNo}>
          No
        </Button>
      </ModalFooter>
    </Modal>
  );
};

export default PromptModal;
