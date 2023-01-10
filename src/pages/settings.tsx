import gfm from "@bytemd/plugin-gfm";
import { Editor } from "@bytemd/react";
import 'bytemd/dist/index.css';
import { useState } from "react";

const plugins = [gfm()];

export default function Index() {
    const [value, setValue] = useState("");
    return (
        <>
            <Editor
                value={value}
                plugins={plugins}
                onChange={(v) => {
                    setValue(v);
                }}
            />
        </>
    );
}
