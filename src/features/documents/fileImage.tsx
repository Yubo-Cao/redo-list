import { readBinaryFile } from "@tauri-apps/api/fs";

export default function fileImage() {
    const PLACE_RE = /^https:\/\/file\/*/;
    let imageCache = new Map<string, string>();

    return {
        remark: (processor) =>
            processor.use(() => (tree) => {
                const images = [],
                    stack = [tree];
                while (stack.length) {
                    const node = stack.pop();
                    node.type === "image" && images.push(node);
                    node.children && stack.push(...node.children);
                }
                images.forEach((img) => {
                    const src = img.url;
                    if (!/^(https?:)?\/\//.test(src)) {
                        img.url = `https://file/${encodeURIComponent(src)}`; // pass the sanitizer
                    }
                });
            }),
        viewerEffect({ markdownBody }) {
            const images = markdownBody.querySelectorAll("img");
            images.forEach((img) => {
                const src = img.src;
                if (PLACE_RE.test(src)) {
                    const path = src.replace(PLACE_RE, "");
                    try {
                        if (imageCache.has(path)) {
                            img.src = imageCache.get(path)!;
                            return;
                        }
                        readBinaryFile(decodeURIComponent(path)).then(
                            (data) => {
                                const blob = new Blob([data], {
                                    type: "image/png"
                                });
                                const url = URL.createObjectURL(blob);
                                imageCache.set(path, url);
                                img.src = url;
                            }
                        );
                    } catch (e) {
                        console.log(e); // in case of invalid path
                    }
                }
                img.classList.add("mx-auto", "rounded-md");
                img.style.maxWidth = "min(100%, 600px)";
            });
        }
    };
}
