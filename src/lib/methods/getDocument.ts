import { request } from "https";
import type { Imperial } from "..";
import type { ImperialResponseGetDocument } from "../helpers/interfaces";
import parseId from "../utils/parseId";
import parseResponse from "../utils/parseResponse";
import prepareRequest from "../utils/prepareRequest";

const getDocument = function (
	this: Imperial,
	id: string | URL,
	cb?: (error: unknown, data?: ImperialResponseGetDocument) => void
): Promise<ImperialResponseGetDocument> | void {
	if (!id) {
		// Throw an error if the data was empty to not stress the servers
		const err = new Error("No `id` was provided!");
		if (!cb) return Promise.reject(err);
		return cb(err);
	}

	if (typeof id !== typeof String() && !(id instanceof URL)) {
		// Throw an error if the data is not a string
		const err = new TypeError("Parameter `id` must be a string or an URL!");
		if (!cb) return Promise.reject(err);
		return cb(err);
	}

	const documentId = encodeURIComponent(parseId(id, this.HOSTNAMEREGEX)); // Make the user inputed data encoded so it doesn't break stuff

	const opts = prepareRequest({
		method: "GET",
		path: `/document/${documentId}`,
		hostname: this.HOSTNAME,
		token: this.token,
	});

	if (!cb)
		return new Promise((resolve, reject) => {
			const httpRequest = request(opts, (response) => {
				resolve(parseResponse(response));
			});
			httpRequest.on("error", reject);
			httpRequest.end();
		});

	const httpRequest = request(opts, (response) => {
		parseResponse(response).then((data) => cb(null, data), cb);
	});
	httpRequest.on("error", cb);
	httpRequest.end();
};

export default getDocument;
