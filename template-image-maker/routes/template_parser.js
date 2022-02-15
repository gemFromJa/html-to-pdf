const express = require("express");
const multer = require("multer");
const clean = require("../helpers/clean");
const parse_template = require("../helpers/parse_template");
const paramValidator = require("../middleware/param_validator");
const JSZip = require("jszip");
const router = express.Router();

const upload = multer();

// multipart file uploads here
router.post(
	"/",
	[upload.fields([{ name: "html", maxCount: 1 }]), paramValidator],
	async (req, res) => {
		// parse the file into a sanitized string
		let { data, type } = req.body;
		let html = req.files["html"][0];

		try {
			let cleanHtml = clean(html?.buffer?.toString()); // remove dangerous tags and what not

			let resultingFiles = await parse_template({
				html: cleanHtml,
				data,
				type,
			});

			let zip = new JSZip();
			let rootZipper = zip.folder("renders");
			// create zip file from the returned buffers
			resultingFiles.map((file) =>
				rootZipper.file(file.file_name, file.data)
			);

			let zipFile = await zip.generateAsync({
				type: "base64",
			});

			return res.status(201).send({
				success: true,
				file: zipFile,
			});
		} catch (error) {
			console.log("template_parser.error", error);
			return res.status(500).send({
				success: false,
				error_message: error.message,
			});
		}
	}
);

module.exports = router;
