import { request } from "https";
import { NO_TOKEN } from "../helper/errors";
import type { ImperialResponseCommon } from "../helper/interfaces";
import type { Imperial } from "../Imperial";
import { parseResponse } from "../utils/parseResponse";
import { prepareRequest } from "../utils/prepareRequest";

export const verify = function (this: Imperial): Promise<void> {
	return new Promise((resolve, reject) => {
		// If no token return
		if (!this.token) return reject(new Error(NO_TOKEN));

		// Prepare the request
		const opts = prepareRequest({
			method: "GET",
			path: `/checkApiToken/${encodeURIComponent(this.token)}`,
			hostname: this.hostname,
			token: this.token,
		});

		// Make the request
		const httpRequest = request(opts, (response) => {
			// Parse response
			parseResponse<ImperialResponseCommon>(response, httpRequest).then(() => {
				// Resolve nothing
				resolve();
			}, reject);
		});
		httpRequest.on("error", reject);
		httpRequest.end();
	});
};
