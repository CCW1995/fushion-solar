import React from "react";
import { Badge } from "reactstrap";

export default function Badges({
	content,
	color, //success, primary, secondary, danger, warning
	style,
	className,
	containerStyle,
	containerClass,
}) {
	return (
		<div style={containerStyle || {}} className={containerClass || ""}>
			<Badge
				color={color || "primary"}
				className={className || ""}
				style={{
					textTransform: "uppercase",
					fontSize: "12px",
					fontWeight: 500,
					width: "max-content",
					...style,
				}}>
				{content}
			</Badge>
		</div>
	);
}
