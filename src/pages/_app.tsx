import { Roboto_Flex } from "@next/font/google";
import type { AppProps } from "next/app";
import { Provider } from "react-redux";

import { cls } from "@lib/utils";

import store from "../store";
import "@styles/globals.css";

const sans = Roboto_Flex({
    variable: "--font-sans",
    subsets: ["latin"]
});

export default function App({ Component, pageProps }: AppProps) {
    return (
        <Provider store={store}>
            <div className={cls(sans.variable, "font-sans")}>
                <Component {...pageProps} />
            </div>
        </Provider>
    );
}
