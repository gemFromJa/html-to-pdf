import Button from "components/button";
import { H4 } from "components/misc";
import { fileToText } from "helpers";
import React, { Suspense, useEffect, useRef, useState } from "react";
import Dropzone, { useDropzone } from "react-dropzone";

import "./preview.scss";

/**
 * Preview the html that user uploads
 *
 * @param {*} param0
 * @returns
 */
export function _Preview({ template, setTemplate }) {
	return (
		<div>
			<h4>Preview</h4>
			<Dropzone></Dropzone>
		</div>
	);
}

/**
 * Preview the html that user uploads
 *
 * @param {Object} props
 * @param {Object=} props.acceptedFileTypes
 * @param {Object} props.onDrop
 * @param {Object=} props.deleteItem
 * @param {Object=} props.template
 * @param {Object=} props.showPreview =
 * @param {Object=} props.actionCallback
 * @param {Object=} props.onFileDialogCancel
 * @param {Object=} props.onFileDialogCancel
 * @param {String=} props.message
 * @params {...props} props.props
 * @returns
 */
export default function Preview({ acceptedFileTypes = [".html"], onDrop, deleteItem, template: value }) {
	const [dangerousText, setDangerousText] = useState(null);
	const ref = useRef(null);

	useEffect(() => {
		let changePreview = async () => {
			if (value) {
				let text = await fileToText(value);
				if (text && ref.current) {
					ref.current.src = "data:text/html;charset=utf-8," + encodeURIComponent(text);
					setDangerousText(text);
				}
			}
		};

		if (value) {
			changePreview();
		} else if (dangerousText) {
			// clear text if present
			setDangerousText("");
		}
	}, [value]);

	const { getRootProps, getInputProps, open } = useDropzone({
		multiple: false,
		accept: acceptedFileTypes,
		onDrop,
		noClick: true,
	});
	return (
		<div className="preview-container">
			<div {...getRootProps({ style: { height: "100%" } })}>
				<input {...getInputProps()} />
				{/* don't show a preview for multiple drops */}
				{value ? (
					<div className="content-preview">
						<H4>Preview</H4>
						<div className="preview-header">
							<div className="filename">Template Uploaded</div>

							<div
								onClick={() => {
									setTimeout(open, 100);
								}}
								className="action"
							>
								change
							</div>
							<div
								onClick={() => {
									setTimeout(deleteItem, 100);
								}}
								className="action"
							>
								remove
							</div>
						</div>
						<Suspense fallback={<div>loading...</div>}>
							<iframe
								title="Template Preview"
								className="preview-iframe"
								dangerouslySetInnerHTML={{ __html: dangerousText }}
								ref={ref}
							></iframe>
						</Suspense>
					</div>
				) : (
					<div className="fake-drop-area">
						<div className="wrapper">
							<h3 className="message">Drop Html</h3>
							<Button text="upload" onClick={open} className="upload-button" />
						</div>
					</div>
				)}
			</div>
		</div>
	);
}
