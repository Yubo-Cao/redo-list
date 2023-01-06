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
        console.error("Tauri invoke called in Node.js");
        return Promise.resolve(undefined as unknown as T);
    }
    console.log("Tauri invoke called in browser");
    const tauriAppsApi = await import("@tauri-apps/api");
    const tauriInvoke = tauriAppsApi.invoke;
    return tauriInvoke(cmd, args);
};
