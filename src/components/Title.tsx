import { FC } from "react";

export type TitleProps = {
    title: string;
    subtitle?: string;
    children?: React.ReactNode;
};

const Title: FC<TitleProps> = ({ title, subtitle, children }) => {
    return (
        <div className="flex justify-between items-center mb-4">
            <h1 className="text-3xl font-bold text-light-text dark:text-dark-text">
                <p>{title}</p>
                <p className="text-uim-400 text-sm font-normal">{subtitle}</p>
            </h1>
            <div>{children}</div>
        </div>
    );
};

export default Title;
