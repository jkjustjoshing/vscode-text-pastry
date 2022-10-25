import { window as vscodeWindow, Position } from "vscode";
import { env, Selection, window } from "vscode";
const lodashSortBy = require("lodash.sortby");

export function getCursors(editBuilder): Selection[] {
	const editor = window.activeTextEditor;
	const { document, selections } = editor;

	return lodashSortBy(selections, ["start.line", "start.character"]);
}

export async function getClipboardLines(): Promise<string[]> {
	const val = await env.clipboard.readText();
	if (typeof val !== "string") {
		return [];
	} else {
		return val.replace("\r\n", "\n").split("\n");
	}
}
export async function getClipboard(): Promise<string> {
	const val = await env.clipboard.readText();
	if (typeof val !== "string") {
		throw new Error("Clipboard did not contain text");
	} else {
		return val;
	}
}

export async function applyGeneratorToCursors(
	generator: () => Generator<string, never, unknown>
) {
	const editor = vscodeWindow.activeTextEditor;
	const gen = generator();

	editor.edit((editBuilder) => {
		let cursors = getCursors(editBuilder);
		cursors.forEach((selection, index) => {
			let range = new Position(selection.start.line, selection.start.character);
			editBuilder.insert(range, gen.next().value);
			editBuilder.delete(selection);
		});
	});
}
