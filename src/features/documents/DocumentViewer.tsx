import gfm from "@bytemd/plugin-gfm";
import { Viewer } from "@bytemd/react";
import "bytemd/dist/index.css";

import { Document, selectDocumentById } from "./documentSlice";
import fileImage from "./fileImage";
import NoSsr from "@/components/NoSsr";
import { cls } from "@/lib/utils";
import { useAppSelector } from "@/store";

export type DocumentViewerProps = Omit<
    React.HTMLAttributes<HTMLDivElement>,
    "id"
> & {
    id: Document["id"];
    placeholder?: string;
};

export default function DocumentViewer({
    id,
    placeholder,
    className,
    ...rest
}: DocumentViewerProps) {
    const document = useAppSelector(selectDocumentById(id)),
        { content } = document;

    return (
        <NoSsr>
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
        </NoSsr>
    );
}
