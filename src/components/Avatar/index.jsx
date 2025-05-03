import React from "react"
import ERPIcon from "components/Icon"

import "./index.scss"

const CustomAvatar = ({
  containerStyle,
  imageStyle,
  imageUrl,
  imageAlt,
  imageWidth = "72px",
  imageHeight = "72px",
  onClick
}) => {
  const renderPlaceholder = !imageUrl || imageUrl.trim() === ""

  return (
    <div
      className="avatar-container"
      onClick={onClick}
      style={containerStyle}
    >
      {renderPlaceholder ? (
        <div
          className="avatar-placeholder"
          style={{
            width: imageWidth,
            height: imageHeight,
            ...imageStyle
          }}
        >
          <ERPIcon
            antIcon="UserOutlined"
            className="text-grey"
            style={{ fontSize: "28px" }}
          />
        </div>
      ) : (
        <img
          src={imageUrl}
          alt={imageAlt || "Profile Picture"}
          className="avatar-image"
          style={{
            width: imageWidth,
            height: imageHeight,
            ...imageStyle
          }}
        />
      )}
    </div>
  )
}

export default CustomAvatar