import type { Imperial } from ".";

export abstract class Base {
	constructor(client: Imperial) {
		Object.defineProperty(this, "client", { value: client });
	}
}

export interface Base {
	readonly client: Imperial;
}
