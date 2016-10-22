import * as vscode from 'vscode';

const lodashSortBy = require('lodash.sortby');

export const COMMAND_LABELS = {
    '1toX': '1toX',
    '0toX': '0toX'
};

export function runCommand (command: string) {
    const editor = vscode.window.activeTextEditor;
    const { document, selections } = editor;

    editor.edit(editBuilder => {
        let orderedSelections = lodashSortBy(selections, [ 'start.line', 'start.character' ]);
        orderedSelections.forEach((selection, index) => {
            let range = new vscode.Position(selection.start.line, selection.start.character);
            if (command === '1toX') {
                editBuilder.insert(range, String(index + 1));
            }
            if (command === '0toX') {
                editBuilder.insert(range, String(index));
            }
            editBuilder.delete(selection);
        });
    });
}