import { request } from "https";
import { Document } from "../Document";
import { ID_WRONG_TYPE, NO_ID, NO_TEXT, NO_TOKEN, TEXT_WRONG_TYPE } from "../helper/errors";
import type { ImperialResponseEditDocument } from "../helper/interfaces";
import type { Imperial } from "../Imperial";
import { parseId } from "../utils/parseId";
import { parseResponse } from "../utils/parseResponse";
import { prepareRequest } from "../utils/prepareRequest";

export const editDocument = function (this: Imperial, id: string | URL, text: string): Promise<Document> {
	return new Promise((resolve, reject) => {
		// If no token return
		if (!this.token) return reject(new Error(NO_TOKEN));

		// If no id return
		if (!id) return reject(new Error(NO_ID));

		// If id is not the correct type return
		if (typeof id !== "string" && !(id instanceof URL)) return reject(new TypeError(ID_WRONG_TYPE));

		// If no newText was provided reutrn
		if (!text) return reject(new Error(NO_TEXT));

		// If newText is not the correct type return
		if (typeof text !== "string") return reject(new TypeError(TEXT_WRONG_TYPE));

		// Parse the documentId
		const documentId = parseId(id, this.hostnameCheckRegExp);

		// If the document id is emtpy reutrn
		if (!documentId) return reject(new Error(NO_ID));

		// Stringify the data
		const dataString = JSON.stringify({
			document: documentId,
			newCode: text,
		});

		// Prepare the request
		const opts = prepareRequest({
			method: "PATCH",
			path: "/document/",
			hostname: this.hostname,
			token: this.token,
		});

		// Make the request
		const httpRequest = request(opts, (response) => {
			// Parse response
			parseResponse<ImperialResponseEditDocument>(response, httpRequest).then((data) => {
				// Return the Document class
				resolve(new Document(this, { content: text, ...data.document }));
			}, reject);
		});
		httpRequest.on("error", reject);
		httpRequest.write(dataString);
		httpRequest.end();
	});
};
