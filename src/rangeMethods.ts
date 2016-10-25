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