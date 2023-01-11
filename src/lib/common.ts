export type Status = "idle" | "loading" | "failed" | "needsUpdate";

export function pauseEvent(e) {
    if (e.stopPropagation) e.stopPropagation();
    if (e.preventDefault) e.preventDefault();
    e.cancelBubble = true;
    e.returnValue = false;
    return false;
}

export function unique<T>(array: T[]): T[] {
    const seen = new Set<T>(),
        result = [];
    for (let e of array) {
        if (seen.has(e)) continue;
        seen.add(e);
        result.push(e);
    }
    return result;
}
