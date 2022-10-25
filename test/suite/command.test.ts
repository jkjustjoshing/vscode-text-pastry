import * as assert from "assert";
import { processCommand } from "../../src/command";

// You can import and use all API from the 'vscode' module
// as well as import your extension to test it
import * as vscode from "vscode";
// import * as myExtension from '../../extension';

suite("Process command", () => {
	vscode.window.showInformationMessage("Start all tests.");

	suite("number", () => {
		test("basic", () => {
			assert.deepEqual(processCommand("\\i"), {
				type: "i",
				start: 1,
				inc: 1,
			});
			assert.deepEqual(processCommand("\\i(4,2)"), {
				type: "i",
				start: 4,
				inc: 2,
			});
		});
		test("negative", () => {
			assert.deepEqual(processCommand("\\i(-3,-2)"), {
				type: "i",
				start: -3,
				inc: -2,
			});
		});
		test("decimals", () => {
			assert.deepEqual(processCommand("\\i(-0.3,-0.5)"), {
				type: "i",
				start: -0.3,
				inc: -0.5,
			});
		});
		test("extra spaces", () => {
			assert.deepEqual(processCommand("\\i   (   1,   10     )"), {
				type: "i",
				start: 1,
				inc: 10,
			});
		});
		test("missing closing paren", () => {
			assert.deepEqual(processCommand("\\i(1, 10"), {
				type: "i",
				start: 1,
				inc: 10,
			});
		});
	});

	suite("paste", () => {
		test("default delimiter", () => {
			assert.deepEqual(processCommand("\\p"), { type: "p", delimiter: /\s+/ });
		});
		test("custom delimiter", () => {
			assert.deepEqual(processCommand("\\p(\\n)"), {
				type: "p",
				delimiter: "\\n",
			});
		});
	});

	suite("insert nums", () => {
		test("basic", () => {
			assert.deepEqual(processCommand("1 100 1"), {
				type: "num",
				start: 1,
				inc: 100,
				minDigits: 1,
			});
		});
		test("complex", () => {
			assert.deepEqual(processCommand("-6 -1.5 10"), {
				type: "num",
				start: -6,
				inc: -1.5,
				minDigits: 10,
			});
		});
	});

	suite("list of words", () => {
		test("basic", () => {
			assert.deepEqual(processCommand("words alpha  beta \n gamma"), {
				type: "list",
				list: ["alpha", "beta", "gamma"],
			});
		});

		test("as default", () => {
			assert.deepEqual(processCommand("other    alpha  beta \n gamma"), {
				type: "list",
				list: ["other", "alpha", "beta", "gamma"],
			});
		});
	});
});
