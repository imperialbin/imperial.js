import { request } from "https";
import type { ImperialResponseGetDocument } from "../helper/interfaces";
import { Document } from "../Document";
import { ID_WRONG_TYPE, NO_ID, PASSWORD_WRONG_TYPE } from "../helper/errors";
import type { Imperial } from "../Imperial";
import { parseId } from "../utils/parseId";
import { parsePassword } from "../utils/parsePassword";
import { parseResponse } from "../utils/parseResponse";
import { prepareRequest } from "../utils/prepareRequest";

export const getDocument = function (this: Imperial, id: string | URL, password?: string): Promise<Document> {
	return new Promise((resolve, reject) => {
		// If no id return
		if (!id) return reject(new Error(NO_ID));

		// If id is not the correct type return
		if (typeof id !== "string" && !(id instanceof URL)) return reject(new TypeError(ID_WRONG_TYPE));

		// If password is provided and is the wrong type return
		if (password !== undefined && typeof password !== "string") return reject(new TypeError(PASSWORD_WRONG_TYPE));

		// Make the user inputed data encoded so it doesn't break stuff
		const documentId = encodeURIComponent(parseId(id, this.hostnameCheckRegExp));

		// If the document id is emtpy reutrn
		if (!documentId) return reject(new Error(NO_ID));

		// If no password was set try to extract it from the id
		const documentPassword = password ?? parsePassword(id);

		// Prepare the request
		const opts = prepareRequest({
			method: "GET",
			path: `/document/${documentId}${
				documentPassword ? `?password=${encodeURIComponent(documentPassword)}` : ""
			}`,
			hostname: this.hostname,
			token: this.token,
		});

		// Make the request
		const httpRequest = request(opts, (response) => {
			// Parse response
			parseResponse<ImperialResponseGetDocument>(response, httpRequest).then((data) => {
				// Return the Document class
				resolve(new Document(this, { content: data.content, ...data.document, password: documentPassword }));
			}, reject);
		});
		httpRequest.on("error", reject);
		httpRequest.end();
	});
};
