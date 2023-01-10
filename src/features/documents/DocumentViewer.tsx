import gfm from "@bytemd/plugin-gfm";
import { Viewer } from "@bytemd/react";
import "bytemd/dist/index.css";

import { cls } from "@/lib/utils";
import { useAppSelector } from "@/store";
import { Document, selectDocumentById } from "./documentSlice";
import fileImage from "./fileImage";

export type DocumentViewerProps = Omit<
    React.HTMLAttributes<HTMLDivElement>,
    "id"
> & {
    id: Document["id"];
    placeholder?: string;
};

export function DocumentViewer({
    id,
    placeholder,
    className,
    ...rest
}: DocumentViewerProps) {
    const document = useAppSelector(selectDocumentById(id)),
        { content } = document;

    return (
        <div
            className={cls(
                "prose max-w-none text-light-text dark:text-dark-text",
                className
            )}
            {...rest}
        >
            <Viewer
                value={content || placeholder}
                plugins={[gfm(), fileImage()]}
            />
            <style global jsx>
                {`
                    .markdown-body *:first-child {
                        margin-top: 0;
                        padding-top: 0;
                    }

                    .markdown-body *:last-child {
                        margin-bottom: 0;
                        padding-bottom: 0;
                    }
                `}
            </style>
        </div>
    );
}
