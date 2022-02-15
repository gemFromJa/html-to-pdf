import React from "react";

import "./switchButtons.scss";

/**
 *
 * @param {Object} props
 * @param {String} props.option1
 * @param {String} props.option2
 * @param {Function} props.onClickOption,
 * @param {String} props.selected
 * @returns
 */
export default function SwitchButton({ option1, option2, onClickOption, selected }) {
	return (
		<div className="switch-buttons">
			<button className={`${selected === option1 ? "active" : ""}`} onClick={() => onClickOption(option1)}>
				{option1}
			</button>
			<button className={`${selected === option2 ? "active" : ""}`} onClick={() => onClickOption(option2)}>
				{option2}
			</button>
		</div>
	);
}
