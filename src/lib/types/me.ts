export type DiscordUser = {
	id: string;
	username: string;
	avatar: string;
	avatar_decoration: string | null;
	discriminator: string;
	public_flags: string;
	flags: number;
	banner: string | null;
	banner_color: string | null;
	accent_color: string | null;
	locale: string;
	mfa_enabled: boolean;
	premium_type: number | null;
};

export type GitHubUser = {
	login: string;
	id: number;
	avatar_url: string;
	gravatar_id: string;
	type: string;
	name: string | null;
	location: string | null;
	email: string | null;
	hireable: boolean | null;
	bio: string | null;
	twitter_username: string | null;
	public_gists: number;
	private_gists: number;
	two_factor_authentication: boolean;
	token: string;
};

export interface MeUser {
	id: number;
	username: string;
	email: string;
	icon: string | null;
	confirmed: boolean;
	documents_made: number;
	flags: number;
	github: GitHubUser | null;
	discord: DiscordUser | null;
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
