'use strict';

import * as vscode from 'vscode';
import { getCursors } from './utils';
import * as uuid from 'uuid';

export function range (rangeMethod: (string[] | ((number) => string[]))) {
    const editor = vscode.window.activeTextEditor;

    editor.edit(editBuilder => {
        let cursors = getCursors(editBuilder);
        let itemsToInsert;
        if (typeof rangeMethod === 'function') {
            itemsToInsert = rangeMethod(cursors.length);
        }
        else {
            itemsToInsert = rangeMethod;
        }
        cursors.forEach((selection, index) => {
            let range = new vscode.Position(selection.start.line, selection.start.character);
            editBuilder.insert(range, itemsToInsert[index]);
            editBuilder.delete(selection);
        });
    });
}

export async function promptRange (prompt: string = 'Where should the range start?'): Promise<number> {
    const result = await vscode.window.showInputBox({ prompt });
    if (result === null || result === undefined) {
        // User cancelled
        throw new Error();
    }
    let num: number = +result;
    if (isNaN(num)) {
        return promptRange(`"${result}" is an invalid number. Enter a number.`);
    }
    return num;
};

export async function promptWordList (prompt: string = 'List of words (space separated)'): Promise<string[]> {
    const result = await vscode.window.showInputBox({ prompt });

    if (result === null || result === undefined) {
        // User cancelled
        throw new Error();
    }
    const words = result.split(/\s+/)
    return words;
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

export function randomIntFromInterval(min, max) { // min and max included
    return Math.floor(Math.random() * (max - min + 1) + min)
  }

export function random_generic (start: number): (number) => string[] {
    return function (count: number): string[] {
        let a: string[] = [];
        let end = count + start;
        for (let i = start; i < end; ++i) {
            a.push(String(randomIntFromInterval(start, end)));
        }
        return a;
    };
}

export async function promptRandomMinMax (
    prompt: string = 'Enter the min and max values (space seperated)'
    ): Promise<string[]> {
    const result = await vscode.window.showInputBox({ prompt });

    if (result === null || result === undefined) {
        // User cancelled
        throw new Error();
    }
    const words = result.split(/\s+/)
    return random_generic(+words[0])(+words[1]);
};

export function random_1toX (count: number): string[] {
    return random_generic(1)(count);
}
    
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
