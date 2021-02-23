const parseUrl = (url: URL, hostnameRegex: RegExp): string => {
	if (!url.pathname) return String();
	const splitPath = url.pathname.split("/");

	if (hostnameRegex.test(url.hostname) && splitPath.length > 0) {
		// If the domain matches imperial extract data after last slash
		return splitPath[splitPath.length - 1];
	}

	return url.toString ? url.toString() : String();
};

const parseId = function (id: string | URL, hostnameRegex: RegExp): string {
	if (!(id instanceof URL)) {
		let _id: string = id as string;

		try {
			// Try to parse a url
			const url = new URL(id as string);
			_id = parseUrl(url, hostnameRegex);
		} catch (e) {
			/* Don't do anything with the URL prase error */
		}
		// Try to parse a url
		return _id;
	}

	return parseUrl(id as URL, hostnameRegex);
};

export default parseId;
