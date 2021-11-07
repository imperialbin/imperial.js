import { objectify } from "../utils/objectify";
import type { Imperial } from "../client/Imperial";

export abstract class Base<T> {
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
	public _patch(data: T): T {
		return data;
	}

	/**
	 *  @internal
	 */
	public _update(data: T): this {
		const clone = this._clone();
		this._patch(data);
		return clone;
	}

	/**
	 *  Convert the class to a plain object
	 *  @param props - Properties to exclude from the object
	 *  @example
	 *  console.log(someclass.toJSON())
	 *  > { id: 'abc123', content: "hello" }
	 */

	public toJSON(...props: Parameters<typeof objectify>[1][]): T {
		// a little hack so typing do not yell at me
		return objectify(this as Record<string, unknown>, ...props);
	}
}

// eslint-disable-next-line
export interface Base<T> {
	readonly client: Imperial;
}
