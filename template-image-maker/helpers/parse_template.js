const puppeteer = require("puppeteer");
const handlebars = require("handlebars");
const { IMAGE } = require("./constants");

/**
 *
 * @param {Object} params
 * @param {String} params.html
 * @param {[Object]} params.data
 * @param {String} params.section
 * @param {String{"img" || "pdf"}} params.type
 */
async function parse_template({ html, data, section = "body", type = IMAGE }) {
	if (!(html && data)) {
		throw new Error("missing parameters");
	}

	// Vulnerability - an attacker can create a loop and the parsing eats up memory

	const compiledTemplate = handlebars.compile(html);
	let inputs = Array.isArray(data) ? data : [data];
	const browser = await puppeteer.launch();
	const page = await browser.newPage();
	let results = [];
	let isImage = type === IMAGE;

	for (let a = 0; a < inputs.length; a++) {
		let html = compiledTemplate({ ...inputs[a] }); // fill out with dynamic data

		await page.setContent(html, { waitUntil: ["networkidle0"] }); // render on page
		let file;

		if (isImage) {
			let element = page.$(section);
			file = await page.screenshot({
				omitBackground: true,
			});
		} else {
			file = await page.pdf();
		}

		results.push({
			file_name:
				inputs[a].title ||
				`file_for_item_${a + 1}.${
					isImage ? "png" : "pdf"
				}`,
			data: file,
		});
	}

	browser.close();

	return results;
}

module.exports = parse_template;
