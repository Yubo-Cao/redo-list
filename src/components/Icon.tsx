import { cls } from "../lib/utils";

import localFont from "@next/font/local";
import Image from "next/image";

interface MaterialIconProps {
    size: number;
    name: string;
    className?: string;
    grade?: number;
    fill?: boolean;
    weight?: number;
    style?: React.CSSProperties;
}

interface ImageIconProps {
    size: number;
    className?: string;
    style?: React.CSSProperties;
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
                className = "",
                style
            } = props as ImageIconProps;
            return (
                <Image
                    src={src}
                    alt={alt}
                    width={size}
                    height={size}
                    className={className}
                    style={style}
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
                className = "",
                style
            } = props as MaterialIconProps;
            return (
                <i
                    className={cls("antialiased", "material-icons", className)}
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
                        }, 'opsz' ${size}`,
                        ...style
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
