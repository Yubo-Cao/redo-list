import React, { ReactNode } from "react";

import { cls } from "../lib/utils";

type TitleProps = {
    level: 1 | 2 | 3 | 4 | 5 | 6;
    title?: string | ReactNode;
    subtitle?: string | ReactNode;
    className?: string;
    subtitleClassName?: string;
    children?: string | ReactNode;
};

const titleCase = (str: string | ReactNode) =>
    typeof str === "string"
        ? str
              .split(/\s+/)
              .filter((s) => s)
              .map((s) => s[0].toUpperCase() + s.substring(1))
              .join(" ")
        : str;

export default function Title({
    level,
    children,
    title = children,
    subtitle = (title !== children && children) || "",
    className = "",
    subtitleClassName = ""
}: TitleProps) {
    if (!title) throw new Error("Title is required");
    title = titleCase(title);
    subtitle = titleCase(subtitle);

    const styles: { [key: string]: string } = {
        h1: cls(
            "text-7xl",
            "font-black",
            "bg-clip-text",
            "text-transparent",
            "bg-gradient-to-r",
            "from-pri-500",
            "to-sec-500"
        ),
        h2: cls(
            "text-5xl",
            "font-bold",
            "after:content-['']",
            "after:block",
            "after:w-32",
            "after:h-1",
            "after:mb-4",
            "after:mt-2",
            "after:rounded-full",
            "after:bg-gradient-to-r",
            "after:from-pri-500",
            "after:to-sec-500"
        ),
        h3: "text-2xl font-bold",
        h4: "text-xl font-semibold",
        h5: "text-lg font-medium",
        h6: "text-base font-medium"
    };

    return (
        <div>
            {React.createElement(
                "h" + level,
                {
                    className: cls(styles[("h" + level) as string], className)
                },
                title,
                []
            )}
            {subtitle !== "" &&
                React.createElement("div", { className: cls(subtitleClassName) }, subtitle, [])}
        </div>
    );
}
