import { request } from "https";
import type { Imperial } from "..";
import type { createOptions, ImperialResponseCreateDocument } from "../helpers/interfaces";
import parseResponse from "../utils/parseResponse";
import prepareRequest from "../utils/prepareRequest";

interface internalPostOptions extends createOptions {
	code: string;
	[key: string]: unknown;
}

export const createDocument = function (
	this: Imperial,
	text: string,
	optionsOrCallback?: ((error: unknown, data?: ImperialResponseCreateDocument) => void) | createOptions,
	cb?: (error: unknown, data?: ImperialResponseCreateDocument) => void
): Promise<ImperialResponseCreateDocument> | void {
	const callback = typeof optionsOrCallback === "function" ? optionsOrCallback : cb;

	if (!text || text === String()) {
		const err = new Error("No `text` was provided!");
		if (!callback) return Promise.reject(err);
		return callback(err);
	}

	if (typeof text !== "string") {
		// Throw an error if the data is not a string
		const err = new TypeError("Parameter `text` must be a string!");
		if (!cb) return Promise.reject(err);
		return cb(err);
	}

	let data: internalPostOptions = {
		encrypted: false,

		longerUrls: false,
		instantDelete: false,
		imageEmbed: false,
		expiration: 5,
		code: text,
	};

	if (optionsOrCallback && typeof optionsOrCallback !== "function") {
		data = Object.assign(data, optionsOrCallback);
		data.code = text; // a little backup if someone were to pass code so it doesn't break
	}

	const dataString = JSON.stringify(data);

	const opts = prepareRequest({
		method: "POST",
		path: "/document",
		headers: {
			"Content-Length": Buffer.byteLength(dataString),
		},
		hostname: this.HOSTNAME,
		token: this.token,
	});

	if (!callback)
		return new Promise((resolve, reject) => {
			const httpRequest = request(opts, (response) => {
				resolve(parseResponse(response));
			});
			httpRequest.on("error", reject);
			httpRequest.write(dataString);
			httpRequest.end();
		});

	const httpRequest = request(opts, (response) => {
		parseResponse(response).then((data) => callback(null, data), cb);
	});
	httpRequest.on("error", callback);
	httpRequest.write(dataString);
	httpRequest.end();
};
