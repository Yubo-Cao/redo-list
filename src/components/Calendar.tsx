import Icon from "./Icon";
import { useEffect, useRef } from "react";
import Calendar from "react-calendar";

export default function MDCalendar() {
    const ref = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (!ref.current) return;
        const navigation = ref.current.querySelector(
            ".react-calendar__navigation"
        );
        let label = null,
            icons = [];
        Array.from(navigation.children).forEach((child) => {
            if (child.classList.contains("react-calendar__navigation__label"))
                label = child;
            if (child.querySelectorAll("i").length) icons.push(child);
        });
        const f = (tag, cls, ...Children) => {
            const el = document.createElement(tag);
            el.className = cls;
            el.append(...Children);
            return el;
        };
        navigation.innerHTML = "";
        navigation.append(
            label,
            f("div", "flex items-center flex-0", ...icons)
        );
    }, [ref]);

    return (
        <div ref={ref}>
            <Calendar
                prevLabel={
                    <Icon
                        name="chevron_left"
                        size={28}
                        wrap={true}
                        wrapperClassName="text-pri-400"
                    />
                }
                nextLabel={
                    <Icon
                        name="chevron_right"
                        size={28}
                        wrap={true}
                        className="text-pri-400"
                    />
                }
                formatDay={(locale, date) => date.getDate()}
                defaultActiveStartDate={new Date()}
            />
            <style jsx global>
                {`
                    .react-calendar {
                        @apply max-w-xs dark:text-dark-text text-light-text
                            mx-auto border-0 rounded-md select-none;
                    }

                    .react-calendar__navigation {
                        @apply flex relative mb-6 px-1 justify-between items-center;
                    }

                    .react-calendar__navigation__label {
                        @apply text-left;
                    }

                    .react-calendar__navigation__label__labelText {
                        @apply font-bold text-xl text-left;
                    }

                    .react-calendar__month-view__weekdays > div {
                        @apply flex justify-center items-center mb-2;
                    }

                    .react-calendar__month-view__weekdays abbr {
                        @apply no-underline font-bold uppercase text-xs 
                            text-center text-uim-400;
                    }

                    .react-calendar__month-view__days {
                        display: grid !important;
                        @apply grid-rows-6 grid-cols-7 gap-1;
                    }

                    .react-calendar__month-view__days__day {
                        @apply aspect-square;
                        transition: background-color 0.3s ease;
                    }

                    .react-calendar__month-view__days__day:hover:not(
                            .react-calendar__tile--active
                        ) {
                        @apply bg-uim-100 dark:bg-uim-800;
                    }

                    .react-calendar__month-view__days__day--neighboringMonth {
                        @apply text-uim-400 font-thin;
                        @apply hover:bg-transparent dark:hover:bg-transparent;
                    }

                    .react-calendar__month-view__days__day {
                        @apply flex justify-center items-center rounded-full;
                    }

                    .react-calendar__tile--active {
                        @apply text-white bg-pri-500 dark:bg-pri-400;
                    }

                    .react-calendar__navigation__prev2-button,
                    .react-calendar__navigation__next2-button {
                        display: none;
                    }

                    @tailwind components;
                    @layer components {
                        .solid-button {
                            @apply bg-uim-100 dark:bg-uim-800 px-4 py-2 rounded-full 
                            hover:bg-uim-200 hover:dark:bg-uim-700;
                        }
                    }

                    .react-calendar__century-view__decades,
                    .react-calendar__decade-view__years,
                    .react-calendar__year-view__months {
                        @apply gap-3;

                        & > button {
                            flex: 0 0 auto !important;
                            @apply solid-button;
                        }
                    }

                    .react-calendar__century-view__decades {
                        @apply justify-center;
                    }
                `}
            </style>
        </div>
    );
}
