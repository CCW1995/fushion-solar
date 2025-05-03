import React from "react";

const CardHeader = ({
	title,
	containerStyle,
	containerClass,
	titleStyle,
	titleClass,
	customHeader,
	required
}) => {
	return (
		<div
			style={{ ...containerStyle }}
			className={`custom-card__header ${containerClass || ""}`}>
			{title && (
				<h2 style={{ ...titleStyle }} className={`text-uppercase ${titleClass || ""}`}>
					{title}
					{required && <span className="text-danger">*</span>}
				</h2>
			)}
			{customHeader && customHeader()}
		</div>
	);
};

export default CardHeader;
