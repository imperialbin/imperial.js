import { postOptions, ImperialResponsePostCode } from "./interfaces";

interface _internalPostOptions extends postOptions {
	code: string;
	apiToken?: string;
	[key: string]: unknown;
}

interface setParamsProps {
	optionsOrCallback?: ((error: unknown, data?: ImperialResponsePostCode) => void) | postOptions;
	text: string;
	apiToken: string | null;
}

const setParams = ({ optionsOrCallback, text, apiToken }: setParamsProps): URLSearchParams => {
	let params: _internalPostOptions = {
		longerUrls: false,
		instantDelete: false,
		imageEmbed: false,
		expiration: 5,
		code: text,
	};

	if (apiToken) {
		params.apiToken = apiToken;
	}

	if (typeof optionsOrCallback !== "function") {
		params = Object.assign(params, optionsOrCallback);
	}

	const searchParams = new URLSearchParams();

	for (const prop in params) {
		searchParams.set(prop, String(params[prop]));
	}

	return searchParams;
};

export default setParams;
