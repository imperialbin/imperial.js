export interface MeUser {
	id: string;
	userId: number;
	username: string;
	email: string;
	banned: boolean;
	confirmed: boolean;
	icon: string;
	memberPlus: boolean;
	documentsMade: number;
	activeUnlimitedDocuments: number;
	discordId: string;
	admin: boolean;
	apiToken: string;
	githubAccess: string;
	opt: string;
	settings: UserSettings;
}

export interface UserSettings {
	clipboard: boolean;
	longUrls: boolean;
	shortUrls: boolean;
	instantDelete: boolean;
	encrypted: boolean;
	imageEmbed: boolean;
	expiration: number;
	fontLignatures: boolean;
	fontSize: number;
	renderWhitespace: boolean;
	wordWrap: boolean;
	tabSize: number;
	createGist: boolean;
}