/* Amazing tests done at 6 am */
/* eslint-disable */

// Prepare tests

import test from "tape";
// @ts-ignore
import tapDiff from "tap-diff";
import { readFileSync } from "fs";
import { Imperial } from "../lib";

test.createStream().pipe(tapDiff()).pipe(process.stdout);

const [apikey, documentUrl] = ((): string[] => {
	const path = `${__dirname}/../../test_data.txt`;
	let fileContent: null | string = null;
	try {
		fileContent = readFileSync(path, "utf-8").trim();
	} catch (err) {
		/* File not found */
	}

	if (!fileContent) return [];

	return fileContent.split(/\r?\n/);
})();

if (!apikey || !documentUrl) {
	console.log("> No token or valid documentUrl provided, aborting tests!");
	process.exit(0);
}

// Run all tests one after the other

test("verify - valid token", async (t) => {
	try {
		const client = new Imperial(apikey);
		const res = await client.verify();
		t.ok(res.success, "Token should be valid");
		t.match(res.message, /\svalid!$/i, "message should say it's valid");
	} catch (e) {
		if (e && e.statusCode === 429) {
			t.fail(e.statusCodeText);
		} else {
			t.fail(e);
		}
	}
	t.end();
});

test("verify - invalid token", async (t) => {
	try {
		const client = new Imperial("blahblah" /* Ah yes the invalid token */);
		const res = await client.verify();
		t.notok(res.success, "Token should not be valid");
		t.match(res.message, /\sinvalid!$/i, "Message should say it's invalid");
	} catch (e) {
		if (e.message == "No or invalid token was provided in the constructor!") {
			t.pass(e.message);
		} else if (e && e.statusCode === 429) {
			t.fail(e.statusCodeText);
		} else {
			t.fail(e);
		}
	}
	t.end();
});

test("verify - no token", async (t) => {
	try {
		const client = new Imperial();
		await client.verify();
		t.fail("Should have thrown an error");
	} catch (e) {
		if (e && e.message === "No or invalid token was provided in the constructor!") {
			t.pass(`Throws an error: "${e}"`);
		} else if (e && e.statusCode === 429) {
			t.fail(e.statusCodeText);
		} else {
			t.fail(e);
		}
	}

	t.end();
});

test("createDocument - valid", async (t) => {
	try {
		const client = new Imperial(apikey);
		const res = await client.createDocument("hi from test!", { instantDelete: true });
		t.ok(res.success, "First request should be completed");
		t.strictEqual(res.instantDelete, true, "instantDelete should be set to true");

		const res2 = await client.createDocument("hi from test!");
		t.ok(res2.success, "Second request should be completed");
		t.strictEqual(res2.instantDelete, false, "instantDelete should be set to false");
	} catch (e) {
		if (e && e.statusCode === 429) {
			t.fail(e.statusCodeText);
		} else {
			t.fail(e);
		}
	}

	t.end();
});

test("createDocument - invalid", async (t) => {
	try {
		const client = new Imperial(apikey);
		// @ts-ignore
		await client.createDocument();
		t.fail("Should have thrown an error");
	} catch (e) {
		if (e && e.message === "No text was provided!") {
			t.pass(`Throws an error: "${e}"`);
		} else if (e && e.statusCode === 429) {
			t.fail(e.statusCodeText);
		} else {
			t.fail(e);
		}
	}

	t.end();
});

test("getDocument - valid", async (t) => {
	try {
		const client = new Imperial(apikey);
		const res = await client.getDocument(documentUrl); // new magic epic url
		t.ok(res.success, "request should be completed");
		t.strictEqual(typeof res.document, "string", "document should be type of string");
	} catch (e) {
		if (e && e.statusCode === 429) {
			t.fail(e.statusCodeText);
		} else {
			t.fail(e);
		}
	}

	t.end();
});

test("getDocument - invalid", async (t) => {
	try {
		const client = new Imperial(apikey);
		// @ts-ignore
		await client.getDocument();
		t.fail("Should have thrown an error");
	} catch (e) {
		if (e && e.message === "No documentId was provided!") {
			t.pass(`Throws an error: "${e}"`);
		} else if (e && e.statusCode === 429) {
			t.fail(e.statusCodeText);
		} else {
			t.fail(e);
		}
	}

	t.end();
});

test("deprecated: getCode - valid", async (t) => {
	const handleEvent = (e: Error) => {
		if (e.name === "DeprecationWarning") {
			t.pass("Throws a deprecation warning.");
			process.removeListener("warning", handleEvent);
		}
	};

	try {
		process.on("warning", handleEvent);

		const client = new Imperial(apikey);

		const res = await client.getCode(documentUrl);

		t.ok(res.success, "Request should be completed");
	} catch (e) {
		t.fail(e);
	}

	t.end();
});

test("deprecated: getCode - invalid", async (t) => {
	const handleEvent = (e: Error) => {
		if (e.name === "DeprecationWarning") {
			t.pass("Throws a deprecation warning.");
			process.removeListener("warning", handleEvent);
		}
	};

	try {
		process.on("warning", handleEvent);

		const client = new Imperial(apikey);
		// @ts-ignore
		await client.getCode();
		t.fail("Should have thrown an error");
	} catch (e) {
		if (e && e.message === "No documentId was provided!") {
			t.pass(`Throws an error: "${e}"`);
		} else if (e && e.statusCode === 429) {
			t.fail(e.statusCodeText);
		} else {
			t.fail(e);
		}
	}

	t.end();
});

test("deprecated: postCode - valid", async (t) => {
	const handleEvent = (e: Error) => {
		if (e.name === "DeprecationWarning") {
			t.pass("Throws a deprecation warning.");
			process.removeListener("warning", handleEvent);
		}
	};

	try {
		process.on("warning", handleEvent);
		const client = new Imperial(apikey);
		const res = await client.postCode("hi from test!", { instantDelete: true });
		t.ok(res.success, "First request should be completed");
		t.strictEqual(res.instantDelete, true, "instantDelete should be set to true");

		process.on("warning", handleEvent);
		const res2 = await client.postCode("hi from test!");
		t.ok(res2.success, "Second request should be completed");
		t.strictEqual(res2.instantDelete, false, "instantDelete should be set to false");
	} catch (e) {
		if (e && e.statusCode === 429) {
			t.fail(e.statusCodeText);
		} else {
			t.fail(e);
		}
	}

	t.end();
});

test("deprecated: postCode - invalid", async (t) => {
	const handleEvent = (e: Error) => {
		if (e.name === "DeprecationWarning") {
			t.pass("Throws a deprecation warning.");
			process.removeListener("warning", handleEvent);
		}
	};

	try {
		process.on("warning", handleEvent);

		const client = new Imperial(apikey);
		// @ts-ignore
		await client.postCode();
		t.fail("Should have thrown an error");
	} catch (e) {
		if (e && e.message === "No text was provided!") {
			t.pass(`Throws an error: "${e}"`);
		} else if (e && e.statusCode === 429) {
			t.fail(e.statusCodeText);
		} else {
			t.fail(e);
		}
	}

	t.end();
});
