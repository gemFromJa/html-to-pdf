import React from "react";

import "./button.scss";

export default function Button({ className = "", onClick, text, disabled = false }) {
	return (
		<button className={`custom-btn ${className || ""} `} type="button" onClick={onClick} disabled={disabled}>
			{text}
		</button>
	);
}
