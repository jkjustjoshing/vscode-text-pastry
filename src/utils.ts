"use strict";

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
