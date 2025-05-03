import React from "react";

import CustomButton from "components/Button";

const ImagePreview = (props) => {
  return (
    <div
      className="loader-container"
      style={{
        position: "fixed",
        backgroundColor: "rgba(0,0,0,0.3)",
        top: 0,
        left: 0,
        zIndex: 999,
        gap: 16,
        flexDirection: "column",
      }}
    >
      <img src={props.src} alt={props.alt} style={{ maxWidth: 500, borderRadius: 8 }} />
      <CustomButton
        color="white"
        onClick={() =>
          props.onClose()
        }>
        Close
      </CustomButton>
    </div>
  );
};

export default ImagePreview;
