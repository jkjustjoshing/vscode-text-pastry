import { window as vscodeWindow } from "vscode";
import { getClipboard } from "./utils";

export async function command(rangeMethod: string[] | ((number) => string[])) {
	const result = await vscodeWindow.showInputBox({
		prompt: "Text Pastry Command-Line",
	});
	if (result === null || result === undefined) {
		// User cancelled
		throw new Error();
	}

	return processCommand(result);
}

export type Command =
	| null
	| {
			type: "i";
			start: number;
			inc: number;
	  }
	| { type: "p"; delimiter: RegExp | string }
	| { type: "num"; start: number; inc: number; minDigits: number }
	| { type: "list"; list: string[] };

export function processCommand(command: string): Command {
	let cmd = command.trim();

	// const cmdRegex = /^\\([a-z])\s*\(\s*(\d+)\s*)\)\s*$/;

	if (cmd[0] === "\\") {
		// might be a command
		const content = cmd.substring(1);
		let [command, restPlusParen] = content.split("(");
		command = command.trim();
		if (command.length > 1) {
			throw new Error("Command not valid");
		}
		const rest = (restPlusParen || "").replace(/\)$/, "").trim();
		switch (command) {
			case "i":
				if (rest.length === 0) {
					return { type: "i", start: 1, inc: 1 };
				}
				const [start, inc] = rest.split(",");
				const startNum = +start.trim();
				const incNum = +inc.trim();
				return { type: "i", start: startNum, inc: incNum };
			case "p":
				if (rest.trim().length === 0) {
					return { type: "p", delimiter: /\s+/ };
				}
				return { type: "p", delimiter: rest };
			default:
				throw new Error("Command not recognized");
		}
	}

	const match = cmd.match(/^([0-9\-\.]+)\s+([0-9\-\.]+)\s+([0-9]+)$/);
	if (match) {
		const [, start, inc, minDigits] = match;
		return { type: "num", start: +start, inc: +inc, minDigits: +minDigits };
	}

	const parts = cmd.split(/\s+/);
	if (parts[0] === "words") {
		const [, ...list] = parts;
		return { type: "list", list };
	}

	// As default
	return { type: "list", list: cmd.split(/\s+/) };

	// Possible commands
	// ✅ List of words: "a b c"
	// ✅ Clipboard: "\p"
	// ✅ Clipboard with separator: "\p(\n)"
	// ✅ From 1 to X: "\i"
	// ✅ From 100 jumping by 2: "\i(100,2)" - negative numbers work too
	// ✅ Insert nums: "2 100 4" becomes "0002, 0102, 0202" (2 is start, 100 is jump, 4 is minimum digits)
}

export async function getCommandGenerator(
	cmd: Command
): Promise<() => Generator<string, never, unknown>> {
	if (cmd.type === "i") {
		const { start, inc } = cmd;
		return function* () {
			let current = start;
			while (true) {
				yield String(current);
				current += inc;
			}
		};
	}
	if (cmd.type === "list") {
		const list = cmd.list;
		return function* () {
			let index = 0;
			while (true) {
				yield list[index];
				index = (index + 1) % list.length;
			}
		};
	}
	if (cmd.type === "num") {
		const { start, inc, minDigits } = cmd;
		return function* () {
			let current = start;
			while (true) {
				yield String(current).padStart(minDigits, "0");
				current += inc;
			}
		};
	}
	if (cmd.type === "p") {
		const clipboard = await getClipboard();
		const list = clipboard.split(cmd.delimiter);
		return function* () {
			let index = 0;
			while (true) {
				yield list[index];
				index = (index + 1) % list.length;
			}
		};
	}

	try {
		// @ts-expect-error
		cmd.type;
	} catch {}
	throw new Error("Should never reach here");
}
