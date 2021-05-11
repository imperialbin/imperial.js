import { URL } from "url";
import { ID_WRONG_TYPE } from "../errors/Messages";

const getIdFromUrl = (url: URL, hostnameRegex: RegExp): string | null => {
	const splitPath = url.pathname.split("/");

	if (hostnameRegex.test(url.hostname) && splitPath.length > 0) {
		// If the domain matches imperial extract data after last slash
		return splitPath[splitPath.length - 1];
	}

	return null;
};

/**
 *  Extract the id from a string or URL object
 *  @internal
 */
export const parseId = function (id: string | URL | undefined, hostnameRegex: RegExp): string | null {
	if (!id) return null;

	if (id instanceof URL) return getIdFromUrl(id, hostnameRegex);
	if (typeof id !== "string") throw new Error(ID_WRONG_TYPE);

	try {
		// Try to parse a url
		return getIdFromUrl(new URL(id), hostnameRegex);
	} catch (e) {
		return id;
	}
};
