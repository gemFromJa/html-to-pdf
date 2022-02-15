import Preview from "components/preview";
import { useState } from "react";
import Form from "components/Form";
import { defaultValues } from "./constants";
import { parseDocuments } from "network";

// style stuff
import "./App.scss";

function App() {
	const [template, setTemplate] = useState(null);
	const [formValue, setFormValue] = useState(defaultValues);
	const [formError, setFormError] = useState(defaultValues);
	const [appError, setAppError] = useState(""); // global app level errors
	const [isLoading, setIsLoading] = useState(false);

	const checkObjFields = (object, check) => Object.keys(object).every(key => check(object[key]));
	const isValid =
		checkObjFields(formValue, val => val) && checkObjFields(formError, val => !val) && template instanceof File;
	const setFieldValues = (field, value) => {
		if (field) {
			setFormValue({ ...formValue, [field]: value });
		}
	};

	const validate = field => {
		let value = formValue?.[field];
		let error;

		if (!value) {
			error = "must not be empty";
		}

		setFormError({
			...formError,
			[field]: error,
		});
	};

	const submitVal = async () => {
		setIsLoading(true);

		try {
			// format the data right
			let { type, fields, data } = formValue;

			let fieldNames = fields
				.split(",")
				.map(e => e.trim())
				.filter(f => f);

			let linesOfData = data.split("\n");
			let resultingData = linesOfData.reduce(
				(result, currentLine) => [
					...result,
					currentLine.split(",").reduce((obj, field, index) => {
						let fieldName = fieldNames[index];
						// @ts-expect-error
						return { ...obj, [fieldName]: field };
					}, {}),
				],
				[]
			);

			let res = await parseDocuments({
				html: template,
				data: resultingData,
				type,
			});

			if (res.success) {
				const tempLink = document.createElement("a");
				tempLink.style.display = "none";
				document.body.appendChild(tempLink);

				tempLink.innerHTML = "Download PDF file";
				tempLink.download = `${type}_documents.zip`;
				tempLink.href = "data:application/zip;base64," + res.file;
				tempLink.click();

				document.body.removeChild(tempLink);
			}

			if (appError) setAppError("");
		} catch (error) {
			setAppError(error.message);
		} finally {
			setIsLoading(false);
		}
	};

	return (
		<div className="app-container">
			<div className={`loader ${isLoading ? "loading" : ""}`}>
				<p className="load-indicator">
					Loading
					<span>.</span>
					<span>.</span>
					<span>.</span>
				</p>
			</div>
			<Preview
				deleteItem={() => setTemplate(null)}
				template={template}
				onDrop={(file, files) => {
					setTemplate(file[0]);
				}}
			/>
			<Form
				values={formValue}
				errors={formError}
				setFieldValue={setFieldValues}
				onBlurValidator={validate}
				submit={submitVal}
				canSubmit={isValid === true}
				appError={appError}
			/>
		</div>
	);
}

export default App;
