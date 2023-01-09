import {
    Document,
    addResourcesToDocument,
    fetchDocument,
    selectDocumentContentById,
    selectDocumentStatusById,
    updateDocument
} from "@features/documents/documentSlice";

import gfm from "@bytemd/plugin-gfm";
import { Editor, EditorProps } from "@bytemd/react";
import "bytemd/dist/index.css";

import { readBinaryFile } from "@tauri-apps/api/fs";

import { AppDispatch } from "@/store";
import { useDispatch, useSelector } from "react-redux";
import { useEffect, useRef } from "react";
import { cls } from "@/lib/utils";

type MdEditorProps = Omit<EditorProps, "value" | "onChange"> & {
    id: Document["id"];
    className?: string;
    style?: React.CSSProperties;
};

function fileImage() {
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

export default function DocumentEditor(props: MdEditorProps) {
    const { className, style, id, editorConfig, ...rest } = props,
        dispatch = useDispatch<AppDispatch>(),
        value = useSelector(selectDocumentContentById(id)),
        valueLoaded =
            useSelector(selectDocumentStatusById(id))?.content === "updated",
        ref = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const current = ref.current;
        if (!current) return;
        current
            .querySelector(".bytemd-preview")
            .classList.add(
                "prose",
                "dark:prose-invert",
                "prose-stone",
                "max-w-none"
            );
        const codeMirror = current.querySelector(
            ".CodeMirror"
        ) as HTMLDivElement;
        if (codeMirror) {
            codeMirror.style.fontFamily = "'Fira Code', monospace";
            codeMirror.classList.add("cm-s-icecoder");
        }
    }, [ref]);

    if (!valueLoaded) {
        dispatch(fetchDocument(id));
        return (
            <div
                className={cls(
                    "animate-pulse",
                    "bg-uim-100 dark:bg-uim-800 rounded-md",
                    className
                )}
                style={style}
            />
        );
    }

    return (
        <div className={cls("documentEditor", className)} ref={ref}>
            <Editor
                value={value}
                plugins={[gfm(), fileImage()]}
                onChange={(value) =>
                    dispatch(
                        updateDocument({
                            id: props.id,
                            update: { content: value }
                        })
                    )
                }
                editorConfig={{
                    ...editorConfig,
                    theme: "material"
                }}
                {...rest}
                uploadImages={async (files: File[]) => {
                    const {
                        payload: { resources }
                    } = (await dispatch(
                        addResourcesToDocument({
                            id: props.id,
                            images: files
                        })
                    )) as unknown as {
                        payload: {
                            id: Document["id"];
                            resources: Document["resources"];
                        };
                    }; // TODO: Fix type for dispatch
                    return resources.map((path) => ({
                        url: `https://file/${encodeURIComponent(path)}`,
                        alt: ""
                    }));
                }}
            />
            <style jsx global>{`
                .documentEditor {
                    .bytemd {
                        @apply h-auto rounded-lg border-none shadow-none;
                        @apply bg-light-surface dark:bg-dark-surface;
                    }

                    .bytemd-toolbar-tab-active {
                        @apply text-pri-500 dark:text-pri-600 font-bold;
                    }

                    [bytemd-tippy-path="5"] {
                        @apply hidden;
                    }

                    .bytemd-editor {
                        .cm-header {
                            @apply text-pri-500 dark:text-pri-300;
                        }
                        .cm-header-1 {
                            @apply text-xl;
                        }
                        .cm-header-2 {
                            @apply text-lg;
                        }
                    }
                }
            `}</style>
        </div>
    );
}
