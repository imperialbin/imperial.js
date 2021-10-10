import { objectify } from "../utils/objectify";
import type { Imperial } from "../client/Imperial";

export abstract class Base {
	constructor(client: Imperial) {
		Object.defineProperty(this, "client", { value: client });
	}

	/**
	 *  @internal
	 */
	public _clone(): this {
		return Object.assign(Object.create(this), this);
	}

	/**
	 *  @internal
	 */
	// eslint-disable-next-line class-methods-use-this
	public _patch(data: any) {
		return data;
	}

	/**
	 *  @internal
	 */
	public _update(data: unknown): this {
		const clone = this._clone();
		this._patch(data);
		return clone;
	}

	public toJSON(...props: Parameters<typeof objectify>[1][]) {
		// a little hack so typing do not yell at me
		return objectify(this as Record<string, unknown>, ...props);
	}
}

export interface Base {
	readonly client: Imperial;
}
