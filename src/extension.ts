"use strict";

import * as vscode from "vscode";
import * as rangeMethods from "./rangeMethods";
import { getCommandGenerator } from "./command";
import { applyGeneratorToCursors } from "./utils";

export function activate(context: vscode.ExtensionContext) {
	console.log('Extension "vscode-text-pastry" is now active!');

	let disposables = [
		vscode.commands.registerCommand("extension.textPastry.1toX", async () =>
			applyGeneratorToCursors(
				await getCommandGenerator({ type: "i", start: 1, inc: 1 })
			)
		),
		vscode.commands.registerCommand("extension.textPastry.0toX", async () =>
			applyGeneratorToCursors(
				await getCommandGenerator({ type: "i", start: 0, inc: 1 })
			)
		),
		vscode.commands.registerCommand("extension.textPastry.AtoX", () =>
			rangeMethods.range(rangeMethods.range_AtoX)
		),
		vscode.commands.registerCommand("extension.textPastry.range", async () => {
			// try {
				const range = await rangeMethods.promptRange();
			applyGeneratorToCursors(await getCommandGenerator(range));
			// } catch (e) {
			// 	// Swallow errors
			// }
		}),
		vscode.commands.registerCommand(
			"extension.textPastry.wordList",
			async () => {
				// try {
					const list = await rangeMethods.promptWordList();
				return applyGeneratorToCursors(await getCommandGenerator(list));
				// } catch (e) {
				// 	// Swallow errors
				// }
			}
		),

		vscode.commands.registerCommand("extension.textPastry.paste", async () =>
			applyGeneratorToCursors(
				await getCommandGenerator({ type: "p", delimiter: "\n" })
			)
		),

		vscode.commands.registerCommand("extension.textPastry.uuid", () =>
			rangeMethods.range(rangeMethods.range_uuid)
		),
	];

	context.subscriptions.push(...disposables);
}

// this method is called when your extension is deactivated
export function deactivate() {}
