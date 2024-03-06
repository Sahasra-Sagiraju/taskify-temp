const moment = require("moment");

function getWeekDates(weekdayDate) {
  const startOfWeek = moment(weekdayDate, "DD/MM/YYYY").startOf("week");
  const endOfWeek = moment(weekdayDate, "DD/MM/YYYY").endOf("week");

  let currentDay = startOfWeek.clone();
  const weekDates = [];

  while (currentDay.isSameOrBefore(endOfWeek)) {
    weekDates.push(currentDay.format("DD/MM/YYYY"));
    currentDay.add(1, "day");
  }

  return weekDates;
}

const weekdayDate = "13/03/2024"; // Example date in format DD/MM/YYYY
const weekDatesArray = getWeekDates(weekdayDate);
console.log(weekDatesArray);
