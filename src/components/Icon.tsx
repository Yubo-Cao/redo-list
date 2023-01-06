import localFont from "@next/font/local";
import Image from "next/image";

import { cls } from "../lib/utils";

const materialIcons = localFont({
    src: "../public/fonts/material-symbols.woff2",
    display: "block" // no fallback
});

interface MaterialIconProps {
    size: number;
    name: string;
    className?: string;
    grade?: number;
    fill?: boolean;
    weight?: number;
}

interface ImageIconProps {
    size: number;
    className?: string;
    name: string;
    alt?: string;
}

interface BasicIconProps {
    size?: number;
    wrap?: boolean;
    iconSize?: number;
    className?: string;
    wrapperClassName?: string;
    style?: React.CSSProperties;
    wrapperStyle?: React.CSSProperties;
}

type InnerIconProps = MaterialIconProps | ImageIconProps;

function _icon(props: InnerIconProps) {
    const { name } = props,
        type = name.startsWith("/") ? "image" : "material";
    return {
        image: () => {
            const {
                name: src,
                size,
                alt = "Image Icon",
                className = ""
            } = props as ImageIconProps;
            return (
                <Image
                    src={src}
                    alt={alt}
                    width={size}
                    height={size}
                    className={className}
                />
            );
        },
        material: () => {
            const {
                name,
                size,
                grade = 0,
                fill = false,
                weight = 400,
                className = ""
            } = props as MaterialIconProps;
            return (
                <i
                    className={cls(
                        "antialiased",
                        materialIcons.className,
                        className
                    )}
                    style={{
                        // ligature
                        WebkitFontFeatureSettings: "liga",
                        MozFontFeatureSettings: "'liga'",
                        // material icons styles
                        fontSize: size,
                        fontWeight: "normal",
                        fontStyle: "normal",
                        lineHeight: 1,
                        letterSpacing: "normal",
                        textTransform: "none",
                        whiteSpace: "nowrap",
                        wordWrap: "normal",
                        direction: "ltr",
                        textRendering: "optimizeLegibility",
                        fontVariationSettings: `'wght' ${weight}, 'GRAD' ${grade}, 'FILL' ${
                            fill ? 1 : 0
                        }, 'opsz' ${size}`
                    }}
                >
                    {name}
                </i>
            );
        }
    }[type]();
}

type IconProps = InnerIconProps & BasicIconProps;

export default function Icon(props: IconProps) {
    const {
            size = 24,
            iconSize = size,
            wrap = size !== iconSize,
            wrapperClassName,
            wrapperStyle
        } = props,
        icon = _icon({
            ...props,
            size: iconSize
        });
    if (!wrap && !wrapperClassName) return icon;
    return (
        <div
            className={cls(
                "flex items-center justify-center",
                wrapperClassName
            )}
            style={{
                width: size,
                height: size,
                ...wrapperStyle
            }}
        >
            {icon}
        </div>
    );
}

export { Icon };
export type { IconProps };
