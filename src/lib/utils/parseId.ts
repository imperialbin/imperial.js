const getIdFromUrl = (url: URL, hostnameRegex: RegExp): string => {
	const splitPath = url.pathname.split("/");

	if (hostnameRegex.test(url.hostname) && splitPath.length > 0) {
		// If the domain matches imperial extract data after last slash
		return splitPath[splitPath.length - 1];
	}

	return url.toString();
};

/**
 *  @internal
 */
export const parseId = function (id: string | URL, hostnameRegex: RegExp): string {
	if (id instanceof URL) return getIdFromUrl(id as URL, hostnameRegex);

	let localId = id;

	try {
		// Try to parse a url
		localId = getIdFromUrl(new URL(id as string), hostnameRegex);
	} catch (e) {
		// Don't do anything with the URL prase error
	}

	// Try to parse a url
	return localId;
};
