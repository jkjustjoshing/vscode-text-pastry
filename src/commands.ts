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
            let orderedSelections = lodashSortBy(selections, [ 'start.line', 'start.character' ]);
            orderedSelections.forEach((selection, index) => {
                let range = new vscode.Position(selection.start.line, selection.start.character);
                editBuilder.insert(range, String(index + 1));
                editBuilder.delete(selection);
            });
        }
    });
}