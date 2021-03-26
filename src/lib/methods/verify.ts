import { request } from "https";
import type { Imperial } from "..";
import type { ImperialResponseCommon } from "../helpers/interfaces";
import { parseResponse } from "../utils/parseResponse";
import { prepareRequest } from "../utils/prepareRequest";

export const verify = function (
	this: Imperial,
	callback?: (error: unknown, data?: ImperialResponseCommon) => void
): Promise<ImperialResponseCommon> | void {
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
				resolve(parseResponse(response, httpRequest));
			});
			httpRequest.on("error", reject);
			httpRequest.end();
		});

	const httpRequest = request(opts, (response) => {
		parseResponse(response, httpRequest).then((data) => callback(null, data), callback);
	});
	httpRequest.on("error", callback);
	httpRequest.end();
};
