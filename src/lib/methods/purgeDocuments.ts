import { request } from "https";
import type { Imperial } from "../Imperial";
import type { ImperialResponsePurgeDocuments } from "../helpers/interfaces";
import { parseResponse } from "../utils/parseResponse";
import { prepareRequest } from "../utils/prepareRequest";

export const purgeDocuments = function (
	this: Imperial,
	callback?: (error: unknown, data?: ImperialResponsePurgeDocuments) => void
): Promise<ImperialResponsePurgeDocuments> | void {
	if (callback !== undefined && typeof callback !== "function") {
		// Throw an error if the callback is not a function
		const err = new TypeError("Parameter `callback` must be callable!");
		if (!callback) return Promise.reject(err);
		throw err;
	}

	if (!this.token) {
		// Throw an error if the token was not set
		const err = new Error("This method requires a token to be set in the constructor!");
		if (!callback) return Promise.reject(err);
		return callback(err);
	}

	const opts = prepareRequest({
		method: "DELETE",
		path: `/purgeDocuments`,
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
