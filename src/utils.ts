"use strict";

import * as vscode from "vscode";
const lodashSortBy = require("lodash.sortby");
const copyPaste = require("copy-paste");

export function getCursors(editBuilder): vscode.Selection[] {
	const editor = vscode.window.activeTextEditor;
	const { document, selections } = editor;

	return lodashSortBy(selections, ["start.line", "start.character"]);
}

export function getClipboardLines(): Promise<string[]> {
	return new Promise(function (resolve) {
		copyPaste.paste(function (err, val: string) {
			if (typeof val !== "string") {
				resolve([]);
			} else {
				resolve(val.replace("\r\n", "\n").split("\n"));
			}
		});
	});
}
