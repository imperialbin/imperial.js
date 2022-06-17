export interface MeUser {
	id: number;
	username: string;
	email: string;
	icon: string | null;
	confirmed_email: boolean;
	documents_made: number;
	flags: number;
	github_oauth: string | null;
	api_token: string;
	banned: boolean;
	settings: UserSettings;
}

export interface UserSettings {
	clipboard: boolean;
	long_urls: boolean;
	short_urls: boolean;
	instant_delete: boolean;
	encrypted: boolean;
	image_embed: boolean;
	expiration: number | null;
	font_ligatures: boolean;
	font_size: number;
	render_whitespace: boolean;
	word_wrap: boolean;
	tab_size: number;
	create_gist: boolean;
}
