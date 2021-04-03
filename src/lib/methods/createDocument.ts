import { request } from "https";
import { Document } from "../Document";
import type { CreateOptions, ImperialResponseCreateDocument, InternalPostOptions } from "../helpers/interfaces";
import type { Imperial } from "../Imperial";
import { parseResponse } from "../utils/parseResponse";
import { prepareRequest } from "../utils/prepareRequest";

export const createDocument = function (
	this: Imperial,
	text: string,
	optionsOrCallback?: ((error: unknown, data?: Document) => void) | CreateOptions,
	cb?: (error: unknown, data?: Document) => void
): Promise<Document> | void {
	const [callback, options] = typeof optionsOrCallback === "function" ? [optionsOrCallback] : [cb, optionsOrCallback];

	if (callback !== undefined && typeof callback !== "function") {
		// Throw an error if the data is not a callable functionex
		const err = new TypeError("Parameter `callback` must be callable!");
		if (!callback) return Promise.reject(err);
		throw err;
	}

	if (!text || text === "") {
		const err = new Error("No `text` was provided!");
		if (!callback) return Promise.reject(err);
		return callback(err);
	}

	if (typeof text !== "string") {
		// Throw an error if the data is not a string
		const err = new TypeError("Parameter `text` must be a string!");
		if (!callback) return Promise.reject(err);
		return callback(err);
	}

	if ((options !== undefined && typeof options !== "object") || options instanceof Array) {
		// Throw an error if the data is not an object
		const err = new TypeError("Parameter `options` must be an Object!");
		if (!callback) return Promise.reject(err);
		return callback(err);
	}

	const data: InternalPostOptions = {
		password: options?.password ?? "",
		encrypted: options?.encrypted ?? false,
		longerUrls: options?.longerUrls ?? false,
		instantDelete: options?.instantDelete ?? false,
		imageEmbed: options?.imageEmbed ?? false,
		expiration: options?.expiration ?? 5,
		code: text,
	};

	const dataString = JSON.stringify(data);

	const opts = prepareRequest({
		method: "POST",
		path: "/document",
		headers: {
			"Content-Length": Buffer.byteLength(dataString),
		},
		hostname: this.Hostname,
		token: this.token,
	});

	if (!callback)
		return new Promise((resolve, reject) => {
			const httpRequest = request(opts, (response) => {
				parseResponse<ImperialResponseCreateDocument>(response, httpRequest).then((data) => {
					resolve(new Document(this, { content: text, ...data.documentInfo }));
				}, reject);
			});
			httpRequest.on("error", reject);
			httpRequest.write(dataString);
			httpRequest.end();
		});

	const httpRequest = request(opts, (response) => {
		parseResponse<ImperialResponseCreateDocument>(response, httpRequest).then(
			(data) => callback(null, new Document(this, { content: text, ...data.documentInfo })),
			cb
		);
	});
	httpRequest.on("error", callback);
	httpRequest.write(dataString);
	httpRequest.end();
};
