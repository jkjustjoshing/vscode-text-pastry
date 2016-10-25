'use strict';

import * as vscode from 'vscode';
const lodashSortBy = require('lodash.sortby');

export function getCursors (editBuilder): vscode.Selection[] {
    const editor = vscode.window.activeTextEditor;
    const { document, selections } = editor;

    return lodashSortBy(selections, [ 'start.line', 'start.character' ]);
}