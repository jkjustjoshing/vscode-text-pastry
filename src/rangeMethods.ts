'use strict';

import * as vscode from 'vscode';
import { getCursors } from './utils';

export function range (rangeMethod: (number) => string[]) {
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

export function range_generic (count: number, start: number): string[] {
    let a: string[] = [];
    let end = count + start;
    for (let i = start; i < end; ++i) {
        a.push(String(i));
    }
    return a;
}

export function range_0toX (count: number): string[] {
    return range_generic(count, 0);
}

export function range_1toX (count: number): string[] {
    return range_generic(count, 1);
}