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

export function promptRange (prompt: string = 'Where should the range start?'): Promise<number> {
    return new Promise((resolve, reject) => {
        return vscode.window.showInputBox({ prompt }).then(result => {
            if (result == null) {
                // User cancelled
                reject();
            }
            let num: number = +result;
            if (isNaN(num)) {
                resolve(promptRange(`"${result}" is an invalid number. Where should the range start?`));
            }
            resolve(num);
        });
    });
};

export function range_generic (start: number): (number) => string[] {
    return function (count: number): string[] {
        let a: string[] = [];
        let end = count + start;
        for (let i = start; i < end; ++i) {
            a.push(String(i));
        }
        return a;
    };
}

export function range_0toX (count: number): string[] {
    return range_generic(0)(count);
}

export function range_1toX (count: number): string[] {
    return range_generic(1)(count);
}