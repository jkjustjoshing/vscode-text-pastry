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
        vscode.commands.registerCommand('extension.textPastry.range', () => rangeMethods.promptRange().then(range => rangeMethods.range(rangeMethods.range_generic(range)))),
        vscode.commands.registerCommand('extension.textPastry.wordList', () => rangeMethods.promptWordList().then(list => rangeMethods.range(list))),

        vscode.commands.registerCommand('extension.textPastry.paste', () => utils.getClipboardLines().then(lines => {
            return rangeMethods.range(lines);
        })),

        vscode.commands.registerCommand('extension.textPastry.uuid', () => rangeMethods.range(rangeMethods.range_uuid))
    ];

    context.subscriptions.push(...disposables);
}

// this method is called when your extension is deactivated
export function deactivate() {
}
