import type { Imperial } from "../Imperial";

export const createFormatedLink = (client: Imperial, id: string): string => {
	return `https://${client.Hostname}/p/${id}`;
};
export const createRawLink = (client: Imperial, id: string): string => {
	return `https://${client.Hostname}/r/${id}`;
};
