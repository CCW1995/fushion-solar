import React from "react";
import { Steps } from "antd";
import "./vertical.scss";

// !Sample!
{
	/* <VertialStep
	items={[
		{
			title: "Payment voucher approved",
			subTitle: Approved,
			description: (
				<>'Payment voucher approved by Ms Ang' 08/09/2023, at 15:30pm</>
			),
		},
		{
			title: "Step 2",
			subTitle: "00:01:02",
			description: "This is a description.",
		},
		{
			title: "Step 3",
			subTitle: "waiting for longlong time",
			description: "This is a description.",
		},
	]}
/>; */
}

export default function Step({
	currentStep,
	items,
	containerStyle,
	containerClass,
}) {
	return (
		<div
			style={containerStyle || {}}
			className={`custom-vert-steps ${containerClass || ""}`}>
			<Steps
				current={currentStep}
				progressDot
				direction={"vertical"}
				items={items}
			/>
		</div>
	);
}
