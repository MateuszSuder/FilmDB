/**
 * Parses data to YYYY-MM-DD format
 * @param timestamp of date to parse
 * @returns {string} date in YYYY-MM-DD format
 */
export const dateParser = (timestamp) => {
    if(typeof timestamp === 'string') timestamp = parseInt(timestamp);
    const date = new Date(timestamp);

    return `${date.getFullYear()}-${(date.getMonth() + 1) < 10 ? `0${date.getMonth() + 1}` : date.getMonth()}-${(date.getDate()) < 10 ? `0${date.getDate()}` : date.getDate()}`;
}