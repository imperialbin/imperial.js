/* Amazing tests done at 6 am */

import test from "tape";
// @ts-expect-error no types
import tapDiff from "tap-diff";
import { readFileSync } from "fs";
import { Imperial } from "../lib";

test.createStream().pipe(tapDiff()).pipe(process.stdout);

const apikey = ((): string | null => {
	const path = `${__dirname}/../../apikey.txt`;
	let fileContent: null | string = null;
	try {
		fileContent = readFileSync(path, "utf-8").trim();
	} catch (err) {
		/* File not found */
	}
	return fileContent;
})();

if (!apikey) {
	console.log("> No token provided, aborting tests!");
	process.exit(0);
}

test("verify - invalid token", async (t) => {
	try {
		const client = new Imperial("blahblah" /* Ah yes the invalid token */);
		const res = await client.verify();
		t.notok(res.success, "token should not be valid");
		t.match(res.message, /\sinvalid!$/i, "message should say it's invalid");
		t.end();
	} catch (e) {
		if (e && e.statusCode === 429) {
			t.fail(e.statusCodeText);
			t.end();
		} else {
			t.fail(e);
			t.end();
		}
	}
});

test("verify - valid token", async (t) => {
	try {
		const client = new Imperial(apikey);
		const res = await client.verify();
		t.ok(res.success, "token should be valid");
		t.match(res.message, /\svalid!$/i, "message should say it's valid");
		t.end();
	} catch (e) {
		if (e && e.statusCode === 429) {
			t.fail(e.statusCodeText);
			t.end();
		} else {
			t.fail(e);
			t.end();
		}
	}
});

test("verify - no token", async (t) => {
	try {
		const client = new Imperial();
		await client.verify();
		t.fail("should have thrown an error");
		t.end();
	} catch (e) {
		if (e && e.statusCode === 0) {
			t.pass(`Throws an error: "${e}"`);
			t.end();
		} else if (e && e.statusCode === 429) {
			t.fail(e.statusCodeText);
			t.end();
		} else {
			t.fail(e);
			t.end();
		}
	}
});

test("postCode - valid", async (t) => {
	try {
		const client = new Imperial(apikey);
		const res = await client.postCode("hi from test!", { instantDelete: true });
		t.ok(res.success, "request should be completed");
		t.strictEqual(res.instantDelete, true, "instantDelete should be set to true");
		t.end();
	} catch (e) {
		if (e && e.statusCode === 429) {
			t.fail(e.statusCodeText);
			t.end();
		} else {
			t.fail(e);
			t.end();
		}
	}
});

test("postCode - invalid", async (t) => {
	try {
		const client = new Imperial(apikey);
		// @ts-expect-error we are testing that
		await client.postCode();
		t.fail("should have thrown an error");
		t.end();
	} catch (e) {
		if (e && e.statusCode === 0) {
			t.pass(`Throws an error: "${e}"`);
			t.end();
		} else if (e && e.statusCode === 429) {
			t.fail(e.statusCodeText);
			t.end();
		} else {
			t.fail(e);
			t.end();
		}
	}
});

test("getCode - valid", async (t) => {
	try {
		const client = new Imperial(apikey);
		const res = await client.getCode("https://imperialb.in/pxseuwu/fw37bo286knssafupduhl9hjo25pylw");
		t.ok(res.success, "request should be completed");
		t.strictEqual(typeof res.document, "string", "document should be type of string");
		t.end();
	} catch (e) {
		if (e && e.statusCode === 429) {
			t.fail(e.statusCodeText);
			t.end();
		} else {
			t.fail(e);
			t.end();
		}
	}
});

test("getCode - invalid", async (t) => {
	try {
		const client = new Imperial(apikey);
		// @ts-expect-error we are testing that
		await client.getCode();
		t.fail("should have thrown an error");
		t.end();
	} catch (e) {
		if (e && e.statusCode === 0) {
			t.pass(`Throws an error: "${e}"`);
			t.end();
		} else if (e && e.statusCode === 429) {
			t.fail(e.statusCodeText);
			t.end();
		} else {
			t.fail(e);
			t.end();
		}
	}
});
