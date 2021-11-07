import type { Imperial } from "./Imperial";

export abstract class Base {
	constructor(client: Imperial) {
		Object.defineProperty(this, "client", { value: client });
	}
}

export interface Base {
	readonly client: Imperial;
}
