import { request } from "https";
import { Document } from "../Document";
import type { ImperialResponseGetDocument } from "../helpers/interfaces";
import type { Imperial } from "../Imperial";
import { parseId } from "../utils/parseId";
import { parsePassword } from "../utils/parsePassword";
import { parseResponse } from "../utils/parseResponse";
import { prepareRequest } from "../utils/prepareRequest";

export const getDocument = function (
	this: Imperial,
	id: string | URL,
	passwordOrCallback?: string | ((error: unknown, data?: Document) => void),
	cb?: (error: unknown, data?: Document) => void
): Promise<Document> | void {
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

	// Make the user inputed data encoded so it doesn't break stuff
	const documentId = encodeURIComponent(parseId(id, this.HostnameCheckRegExp));

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
		hostname: this.Hostname,
		token: this.token,
	});

	if (!callback)
		return new Promise((resolve, reject) => {
			const httpRequest = request(opts, (response) => {
				parseResponse<ImperialResponseGetDocument>(response, httpRequest).then((data) => {
					resolve(new Document(this, { content: data.content, ...data.documentInfo }));
				}, reject);
			});
			httpRequest.on("error", reject);
			httpRequest.end();
		});

	const httpRequest = request(opts, (response) => {
		parseResponse<ImperialResponseGetDocument>(response, httpRequest).then(
			(data) => callback(null, new Document(this, { content: data.content, ...data.documentInfo })),
			callback
		);
	});
	httpRequest.on("error", callback);
	httpRequest.end();
};
