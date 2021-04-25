import { request } from "https";
import { NO_TEXT, OPTIONS_WRONG_TYPE, TEXT_WRONG_TYPE } from "../../helper/errors";
import type { DocumentOptions, ImperialResponseCreateDocument, InternalPostOptions } from "../../helper/interfaces";
import { OptionsSchema } from "../../helper/schemas";
import { parseResponse } from "../../utils/parseResponse";
import { prepareRequest } from "../../utils/prepareRequest";
import { validateSchema } from "../../utils/schemaValidator";
import { Document } from "../Document";
import type { Imperial } from "../Imperial";

export const createDocument = function (this: Imperial, text: string, options?: DocumentOptions): Promise<Document> {
	return new Promise((resolve, reject) => {
		// If no text or text is an emtpy string reutrn

		if (!text || text === "") return reject(new Error(NO_TEXT));

		// If text is not a string return
		if (typeof text !== "string") return reject(new TypeError(TEXT_WRONG_TYPE));

		// If options are provided and the are not an object or they are an array reutrn
		if ((options !== undefined && typeof options !== "object") || options instanceof Array)
			return reject(new TypeError(OPTIONS_WRONG_TYPE));

		// Validate the object schema
		if (options) {
			const validateOptions = validateSchema(options as never, OptionsSchema);

			// If the returned data is an error reject with it
			if (validateOptions instanceof Error) {
				return reject(validateOptions);
			}
		}

		// Internal options to not modify parameters
		const internalOptions = options;

		// If there is a password provided, make the document default to encypted
		if (internalOptions?.password) {
			internalOptions.encrypted = true;
		}

		// Stringify the data
		const dataString = JSON.stringify({
			...internalOptions,
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
				resolve(
					new Document(this, {
						content: text,
						...data.document,
						password: options?.password ?? data.document.password,
					}),
				);
			}, reject);
		});
		httpRequest.on("error", reject);
		httpRequest.write(dataString);
		httpRequest.end();
	});
};
