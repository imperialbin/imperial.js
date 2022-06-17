import type { User } from "./users";

export interface Settings {
	language: string;
	image_embed: boolean;
	instant_delete: boolean;
	encrypted: boolean;
	password: string | null;
	public: boolean;
	editors: string[];
}

export interface Timestamps {
	creation: string;
	expiration: string | null;
}

export interface Links {
	raw: string;
	formatted: string;
}

export interface Document {
	id: string;
	content: string;
	views: number;
	gist_url: string | null;
	creator: User | null;
	links: Links;
	timestamps: Timestamps;
	settings: Settings;
}

export interface DocumentEditOptions {
	language?: string;
	image_embed?: boolean;
	instant_delete?: boolean;
	public?: boolean;
	editors?: string[];
}

export interface DocumentCreateOptions extends DocumentEditOptions {
	shortUrls?: boolean;
	longUrls?: boolean;
	expiration?: number;
	createGist?: boolean;
	encrypted?: boolean;
	password?: string | null;
}
