import { request } from "https";
import type { Imperial } from "../Imperial";
import type { ImperialResponseCommon } from "../helpers/interfaces";
import { parseId } from "../utils/parseId";
import { parseResponse } from "../utils/parseResponse";
import { prepareRequest } from "../utils/prepareRequest";

export const deleteDocument = function (
	this: Imperial,
	id: string | URL,
	callback?: (error: unknown, data?: ImperialResponseCommon) => void
): Promise<ImperialResponseCommon> | void {
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

	if (!id) {
		// Throw an error if the id was empty to not stress the servers
		const err = new Error("No `id` was provided!");
		if (!callback) return Promise.reject(err);
		return callback(err);
	}

	if (typeof id !== "string" && !(id instanceof URL)) {
		// Throw an error if the id not a valid type
		const err = new TypeError("Parameter `id` must be a string or an URL!");
		if (!callback) return Promise.reject(err);
		return callback(err);
	}

	const documentId = encodeURIComponent(parseId(id, this.HostnameCheckRegExp)); // Make the user inputed data encoded so it doesn't break stuff

	if (!documentId) {
		// Throw an error if the id was empty to not stress the servers
		const err = new Error("Parameter `id` came out as an emtpy string!");
		if (!callback) return Promise.reject(err);
		return callback(err);
	}

	const opts = prepareRequest({
		method: "DELETE",
		path: `/document/${documentId}`,
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
