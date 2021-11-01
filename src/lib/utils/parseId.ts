import URL from "./url";
import type { IdResolvable } from "../types/common";
import { ErrorMessage } from "../errors/Messages";

const getIdFromUrl = (url: URL, hostnameRegex: RegExp): string => {
	if (!url.protocol.match(/^https?:$/)) throw new Error(ErrorMessage("ID_WRONG_TYPE"));

	const splitPath = url.pathname.split("/");

	if (hostnameRegex.test(url.hostname) && splitPath.length > 0) {
		// If the domain matches imperial extract data after last slash
		return splitPath[splitPath.length - 1];
	}

	throw new Error(ErrorMessage("NO_ID"));
};

/**
 *  Extract the id from a string or URL object
 *  @internal
 */
export const parseId = function (id: IdResolvable, hostnameRegex: RegExp): string {
	if (!id) throw new Error(ErrorMessage("NO_ID"));

	if (id instanceof URL) return getIdFromUrl(id, hostnameRegex);
	if (typeof id !== "string") throw new Error(ErrorMessage("ID_WRONG_TYPE"));

	try {
		// Try to parse a url
		return getIdFromUrl(new URL(id), hostnameRegex);
	} catch (e) {
		return id;
	}
};
