import type { Imperial } from "..";

export class Base {
	constructor(client: Imperial) {
		this.client = client;
	}
}

export interface Base {
	/**
	 *  @internal
	 */
	client: Imperial;
}
