export function formatDate(date: Date | string) {
    if (typeof date === "string") {
        date = new Date(date);
    }
    if (date.toLocaleDateString() === new Date().toLocaleDateString()) {
        return "Today";
    }
    return date.toLocaleDateString(undefined, {
        year: "numeric",
        month: "long",
        day: "numeric"
    });
}
