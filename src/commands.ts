import * as vscode from 'vscode';

const lodashSortBy = require('lodash.sortby');

export function runCommand (rangeMethod: (number) => string[]) {
    const editor = vscode.window.activeTextEditor;

    editor.edit(editBuilder => {
        let cursors = getCursors(editBuilder);
        let itemsToInsert = rangeMethod(cursors.length);
        cursors.forEach((selection, index) => {
            let range = new vscode.Position(selection.start.line, selection.start.character);
            editBuilder.insert(range, itemsToInsert[index]);
            editBuilder.delete(selection);
        });
    });
}

function getCursors (editBuilder): vscode.Selection[] {
    const editor = vscode.window.activeTextEditor;
    const { document, selections } = editor;

    return lodashSortBy(selections, [ 'start.line', 'start.character' ]);
}