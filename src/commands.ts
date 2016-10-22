import * as vscode from 'vscode';

const lodashSortBy = require('lodash.sortby');

export const COMMAND_LABELS = {
    '1toX': '1toX'
};

export function runCommand (command: string) {
    const editor = vscode.window.activeTextEditor;
    const { document, selections } = editor;

    editor.edit(editBuilder => {
        if (command === '1toX') {
            let orderedSelections = lodashSortBy(selections, (selection: vscode.Selection) => selection.start.line);
            orderedSelections.forEach((location, index) => {
                let range = new vscode.Position(location.start.line, location.start.character);
                editBuilder.insert(range, String(index + 1));
            });
        }
    });
}