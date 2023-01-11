import DocumentEditor from "./DocumentEditor";
import DocumentViewer from "./DocumentViewer";
import { Document } from "./documentSlice";
import { useRef, useState } from "react";

export type TransparentEditorProps = {
    id: Document["id"];
    className?: string;
    style?: React.CSSProperties;
    placeholder?: string;
    edit?: boolean;
    onEdit?: (edit: boolean) => void;
};

export const TransparentEditor: React.FC<TransparentEditorProps> = (props) => {
    const { id, className, placeholder, style } = props;
    // edit
    let { edit, onEdit } = props;
    const [_edit, _setEdit] = useState(edit);
    onEdit = onEdit != null ? onEdit : _setEdit;

    const ref = useRef<HTMLDivElement>(null);

    return (
        <div
            onKeyDown={(e) => {
                if (e.ctrlKey && e.key === "Enter") {
                    onEdit(false);
                }
                if (document.activeElement === ref.current) {
                    if (e.key === "Enter" || e.key === " ") {
                        onEdit(true);
                    }
                }
                if (e.key === "Escape") onEdit(false);
            }}
            ref={ref}
            tabIndex={0}
            className={className}
            style={style}
        >
            {_edit ? (
                <DocumentEditor id={id} />
            ) : (
                <DocumentViewer
                    id={id}
                    placeholder={placeholder}
                    onClick={(e) => onEdit(true)}
                    className="px-3 py-2 cursor-pointer"
                />
            )}
        </div>
    );
};
