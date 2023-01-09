function cls(...args: (string | null | undefined | boolean)[]): string {
    const clz = args
        .filter((x) => x && typeof x === "string")
        .map((x) => (x as string).split(/\s+/))
        .flat();
    return clz.join(" ");
}

function coerce(value: number, min: number, max: number): number {
    return Math.min(Math.max(value, min), max);
}

export { cls, coerce };
