import * as vscode from 'vscode';

const lodashSortBy = require('lodash.sortby');

export const COMMAND_LABELS = {
    '1toX': '1toX',
    '0toX': '0toX'
};

export function runCommand (command: string) {
    const editor = vscode.window.activeTextEditor;

    editor.edit(editBuilder => {
        getCursors(editBuilder).forEach((cursor, index) => {
            let range = new vscode.Position(cursor.start.line, cursor.start.character);
            if (command === '1toX') {
                editBuilder.insert(range, String(index + 1));
            }
            if (command === '0toX') {
                editBuilder.insert(range, String(index));
            }
            editBuilder.delete(cursor);
        });
    });
}

function getCursors (editBuilder): vscode.Selection[] {
    const editor = vscode.window.activeTextEditor;
    const { document, selections } = editor;

    return lodashSortBy(selections, [ 'start.line', 'start.character' ]);
}