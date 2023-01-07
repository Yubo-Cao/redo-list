function cls(...args: (string | null | undefined | boolean)[]): string {
    return args.filter((x) => x && typeof x === "string").join(" ");
}

export { cls };
