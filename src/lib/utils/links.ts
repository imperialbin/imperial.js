import type { Imperial } from "../classes/Imperial";

/**
 *  @internal
 */
export const createFormatedLink = (client: Imperial, id: string): string => `https://${client.rest.hostname}/p/${id}`;

/**
 *  @internal
 */
export const createRawLink = (client: Imperial, id: string): string => `https://${client.rest.hostname}/r/${id}`;
