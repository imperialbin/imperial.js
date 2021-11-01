import type { Imperial } from "../client";

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
