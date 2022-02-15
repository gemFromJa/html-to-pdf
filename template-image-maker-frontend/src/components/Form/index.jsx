import React from "react";
import Button from "components/button";
import LabeledInput from "components/LabeledInput";
import SwitchButton from "components/SwitchButton";
import { H4, ErrorField } from "components/misc";

// css and such
import "./form.scss";

export default function Form({ values, errors, setFieldValue, onBlurValidator, submit, canSubmit, appError }) {
	return (
		<div className="form-container">
			<H4>Enter Data</H4>
			<LabeledInput
				label={
					<span>
						Field <small>(columns)</small>
					</span>
				}
				value={values["fields"]}
				onChange={e => {
					setFieldValue("fields", e.target.value);
				}}
				onBlur={() => onBlurValidator("fields")}
			/>
			{(errors?.["fields"] && <ErrorField text={errors["fields"]} />) || null}
			<LabeledInput
				label={"Data"}
				value={values["data"]}
				multiline={true}
				onChange={e => {
					setFieldValue("data", e.target.value);
				}}
				onBlur={() => onBlurValidator("data")}
			/>
			{(errors?.["data"] && <ErrorField text={errors["data"]} />) || null}
			<div className="button-group">
				<SwitchButton
					option1={"PDF"}
					option2="IMG"
					onClickOption={option => setFieldValue("type", option)}
					selected={values["type"]}
				/>
				<Button className="submit-btn" text="done" onClick={submit} disabled={canSubmit === false} />
			</div>
			{(errors?.["type"] && <ErrorField text={errors["type"]} />) || null}
			{(appError && <ErrorField text={appError} />) || null}
		</div>
	);
}
