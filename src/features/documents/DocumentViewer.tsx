import gfm from "@bytemd/plugin-gfm";
import { Viewer } from "@bytemd/react";
import "bytemd/dist/index.css";
import fileImage from "./fileImage";

import { selectDocumentById } from "./documentSlice";
import { Document } from "./documentSlice";
import { useSelector } from "react-redux";

export function DocumentViewer({
    id,
    placeholder
}: {
    id: Document["id"];
    placeholder?: string;
}) {
    const document = useSelector(selectDocumentById(id)),
        { content } = document;

    return (
        <div className="prose-sm max-w-none">
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
