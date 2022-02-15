const sanitizeHtml = require("sanitize-html");

const clean = (html) => {
	return sanitizeHtml(html, {
		allowedTags: sanitizeHtml.defaults.allowedTags.concat([
			"img",
			"body",
			"style",
			"head",
			"html",
		]),
		allowedAttributes: {
			a: ["href"],
			img: ["src", "width", "height"],
			"*": ["class", "style"],
		},
	});
};

module.exports = clean;
