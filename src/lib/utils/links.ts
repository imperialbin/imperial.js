import type { Imperial } from "../Imperial";

export const createFormatedLink = (client: Imperial, id: string): string => {
	return `https://${client.hostname}/p/${id}`;
};
export const createRawLink = (client: Imperial, id: string): string => {
	return `https://${client.hostname}/r/${id}`;
};
