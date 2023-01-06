import { useContext } from "react";
import Calendar from "react-calendar";
import { useSelector } from "react-redux";

import Icon from "../../components/Icon";
import { LayoutContext } from "../../components/Layout";

import { selectEditTodoId } from "./todosSlice";

export function Sidebar() {
    const value = useContext(LayoutContext),
        editTodoId = useSelector(selectEditTodoId);
    return (
        <>
            <Calendar
                prevLabel={
                    <Icon
                        name="chevron_left"
                        size={28}
                        wrap={true}
                        wrapperClassName="text-pri-400 absolute right-8 top-0"
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
                        border: none;
                        border-radius: 0.5rem;
                    }

                    .react-calendar__navigation {
                        margin-bottom: 1.5rem;
                        position: relative;
                        display: flex;
                    }

                    .react-calendar__navigation__label {
                        text-align: left;
                    }

                    .react-calendar__navigation__label {
                        height: 28px;
                        padding: 0 0.3rem;
                    }

                    .react-calendar__navigation__label__labelText {
                        font-weight: 700;
                        text-align: left;
                        font-size: 1.25rem;
                    }

                    .react-calendar__month-view__weekdays > div {
                        display: flex;
                        justify-content: center;
                        margin-bottom: 0.5rem;
                    }

                    .react-calendar__month-view__weekdays abbr {
                        text-decoration: none;
                        font-weight: 700;
                        text-transform: uppercase;
                        font-size: 0.75rem;
                        text-align: center;
                        color: #a3a3a3;
                    }

                    .react-calendar__month-view__days {
                        display: grid !important;
                        grid-template-columns: repeat(
                            7,
                            calc((${value.sideBarWidth}px - 2rem) / 7)
                        );
                        grid-template-rows: repeat(
                            6,
                            calc((${value.sideBarWidth}px - 2rem) / 7)
                        );
                    }

                    .dark .react-calendar__month-view__days__day,
                    .dark .react-calendar__navigation__label {
                        color: #fff;
                    }

                    .react-calendar__tile--active {
                        background-color: #f97316;
                        color: #fff;
                    }

                    .dark .react-calendar__tile--active {
                        background-color: #f97316;
                        color: #fff;
                    }

                    .react-calendar__month-view__days__day {
                        margin: 0.15rem;
                        display: flex;
                        justify-content: center;
                        align-items: center;
                        border-radius: 1.5rem;
                        border: none;
                    }

                    .react-calendar__month-view__days__day::after,
                    .react-calendar__month-view__days__day::before {
                        content: "";
                        display: block;
                        width: 0.75rem;
                        height: 0.75rem;
                    }

                    .react-calendar__navigation__prev2-button,
                    .react-calendar__navigation__next2-button {
                        display: none;
                    }
                `}
            </style>
        </>
    );
}
