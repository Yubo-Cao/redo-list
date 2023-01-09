export function formatDate(date: Date | String) {
    if (typeof date === "string") {
        try {
            date = fromISO(date);
        } catch (e) {
            return "Not specified";
        }
    }
    date = date as Date;
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

export function fromDuration(duration: String): number {
    const [hours, minutes, seconds] = duration.split(":");
    return (
        parseInt(hours) * 60 * 60 + parseInt(minutes) * 60 + parseInt(seconds)
    );
}

export function toDuration(duration: number): string {
    if (!duration) return "00:00:00";

    const hours = Math.floor(duration / 3600);
    const minutes = Math.floor((duration % 3600) / 60);
    const seconds = Math.floor(duration % 60);
    return (
        hours.toString().padStart(2, "0") +
        ":" +
        minutes.toString().padStart(2, "0") +
        ":" +
        seconds.toString().padStart(2, "0")
    );
}
