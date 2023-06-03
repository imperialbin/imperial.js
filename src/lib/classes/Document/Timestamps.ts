import type { Imperial } from "../..";
import type { Timestamps as ITimeStamps } from "../../types/document";
import { Util } from "../../utils/Util";
import { Base } from "../Base";

export class Timestamps extends Base<ITimeStamps> {
	constructor(client: Imperial, timestamps: ITimeStamps) {
		super(client);

		if (!timestamps) throw new Error("DocumentTimestamps: No timestamps provided");

		this._patch(timestamps);
	}

	/**
	 *  @internal
	 */
	public _patch(timestamps: ITimeStamps) {
		if ("creation" in timestamps) {
			this.creation = new Date(timestamps.creation);
		}

		if ("expiration" in timestamps) {
			this.expiration = new Date(timestamps.expiration as string);
		} else if (this.expiration!.valueOf() === 0) {
			this.expiration = null;
		}

		return timestamps;
	}

	/**
	 *  The amount of days the document will expire at from the current moment
	 *  @returns {number} The amount of days the Document will expire at from the current moment
	 */
	public get daysLeft(): number {
		const daysLeft = Util.getDateDifference(new Date(), this.expiration ?? new Date(0));
		if (daysLeft <= 0) return 0;
		return daysLeft;
	}

	/**
	 *  The amount of days the Document will expire at from it's creation date
	 *  @returns {number} The amount of days the Document will expire at from it's creation date
	 */
	public get expirationDays(): number {
		return Util.getDateDifference(this.creation, this.expiration ?? new Date(0));
	}
}

export interface Timestamps {
	creation: Date;
	expiration: Date | null;
}
