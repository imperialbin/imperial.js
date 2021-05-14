import { flatten } from "../utils/flatten";
import type { Imperial } from "./Imperial";

export abstract class Base {
	constructor(client: Imperial) {
		Object.defineProperty(this, "client", { value: client });
	}

	toJSON(...props: Parameters<typeof flatten>[1][]) {
		return flatten(this, ...props);
	}
}

export interface Base {
	readonly client: Imperial;
}
