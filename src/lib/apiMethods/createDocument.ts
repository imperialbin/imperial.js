import { request } from "https";
import { Document } from "../Document";
import { NO_TEXT, OPTIONS_WRONG_TYPE, TEXT_WRONG_TYPE } from "../helper/errors";
import type { DocumentOptions, ImperialResponseCreateDocument, InternalPostOptions } from "../helper/interfaces";
import type { Imperial } from "../Imperial";
import { parseResponse } from "../utils/parseResponse";
import { prepareRequest } from "../utils/prepareRequest";

export const createDocument = function (this: Imperial, text: string, options?: DocumentOptions): Promise<Document> {
	return new Promise((resolve, reject) => {
		// If no text or text is an emtpy string reutrn

		if (!text || text === "") return reject(new Error(NO_TEXT));

		// IF text is not a string return
		if (typeof text !== "string") return reject(new TypeError(TEXT_WRONG_TYPE));

		// If options are provided and the are not an object or they are an array reutrn
		if ((options !== undefined && typeof options !== "object") || options instanceof Array)
			return reject(new TypeError(OPTIONS_WRONG_TYPE));

		// Stringify the data
		const dataString = JSON.stringify({
			...options,
			code: text,
		} as InternalPostOptions);

		// Prepare the request
		const opts = prepareRequest({
			method: "POST",
			path: "/document",
			headers: {
				"Content-Length": Buffer.byteLength(dataString),
			},
			hostname: this.hostname,
			token: this.token,
		});

		// Make the request
		const httpRequest = request(opts, (response) => {
			// Parse the response
			parseResponse<ImperialResponseCreateDocument>(response, httpRequest).then((data) => {
				// Return the Document class
				resolve(new Document(this, { content: text, ...data.document }));
			}, reject);
		});
		httpRequest.on("error", reject);
		httpRequest.write(dataString);
		httpRequest.end();
	});
};
