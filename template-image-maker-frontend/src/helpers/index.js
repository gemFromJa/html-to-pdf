/**
 *
 * @param {Object} data
 * @returns
 */
function buildFormData(formData, data, parentKey) {
	if (Array.isArray(data) && data.some(file => file instanceof File)) {
		data.forEach(field => buildFormData(formData, field, `${parentKey}`));
	} else if (data && typeof data === "object" && !(data instanceof Date) && !(data instanceof File)) {
		Object.keys(data).forEach(key => {
			buildFormData(formData, data[key], parentKey ? `${parentKey}[${key}]` : key);
		});
	} else {
		const value = /*  data == null ? null : */ data;

		formData.append(parentKey, value);
	}
}

export function jsonToFormData(data) {
	const formData = new FormData();

	buildFormData(formData, data);

	return formData;
}

export async function fileToText(file) {
	if (!(file instanceof File)) throw new Error("Not A file");

	let reader = new FileReader();

	return new Promise((resolve, reject) => {
		try {
			reader.onload = function (e) {
				let contents = e.target.result;
				resolve(contents);
			};
			reader.readAsText(file);
		} catch (error) {
			reject(error);
		}
	});
}
