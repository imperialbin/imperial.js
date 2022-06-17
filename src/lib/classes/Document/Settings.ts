import type { Imperial } from "../..";
import type { Settings as ISettings } from "../../types/document";
import { Base } from "../Base";

export class Settings extends Base<ISettings> {
	constructor(client: Imperial, settings: ISettings) {
		super(client);

		if (!settings) throw new Error("DocumentSettings: No settings provided");

		this._patch(settings);
	}

	/**
	 *  @internal
	 */
	public _patch(settings: ISettings) {
		if ("instant_delete" in settings || "instantDelete" in settings) {
			// @ts-expect-error instantDelete is used when copying from a class
			this.instantDelete = settings.instant_delete ?? settings.instantDelete;
		} else if (typeof this.instantDelete !== "boolean") {
			this.instantDelete = false;
		}

		if ("encrypted" in settings) {
			this.encrypted = settings.encrypted;
		} else if (typeof this.encrypted !== "boolean") {
			this.encrypted = false;
		}

		if ("password" in settings) {
			this.password = settings.password;
		} else if (typeof this.password !== "string") {
			this.password = null;
		}

		if ("public" in settings) {
			this.public = settings.public;
		} else if (typeof this.public !== "boolean") {
			this.public = false;
		}

		if ("editors" in settings) {
			this.editors = settings.editors;
		} else if (!Array.isArray(this.editors)) {
			this.editors = [];
		}

		if ("language" in settings) {
			this.language = settings.language;
		} else if (typeof this.language !== "string") {
			this.language = null;
		}

		if ("image_embed" in settings || "imageEmbed" in settings) {
			// @ts-expect-error imageEmbed is used when copying from a class
			this.imageEmbed = settings.image_embed ?? settings.imageEmbed;
		} else if (typeof this.imageEmbed !== "boolean") {
			this.imageEmbed = false;
		}

		return settings;
	}
}

export interface Settings {
	language: string | null;
	imageEmbed: boolean;
	instantDelete: boolean;
	encrypted: boolean;
	password: string | null;
	public: boolean;
	editors: string[];
}
