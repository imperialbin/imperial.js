import { request } from "https";
import { NO_TOKEN } from "../../helper/errors";
import type { ImperialResponsePurgeDocuments, PurgeDocuments } from "../../helper/interfaces";
import { parseResponse } from "../../utils/parseResponse";
import { prepareRequest } from "../../utils/prepareRequest";
import type { Imperial } from "../Imperial";

export const purgeDocuments = function (this: Imperial): Promise<PurgeDocuments> {
	return new Promise((resolve, reject) => {
		// If no token return
		if (!this.token) return reject(new Error(NO_TOKEN));

		// Prepare the request
		const opts = prepareRequest({
			method: "DELETE",
			path: "/purgeDocuments",
			hostname: this.hostname,
			token: this.token,
		});

		// Make the request
		const httpRequest = request(opts, (response) => {
			parseResponse<ImperialResponsePurgeDocuments>(response, httpRequest).then((data) => {
				// Resolve nothing
				resolve({ numberDeleted: data.numberDeleted });
			}, reject);
		});
		httpRequest.on("error", reject);
		httpRequest.end();
	});
};
