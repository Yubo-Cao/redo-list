import { Viewer } from "@bytemd/react";

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
        <div className="prose max-w-none">
            <Viewer value={content || placeholder} />
        </div>
    );
}
