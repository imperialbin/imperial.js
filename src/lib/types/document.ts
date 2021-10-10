export interface Settings {
	language: string;
	imageEmbed: boolean;
	instantDelete: boolean;
	encrypted: boolean;
	password: string | null;
	public: boolean;
	editors: string[];
}

export interface Timestamps {
	creation: number;
	expiration: number;
}

export interface Links {
	raw: string;
	formatted: string;
}

export interface Document {
	id: string;
	content: string;
	views: number;
	links: Links;
	timestamps: Timestamps;
	settings: Settings;
}

export interface DocumentEditOptions {
	language?: string;
	imageEmbed?: boolean;
	instantDelete?: boolean;
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
