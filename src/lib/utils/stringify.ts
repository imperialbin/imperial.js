import { inspect } from "util";

export const stringify = (data: any): string => {
	if (typeof data === "object") {
		return inspect(data, { compact: false });
	}

	return String(data);
};
