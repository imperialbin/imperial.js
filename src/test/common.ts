export const DAY = 86_400_000;

export const IMPERIAL_TOKEN = "IMPERIAL-00000000-0000-0000-0000-000000000000";

export const TEST_USERNAME = "test";

export const RESPONSE_DOCUMENT = {
	success: true,
	data: {
		id: "HKnB",
		content: "test",
		views: 0,
		links: {
			raw: "https://staging-balls-api.impb.in/r/HKnB",
			formatted: "https://staging-balls-api.impb.in/p/HKnB",
		},
		timestamps: {
			creation: (new Date().valueOf() - 7 * DAY) / 1000,
			expiration: (new Date().valueOf() - DAY) / 1000,
		},
		settings: {
			language: "auto",
			imageEmbed: false,
			instantDelete: false,
			encrypted: false,
			password: "",
			public: false,
			editors: [TEST_USERNAME],
		},
	},
};

export const RESPONSE_USER = {
	success: true,
	data: {
		username: TEST_USERNAME,
		icon: "/img/pfp.png",
		memberPlus: false,
		banned: false,
	},
};
