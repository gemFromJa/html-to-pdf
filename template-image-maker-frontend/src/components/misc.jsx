/**
 *
 * @param {*=} param0
 * @returns
 */
export const H4 = ({ style, children, ...props }) => {
	return (
		<h1
			style={{
				fontSize: "24px",
				margin: "1rem",
				textAlign: "center",
				color: "#707070",
				...(style && Object.keys(style).length ? style : {}),
			}}
		>
			{children}
		</h1>
	);
};

export const ErrorField = ({ text }) => <div style={{ fontSize: "12px", color: "#dc3545" }}> {text}</div>;
