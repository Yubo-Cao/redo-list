import type { InvokeArgs } from "@tauri-apps/api/tauri";

const isNode = (): boolean =>
    Object.prototype.toString.call(
        typeof process !== "undefined" ? process : 0
    ) === "[object process]";

export const invoke = async <T>(
    cmd: string,
    args?: InvokeArgs | undefined
): Promise<T> => {
    if (isNode()) {
        return Promise.resolve(undefined as unknown as T);
    }
    const tauriAppsApi = await import("@tauri-apps/api");
    const tauriInvoke = tauriAppsApi.invoke;
    try {
        return tauriInvoke(cmd, args);
    } catch (e) {
        console.error(e);
    }
};
