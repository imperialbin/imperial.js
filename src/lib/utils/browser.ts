/**
 *  Returns wheather we are in a browser or not
 *  @returns true if we are in a browser
 */
export const isBrowser =
	// @ts-expect-error browser
	typeof window !== "undefined" && typeof document !== "undefined" && typeof process !== "object";
