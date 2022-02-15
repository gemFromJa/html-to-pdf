const { IMAGE, PDF } = require("../helpers/constants");

/**
 *
 * @param {Object} req
 * @param {Object} req.body
 * @param {String} req.body.type
 * @param {String} req.body.data
 * @param {File} req.body.html
 * @param {String=} req.body.section
 * @param {Object || Object[]} req.body.data
 * @param {*} res
 * @param {*} next
 * @returns
 */
function paramValidator(req, res, next) {
	let errors = [];

	if (!req.body.data) {
		errors.push("Data required for use on form");
	}

	let html = req.files?.["html"];

	if (!html) {
		errors.push("Upload an HTML template to continue");
	}

	let type = req?.body?.type?.trim()?.toLowerCase(); // the type of file we'll make

	if (type !== IMAGE && type !== PDF) {
		errors.push(`Invalid type ${req.body.type}`);
	}

	if (errors.length) {
		return res.status(409).send({
			success: false,
			error_message: `Api reports the following errors: ${errors.join(
				", "
			)}`,
		});
	}

	req.body.type = type; // ensure  data format properly

	next();
}

module.exports = paramValidator;
