import type { Imperial } from "../classes/Imperial";

/**
 *  @internal
 */
export const createFormatedLink = (client: Imperial, id: string): string => `https://${client.hostname}/p/${id}`;

/**
 *  @internal
 */
export const createRawLink = (client: Imperial, id: string): string => `https://${client.hostname}/r/${id}`;
