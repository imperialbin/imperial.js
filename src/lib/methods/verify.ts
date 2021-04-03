import { request } from "https";
import type { ImperialResponseCommon } from "../helpers/interfaces";
import type { Imperial } from "../Imperial";
import { parseResponse } from "../utils/parseResponse";
import { prepareRequest } from "../utils/prepareRequest";

export const verify = function (this: Imperial, callback?: (error: unknown) => void): Promise<void> | void {
	if (callback !== undefined && typeof callback !== "function") {
		// Throw an error if the data is not a string
		const err = new TypeError("Parameter `callback` must be callable!");
		if (!callback) return Promise.reject(err);
		throw err;
	}

	if (!this.token) {
		const err = new Error("No or invalid token was provided in the constructor!");
		if (!callback) return Promise.reject(err);
		return callback(err);
	}

	const opts = prepareRequest({
		method: "GET",
		path: `/checkApiToken/${encodeURIComponent(this.token)}`,
		hostname: this.Hostname,
		token: this.token,
	});

	if (!callback)
		return new Promise((resolve, reject) => {
			const httpRequest = request(opts, (response) => {
				parseResponse<ImperialResponseCommon>(response, httpRequest).then(() => {
					resolve();
				}, reject);
			});
			httpRequest.on("error", reject);
			httpRequest.end();
		});

	const httpRequest = request(opts, (response) => {
		parseResponse<ImperialResponseCommon>(response, httpRequest).then(() => callback(null), callback);
	});
	httpRequest.on("error", callback);
	httpRequest.end();
};
