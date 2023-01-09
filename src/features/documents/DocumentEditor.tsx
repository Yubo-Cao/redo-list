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
import fileImage from "./fileImage";

import { cls } from "@/lib/utils";
import { AppDispatch } from "@/store";
import { useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";

type MdEditorProps = Omit<EditorProps, "value" | "onChange"> & {
    id: Document["id"];
    className?: string;
    style?: React.CSSProperties;
};

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
                        @apply rounded-lg border-none shadow-none;
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
