import type { Imperial } from "../..";
import type { Timestamps as ITimeStamps } from "../../types/document";
import { getDateDifference } from "../../utils/dateDifference";
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
			this.creation = new Date(timestamps.creation * 1000);
		}

		if ("expiration" in timestamps) {
			this.expiration = new Date(timestamps.expiration * 1000);
		}

		return timestamps;
	}

	/**
	 *  The ammount of days the Doucment will expire at from the current moment
	 *  @returns {number} The ammount of days the Document will expire at from the current moment
	 */
	public get daysLeft(): number | null {
		const daysLeft = getDateDifference(new Date(), this.expiration);
		if (daysLeft <= 0) return null;
		return daysLeft;
	}

	/**
	 *  The ammount of days the Document will expire at from it's creation date
	 *  @returns {number} The ammount of days the Document will expire at from it's creation date
	 */
	public get expirationDays(): number {
		return getDateDifference(this.creation, this.expiration);
	}
}

export interface Timestamps {
	creation: Date;
	expiration: Date;
}
