import { env, exports } from "cloudflare:workers";
import { it } from "vitest";

// Regression test for https://github.com/cloudflare/workers-sdk/issues/12924
//
// Calling exports.default.fetch() on a worker whose fetch handler uses a
// dynamic import() would hang with "Cannot perform I/O on behalf of a
// different Durable Object". Pre-loading the module (e.g. via a static
// import of the worker) masks the bug by caching the module.
it("exports.default.fetch() with dynamic import()", async ({ expect }) => {
	const response = await exports.default.fetch(
		new Request("https://example.com/")
	);
	expect(response.status).toBe(200);
	expect(await response.text()).toBe("Hello, World!");
});

// Covers https://github.com/cloudflare/workers-sdk/issues/5387 and the concurrent
// imports reported in https://github.com/cloudflare/workers-sdk/issues/16850.
it("shares a deferred module evaluation across Durable Objects", async ({
	expect,
}) => {
	const responses = await Promise.all(
		["first", "second", "third"].map((name) =>
			env.GREETER.get(env.GREETER.idFromName(name)).fetch(
				"https://example.com/"
			)
		)
	);
	expect(responses.map((response) => response.status)).toEqual([200, 200, 200]);
	const greetings = await Promise.all(
		responses.map((response) => response.text())
	);
	expect(greetings).toEqual(["Hello, DO!", "Hello, DO!", "Hello, DO!"]);
});
