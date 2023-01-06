const themeColors = require("tailwindcss/colors"),
    { orange: primary, yellow: secondary, neutral: unimportant } = themeColors,
    lightSurface = "#ffffff",
    darkSurface = unimportant[900];

const prefixer = (prefix, obj) => {
    let newObj = {};
    for (const key in obj) {
        newObj[`${prefix}-${key}`] = obj[key];
    }
    return newObj;
};

const primaryColors = prefixer("pri", primary),
    secondaryColors = prefixer("sec", secondary),
    unimportantColors = prefixer("uim", unimportant),
    colors = {
        ...primaryColors,
        ...secondaryColors,
        ...unimportantColors,
        "light-surface": lightSurface,
        "dark-surface": darkSurface,
        "dark-text": "#e3e3e3",
        "light-text": "#000000"
    };

/** @type {import('tailwindcss').Config} */
module.exports = {
    content: [
        "./src/pages/**/*.{js,ts,jsx,tsx}",
        "./src/components/**/*.{js,ts,jsx,tsx}",
        "./src/features/**/*.{js,ts,jsx,tsx}"
    ],
    darkMode: "class",
    theme: {
        extend: {
            colors: colors,
            backgroundColor: colors,
            borderColor: colors,
            textColor: colors,
            borderColor: colors,
            boxShadowColor: colors,
            gradientColorStops: colors,
            ringColor: colors,
            ringOffsetColor: colors,
            gridTemplateColumns: (theme) => {
                const spacing = theme("spacing");
                return Object.keys(spacing).reduce(
                    (accumulator, spacingKey) => {
                        return {
                            ...accumulator,
                            [`fit-${spacingKey}`]: `repeat(auto-fit,minmax(${spacing[spacingKey]}, 1fr))`
                        };
                    },
                    {}
                );
            },
            translate: {
                fuller: "200%"
            },
            fontFamily: {
                sans: ["var(--font-sans)"]
            }
        },
        screens: {
            "2xs": "320px",
            xs: "480px",
            sm: "640px",
            md: "768px",
            lg: "1024px",
            xl: "1280px",
            "2xl": "1536px"
        }
    },
    plugins: [require("@tailwindcss/forms"), require("@tailwindcss/typography")]
};
