import React from "react";
import _ from "lodash";

import CustomModal from "./";

const Confirmation = ({
  title,
  isOpen,
  message,
  leftActionText,
  rightActionText,
  hideLeftAction = false,
  hideRightAction = false,
  customFooter,
  customFooterClass,

  onClose,
  onClickLeftAction,
  onClickRightAction,
}) => {
  return (
    <CustomModal
      title={title || 'Confirmation'}
      isOpen={isOpen}
      leftActionText={!hideLeftAction ? (leftActionText || 'Cancel') : ''}
      rightActionText={!hideRightAction ? (rightActionText || 'OK') : ''}
      customFooter={customFooter}
      customFooterClass={customFooterClass}
      onClickLeftAction={onClickLeftAction}
      onClickRightAction={onClickRightAction}
      onClose={onClose}
    >
      {message}
    </CustomModal>
  );
};

export default Confirmation;
