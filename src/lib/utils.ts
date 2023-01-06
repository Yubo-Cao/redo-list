function cls(...args: string[]) {
    return args.filter((x) => x).join(" ");
}

export { cls };
