import type { Imperial } from "./Imperial";

export abstract class BaseClient {
	constructor(client: Imperial) {
		Object.defineProperty(this, "client", { value: client });
	}
}

export interface BaseClient {
	readonly client: Imperial;
}
