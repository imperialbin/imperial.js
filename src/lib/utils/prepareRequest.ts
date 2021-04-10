import type { OutgoingHttpHeaders } from "http";
import type { RequestOptions } from "https";
import type { PrepareRequestParams } from "../common/interfaces";

/**
 *  @internal
 */
export const prepareRequest = function ({
	method,
	headers = {},
	path,
	hostname,
	token,
}: PrepareRequestParams): RequestOptions {
	const defaultHeaders: OutgoingHttpHeaders = {
		// best thing to happen
		"Content-Type": "application/json",
		"User-Agent": "imperial-node; (+https://github.com/imperialbin/imperial-node)",
	};

	if (token) defaultHeaders.Authorization = token;

	const headersLocal = {
		...headers,
		...defaultHeaders,
	};

	return {
		hostname,
		port: 443,
		path: `/api${path}`,
		method,
		headers: headersLocal,
	};
};
