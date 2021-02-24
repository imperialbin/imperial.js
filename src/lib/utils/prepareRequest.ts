import type { OutgoingHttpHeaders } from "http";
import type { RequestOptions } from "https";

/**
 *  @internal
 */
interface prepareParams {
	method: string;
	headers?: OutgoingHttpHeaders;
	path: string;
	hostname: string;
	token: string | undefined;
}

const prepareRequest = function ({ method, headers = {}, path, hostname, token }: prepareParams): RequestOptions {
	const defaultHeaders: OutgoingHttpHeaders = {
		"Content-Type": "application/json", // best thing to happen
		"User-Agent": "imperial-node; (+https://github.com/imperialbin/imperial-node)",
	};

	if (token) defaultHeaders.Authorization = token;

	headers = Object.assign(headers, defaultHeaders);

	return {
		hostname,
		port: 443,
		path: `/api${path}`,
		method,
		headers,
	};
};

export default prepareRequest;
