import React from "react"
import * as AntdIcons from '@ant-design/icons'
import * as FeatherIcons from 'react-icons/fi'

// Import SVGs using import.meta.glob
const customIcons = import.meta.glob('/src/assets/Icons/*.svg', { eager: true });

const ERPIcon = props => {
  const {
    className,
    style,
    antIcon,
    featherIcon,
    onClick,
    custom
  } = props

  if (custom) {
    // Create a mapping of filename (without extension) to SVG module
    const iconMap = Object.entries(customIcons).reduce((acc, [path, module]) => {
      // Extract just the filename without extension
      const name = path.split('/').pop().replace('.svg', '');
      acc[name] = module.default;
      return acc;
    }, {});

    // Check if the requested custom icon exists
    if (!iconMap[custom]) {
      console.warn(`Custom icon '${custom}' not found`);
      return null;
    }

    return (
      <img
        src={iconMap[custom]}
        className={className || ""}
        style={style}
        onClick={onClick}
        alt={`${custom} icon`}
      />
    )
  }

  if (antIcon) {
    const Component = AntdIcons[antIcon];
    if (!Component) {
      console.warn(`Ant icon '${antIcon}' not found`);
      return null;
    }
    return <Component className={className} style={style} onClick={onClick} />
  }

  if (featherIcon) {
    const Component = FeatherIcons[featherIcon];
    if (!Component) {
      console.warn(`Feather icon '${featherIcon}' not found`);
      return null;
    }
    return <Component className={className} style={style} onClick={onClick} />
  }

  return (
    <i style={style} className={className || ""} onClick={onClick} />
  )
}

export default ERPIcon