import { Imperial } from "imperial-node";
import type { Interfaces } from "imperial-node";

/*
 *  the token can be undefined, must be a valid imperial token to work
 *  you can get one in the API section here: https://imperialb.in/account
 */
const IMPERIAL_TOKEN = "IMPERIAL-really-valid-token";

const api = new Imperial(IMPERIAL_TOKEN);

// to use these options it is required to set an api token in the constructor
const options: Interfaces.createOptions = {
	/*
	 *  you only need to specify the ones you need
	 *  not all are required to be presant
	 */
	instantDelete: true,
	encrypted: false,
	expiration: 3,
	longerUrls: true,
	imageEmbed: true,
	password: "you shall not pass",
};

// promise based:
(async () => {
	try {
		// you can also use the ".then" and ".catch"
		const response = await api.createDocument("hi!", options);

		console.log(response);
	} catch (error) {
		console.error(error);
	}
})();

// or with callbacks:
api.createDocument("hi!", options, (error, response) => {
	if (error) return console.error(error);

	console.log(response);
});
