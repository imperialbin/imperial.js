enum Flags {}

type BitfieldResolvable = number | bigint | string | Bitfield | BitfieldResolvable[];

export abstract class Bitfield<T extends typeof Bitfield = typeof Bitfield> {
	static readonly DefaultBits: number | bigint = 0;

	static Flags = Flags;

	// @ts-expect-error TS2333 take default from extended class
	constructor(bits = (this.constructor as T).DefaultBits) {
		Object.defineProperty(this, "bits", { value: bits, configurable: false });
	}

	public has(flag: BitfieldResolvable): boolean {
		const bitFlag = (this.constructor as T).resolve(flag) as typeof this.bits;

		return (this.bits & bitFlag) === bitFlag;
	}

	public equals(other: BitfieldResolvable): boolean {
		return this.bits === (this.constructor as T).resolve(other);
	}

	public toArray(): string[] {
		return Object.keys((this.constructor as T).Flags).filter((key) => this.has(key));
	}

	*[Symbol.iterator]() {
		yield* this.toArray();
	}

	public toJSON(): number | bigint {
		return this.bits;
	}

	public valueOf(): number | bigint {
		return this.bits;
	}

	static resolve(bits: BitfieldResolvable): typeof Bitfield.DefaultBits {
		if (bits instanceof Bitfield) return bits.bits;
		if (typeof bits === typeof this.DefaultBits) return bits as number;

		if (Array.isArray(bits))
			return bits
				.map((b) => this.resolve(b))
				.reduce((prev, b) => (prev as number) | (b as number), this.DefaultBits);

		if (typeof bits === "string") {
			if (typeof this.Flags[bits as keyof typeof this.Flags] === "number")
				return this.Flags[bits as keyof typeof this.Flags] as unknown as number;

			if (!isNaN(bits as any)) return typeof this.DefaultBits === "bigint" ? BigInt(bits) : Number(bits);
		}

		throw new RangeError("BITFIELD_INVALID_BIT");
	}
}

export interface Bitfield {
	readonly bits: number;
}
