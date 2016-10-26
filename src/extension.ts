'use strict';

import * as vscode from 'vscode';
import * as rangeMethods from './rangeMethods';

export function activate(context: vscode.ExtensionContext) {

    console.log('Extension "vscode-text-pastry" is now active!');

    let disposables = [
        vscode.commands.registerCommand('extension.textPastry.1toX', () => rangeMethods.range(rangeMethods.range_1toX)),
        vscode.commands.registerCommand('extension.textPastry.0toX', () => rangeMethods.range(rangeMethods.range_0toX)),
        vscode.commands.registerCommand('extension.textPastry.AtoX', () => rangeMethods.range(rangeMethods.range_AtoX)),
        vscode.commands.registerCommand('extension.textPastry.range', () => rangeMethods.promptRange().then(range => rangeMethods.range(rangeMethods.range_generic(range))))
    ];

    context.subscriptions.push(...disposables);
}

// this method is called when your extension is deactivated
export function deactivate() {
}