import React from "react";

import "./labelInput.scss";

/* const DataSource = ({ multiline, ...props }) => React.createElement(multiline ? "textarea" : "input", props);
export default function LabeledInput({ label, value, onChange, onBlur, multiline = false }) {
	return (
		<div className="label-input-container">
			<label>{label}</label>
			<DataSource multiline={multiline} onChange={onChange} value={value} onBlur={onBlur} />
		</div>
	);
} */

const DataSource = ({ multiline, ...props }) => (multiline ? <textarea {...props} /> : <input {...props} />);
export default function LabeledInput({ label, value, onChange, onBlur, multiline = false }) {
	return (
		<div className="label-input-container">
			<label>{label}</label>
			<DataSource multiline={multiline} onChange={onChange} value={value} onBlur={onBlur} className="data-source" />
		</div>
	);
}
