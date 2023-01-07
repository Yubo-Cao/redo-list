function cls(...args: (string | null | undefined | boolean)[]): string {
    const clz = args
        .filter((x) => x && typeof x === "string")
        .map((x) => (x as string).split(/\s+/))
        .flat();
    return clz.join(" ");
}

export { cls };
