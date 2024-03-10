export const isToday = (someDate) => {
    const today = new Date();
    return someDate.getDate() === today.getDate() &&
        someDate.getMonth() === today.getMonth() &&
        someDate.getFullYear() === today.getFullYear();
};
const today = new Date();
export const ninetyDaysAgo = new Date(today.setDate(today.getDate() - 90));
