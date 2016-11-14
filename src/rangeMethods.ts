'use strict';

import * as vscode from 'vscode';
import { getCursors } from './utils';
import * as uuid from 'uuid';

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

export function promptRange(
    prompt: string = 'Please input "start [step]" values'): Promise<{start: number, step: number}> {
    return new Promise((resolve, reject) => {
        return vscode.window.showInputBox({ prompt }).then(result => {
            if (result == null) {
                reject();
            }

            const inputs = result.split(' ');
            let start: number = +inputs[0];
            let step: number = inputs.length >= 2 ? +inputs[1] : 1;

            if (isNaN(start)) {
                resolve(promptRange(`Start "${start}" is an invalid number. Please enter a number.`));
            }
            if (isNaN(step)) {
                resolve(promptRange(`Step "${step}" is an invalid number. Please enter a number`));
            }
            resolve({ start, step });
        });
    });
};

export function range_generic(start: number, step: number = 1): (number) => string[] {
    return function (count: number): string[] {
        let a: string[] = [];
        let i = start;

        while (count-- > 0) {
            a.push(String(i));
            i += step;
        }

        return a;
    }
};

export function range_0toX (count: number): string[] {
    return range_generic(0)(count);
}

export function range_1toX (count: number): string[] {
    return range_generic(1)(count);
}

export function range_AtoX (count: number): string[] {
    let a: string[] = [];
    let startCode = 'a'.charCodeAt(0);
    for (let i = 0; i < count; ++i) {
        const offset = i % 26; // only loop through lower case a-z
        a.push(String.fromCharCode(startCode + offset));
    }
    return a;
}

export function range_uuid (count: number): string[] {
    let a: string[] = [];
    for (let i = 0; i < count; ++i) {
        a.push(uuid.v4().toLowerCase());
    }
    return a;
}