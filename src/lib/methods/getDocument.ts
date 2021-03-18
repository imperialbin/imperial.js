import { request } from "https";
import type { Imperial } from "..";
import type { ImperialResponseGetDocument } from "../helpers/interfaces";
import { parseId } from "../utils/parseId";
import { parsePassword } from "../utils/parsePassword";
import { parseResponse } from "../utils/parseResponse";
import { prepareRequest } from "../utils/prepareRequest";

export const getDocument = function (
	this: Imperial,
	id: string | URL,
	passwordOrCallback?: string | ((error: unknown, data?: ImperialResponseGetDocument) => void),
	cb?: (error: unknown, data?: ImperialResponseGetDocument) => void
): Promise<ImperialResponseGetDocument> | void {
	const [callback, password] =
		typeof passwordOrCallback === "function" ? [passwordOrCallback] : [cb, passwordOrCallback];

	if (callback !== undefined && typeof callback !== "function") {
		// Throw an error if the callback is not a function
		const err = new TypeError("Parameter `callback` must be callable!");
		if (!callback) return Promise.reject(err);
		throw err;
	}

	if (!id) {
		// Throw an error if the id was empty to not stress the servers
		const err = new Error("No `id` was provided!");
		if (!callback) return Promise.reject(err);
		return callback(err);
	}

	if (typeof id !== "string" && !(id instanceof URL)) {
		// Throw an error if the data is not a string nor an URL
		const err = new TypeError("Parameter `id` must be a string or an URL!");
		if (!callback) return Promise.reject(err);
		return callback(err);
	}

	if (password && typeof password !== "string") {
		// Throw an error if the password is not a string
		const err = new TypeError("Parameter `password` must be a string!");
		if (!callback) return Promise.reject(err);
		return callback(err);
	}

	const documentId = encodeURIComponent(parseId(id, this.HOSTNAMEREGEX)); // Make the user inputed data encoded so it doesn't break stuff

	if (!documentId) {
		// Throw an error if the data was empty to not stress the servers
		const err = new Error("No `id` was provided!");
		if (!callback) return Promise.reject(err);
		return callback(err);
	}

	const documentPassword = password ?? parsePassword(id);

	const opts = prepareRequest({
		method: "GET",
		path: `/document/${documentId}${documentPassword ? `?password=${encodeURIComponent(documentPassword)}` : ""}`,
		hostname: this.HOSTNAME,
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
