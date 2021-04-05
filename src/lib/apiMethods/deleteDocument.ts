import { request } from "https";
import { ID_WRONG_TYPE, NO_ID, NO_TOKEN } from "../helpers/Errors";
import type { Imperial } from "../Imperial";
import { parseId } from "../utils/parseId";
import { parseResponse } from "../utils/parseResponse";
import { prepareRequest } from "../utils/prepareRequest";

export const deleteDocument = function (this: Imperial, id: string | URL): Promise<void> {
	return new Promise((resolve, reject) => {
		// If not token return
		if (!this.token) return reject(new Error(NO_TOKEN));

		// If no id return
		if (!id) return reject(new Error(NO_ID));

		if (typeof id !== "string" && !(id instanceof URL)) return reject(new TypeError(ID_WRONG_TYPE));

		// Make the user inputed data encoded so it doesn't break stuff
		const documentId = encodeURIComponent(parseId(id, this.hostnameCheckRegExp));

		// If the id is emtpy return
		if (!documentId) return reject(new Error(NO_ID));

		// Prepare the request
		const opts = prepareRequest({
			method: "DELETE",
			path: `/document/${documentId}`,
			hostname: this.hostname,
			token: this.token,
		});

		// Make the request
		const httpRequest = request(opts, (response) => {
			parseResponse(response, httpRequest).then(() => {
				// Resolve nothing
				resolve();
			}, reject);
		});
		httpRequest.on("error", reject);
		httpRequest.end();
	});
};
