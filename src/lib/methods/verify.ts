import { request } from "https";
import type { Imperial } from "..";
import type { ImperialResponseCommon } from "../helpers/interfaces";
import { validateToken } from "../helpers/isValidToken";
import parseResponse from "../utils/parseResponse";
import prepareRequest from "../utils/prepareRequest";

const verify = function (
	this: Imperial,
	cb?: (error: unknown, data?: ImperialResponseCommon) => void
): Promise<ImperialResponseCommon> | void {
	if (!this.token || !validateToken(this.token)) {
		const err = new Error("No or invalid token was provided in the constructor!");
		if (!cb) return Promise.reject(err);
		return cb(err);
	}

	const opts = prepareRequest({
		method: "GET",
		path: `/checkApiToken/${encodeURIComponent(this.token)}`,
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
		parseResponse(response).then((d) => cb(null, d), cb);
	});
	httpRequest.on("error", cb);
	httpRequest.end();
};

export default verify;
