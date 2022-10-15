'use strict';

import * as vscode from 'vscode';
import * as rangeMethods from './rangeMethods';
import * as utils from './utils';

export function activate(context: vscode.ExtensionContext) {

    console.log('Extension "vscode-text-pastry" is now active!');

    let disposables = [
        vscode.commands.registerCommand('extension.textPastry.1toX', () => rangeMethods.range(rangeMethods.range_1toX)),
        vscode.commands.registerCommand('extension.textPastry.0toX', () => rangeMethods.range(rangeMethods.range_0toX)),
        vscode.commands.registerCommand('extension.textPastry.AtoX', () => rangeMethods.range(rangeMethods.range_AtoX)),
        vscode.commands.registerCommand('extension.textPastry.range', async () => {
            try {
                const range = await rangeMethods.promptRange()
                return rangeMethods.range(rangeMethods.range_generic(range))
            } catch (e) {
                // Swallow errors
            }
        }),
        vscode.commands.registerCommand('extension.textPastry.wordList', async () => {
            try {
                const list = await rangeMethods.promptWordList()
                return rangeMethods.range(list)
            } catch (e) {
                // Swallow errors
            }
        }),

        vscode.commands.registerCommand('extension.textPastry.paste', () => utils.getClipboardLines().then(lines => {
            return rangeMethods.range(lines);
        })),

        vscode.commands.registerCommand('extension.textPastry.uuid', () => rangeMethods.range(rangeMethods.range_uuid)),

        vscode.commands.registerCommand('extension.textPastry.1toX_random', () => rangeMethods.range(rangeMethods.random_1toX)),

        vscode.commands.registerCommand('extension.textPastry.XtoY_random', async () => {
            try {
                const list = await rangeMethods.promptRandomMinMax()
                return rangeMethods.range(list)
            } catch (e) {
                // Swallow errors
            }
        }),

    ];

    context.subscriptions.push(...disposables);
}

// this method is called when your extension is deactivated
export function deactivate() {
}
