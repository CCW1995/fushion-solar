import React from "react";
import CustomButton from "components/Button";

const CardFooter = ({ leftButtons, rightButtons }) => {
	return (
		<div className="custom-card__footer">
			<div>
				{leftButtons &&
					leftButtons.length > 0 &&
					leftButtons.map((leftButton) => (
						<CustomButton
							{ ... leftButton }
						/>
					))}
			</div>
			<div>
				{rightButtons &&
					rightButtons.length > 0 &&
					rightButtons.map((rightButton) => (
						<CustomButton
							{ ... rightButton }
						/>
					))}
			</div>
		</div>
	);
};

export default CardFooter;
