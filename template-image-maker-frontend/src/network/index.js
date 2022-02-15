import axios from "axios";
import { jsonToFormData } from "helpers";

/**
 * request api parse the document with data
 *
 * @param {Object} param
 */
const parseDocuments = async ({ html, data, type, section }) => {
	let payload = jsonToFormData({ html, data, type, section });
	let endpoint = `${process.env.REACT_APP_API_URL}/parse`;

	let res = await axios.post(endpoint, payload, {
		headers: {
			"Content-Type": "multipart/form-data",
		},
	});

	return res.data;
};

export { parseDocuments };
