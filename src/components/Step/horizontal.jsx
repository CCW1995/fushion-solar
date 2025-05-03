import React from "react";
import { Steps } from "antd";
import "./horz.scss";

// !Sample!
{
	/* <HorizontalStep
	containerStyle={{ width: "100%" }}
	items={[
		{
			title: "1. Customer Info",
			// subTitle: '00:00:05',
			// description: 'This is a description.',
		},
		{
			title: "2. Add Sales Rep",
			// subTitle: '00:01:02',
			// description: 'This is a description.',
		},
		{
			title: "3. Documents",
			// subTitle: 'waiting for longlong time',
			// description: 'This is a description.',
		},
		{
			title: "4. Terms & Conditions",
			// subTitle: 'waiting for longlong time',
			// description: 'This is a description.',
		},
	]}
/> */
}

export default function Step({
	items,
	currentStep,
	size,
	containerClass,
	containerStyle,
}) {
	return (
		<div style={{ ...containerStyle }} className={`${containerClass || ""}`}>
			<Steps
				direction={"horizontal"}
				progressDot={false}
				current={currentStep}
				type={"navigation"}
				size={size || "default"}
				items={items}
			/>
		</div>
	);
}
