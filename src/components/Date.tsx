export function formatDate(date: Date | String) {
    if (typeof date === "string") {
        try {
            date = fromISO(date);
        } catch (e) {
            return "Not specified";
        }
    }
    if (date.toLocaleDateString() === new Date().toLocaleDateString()) {
        return "Today";
    }
    return date.toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric"
    });
}

export function toISO(date: Date | string) {
    if (typeof date === "string") {
        date = new Date(date);
    }
    const offset = date.getTimezoneOffset();
    date = new Date(date.getTime() - offset * 60 * 1000);
    return date.toISOString().split("T")[0];
}

export function fromISO(date: string): Date {
    const offset = new Date().getTimezoneOffset();
    date = new Date(date).toISOString();
    const time = new Date(date).getTime() + offset * 60 * 1000;
    return new Date(time);
}
