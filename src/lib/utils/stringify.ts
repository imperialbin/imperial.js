import { inspect } from "util";
import { isBrowser } from "./browser";

export const stringify = (data: any): string => {
	if (typeof data === "object") {
		if (isBrowser) return JSON.stringify(data);
		return inspect(data, { compact: false });
	}

	return String(data);
};
