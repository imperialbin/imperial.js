import type { Imperial } from "../classes/Imperial";

export const createFormatedLink = (client: Imperial, id: string): string => `https://${client.hostname}/p/${id}`;
export const createRawLink = (client: Imperial, id: string): string => `https://${client.hostname}/r/${id}`;
