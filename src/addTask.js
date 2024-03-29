const moment = require("moment");
import tippy from "tippy.js";
import "tippy.js/dist/tippy.css";

if (localStorage.getItem("tasks") === null) {
  localStorage.setItem("tasks", "[]");
}
const inputTaskName = document.querySelector("#tname");
const inputDesc = document.querySelector("#desc");
const inputSubTask = document.querySelector("#subtask");
const inputStartDate = document.querySelector("#sdate");
const inputEndDate = document.querySelector("#edate");
const inputCustomCategory = document.querySelector("#customc");
const btnAddTask = document.querySelector("#addb");
const priorityDiv = document.querySelector(".priority");
const priorityRadioArray = Array.from(document.querySelectorAll(".prb"));
const priorityDatePicker = document.querySelector(".priority-date-picker");
const recurringPeriodArray = Array.from(document.querySelectorAll(".rpc"));
const infoSubtaskEntity = document.querySelector(".info-subtask");
const durationType = document.querySelector("#priority");

tippy(".info-subtask", {
  content: "To add multiple subtasks, separate them with commas",
  placement: "top-start",
  arrow: true,
  animation: "shift-away-subtle",
  theme: "light",
});

let taskName = "";
let taskDesc = "";
let subTask = "";
let startDate = "";
let endDate = "";
let pickedFirstStartDate = "";
let pickedSecondStartDate = "";
let customCategory = "";
let priority = "";
let duration = "";
let progressEachDay = {};

inputStartDate.setAttribute(
  "min",
  `${moment(moment().format("YYYY-MM-DD"), "YYYY-MM-DD")._i}`
);
inputEndDate.setAttribute(
  "min",
  `${moment(moment().format("YYYY-MM-DD"), "YYYY-MM-DD")._i}`
);

function getMonthlyDates(pickedFirstStartDate, endDate) {
  const startMoment = moment(pickedFirstStartDate);
  const endMoment = moment(endDate);

  let monthlyDates = [];

  while (!startMoment.isAfter(endMoment)) {
    const lastDayOfMonth = startMoment.endOf("month").format("DD-MM-YYYY");
    monthlyDates.push(lastDayOfMonth);

    startMoment.add(1, "month");
  }

  return monthlyDates;
}

const resetForm = () => {
  inputTaskName.value = "";
  inputDesc.value = "";
  inputSubTask.value = "";
  inputStartDate.value = "";
  inputEndDate.value = "";
  inputCustomCategory.value = "";
  priorityRadioArray.map((element) => (element.checked = false));
  recurringPeriodArray.map((element) => (element.checked = false));
  durationType.value = "";

  taskName = "";
  taskDesc = "";
  subTask = "";
  startDate = "";
  endDate = "";
  pickedFirstStartDate = "";
  pickedSecondStartDate = "";
  customCategory = "";
  priority = "";
  duration = "";

  priorityDatePicker.innerHTML = "";

  Object.keys(progressEachDay).forEach((key) => {
    delete object[key];
  });

  alert("task added!");
};

priorityDiv.addEventListener("change", (event) => {
  priorityDatePicker.innerHTML = "";

  const priority = event.target.value;
  switch (priority) {
    case "weekly": {
      const date = new Date(startDate);
      const lastDate = new Date(startDate);
      if (startDate === "") {
        alert("Please pick start date and end date for this task first");
        event.target.checked = false;
        return;
      }
      lastDate.setDate(lastDate.getDate() + 7);
      const formattedStartDate = date.toISOString().split("T")[0];
      const formattedLastDate = lastDate.toISOString().split("T")[0];
      priorityDatePicker.insertAdjacentHTML(
        "beforeend",
        `<label for="priority-date-picker__input">Pick a date:
                  <input
                    id="priority-date-picker__input"
                    type="date"
                    min=${formattedStartDate}
                    max=${formattedLastDate}
                /></label>`
      );
      return;
    }
    case "biweekly": {
      const date = new Date(startDate);
      const lastDate = new Date(startDate);
      if (startDate === "") {
        alert("Please pick start date and end date for this task first");
        event.target.checked = false;
        return;
      }
      lastDate.setDate(lastDate.getDate() + 7);

      const formattedStartDate = date.toISOString().split("T")[0];
      const formattedLastDate = lastDate.toISOString().split("T")[0];
      priorityDatePicker.insertAdjacentHTML(
        "beforeend",
        `<label for="priority-date-picker__input">Pick first date:
                  <input
                    id="priority-date-picker__input"
                    type="date"
                    min=${formattedStartDate}
                    max=${formattedLastDate}
                /></label>
          <label for="priority-date-picker__input">Pick second date:
          <input
            id="priority-date-picker__input-1"
            type="date"
            min=${formattedStartDate}
            max=${formattedLastDate}
        /></label>`
      );
      return;
    }
    case "monthly": {
      const date = new Date(startDate);
      const lastDate = new Date(startDate);
      if (startDate === "") {
        alert("Please pick start date and end date for this task first");
        event.target.checked = false;
        return;
      }
      lastDate.setMonth(date.getMonth() + 1);
      lastDate.setDate(date.getDate() - 1);
      const formattedStartDate = date.toISOString().split("T")[0];
      const formattedLastDate = lastDate.toISOString().split("T")[0];
      priorityDatePicker.insertAdjacentHTML(
        "beforeend",
        `<label for="priority-date-picker__input">Pick a date:
                  <input
                    id="priority-date-picker__input"
                    type="date"
                    min=${formattedStartDate}
                    max=${formattedLastDate}
                /></label>`
      );
      return;
    }
  }
});

const getMinDate = (date1, date2) => {
  if (date1 < date2) {
    return date1;
  } else {
    return date2;
  }
};

btnAddTask.addEventListener("click", () => {
  taskName = inputTaskName.value;
  taskDesc = inputDesc.value;
  subTask = inputSubTask.value;
  startDate = inputStartDate.value;
  endDate = inputEndDate.value;
  customCategory = inputCustomCategory.value;
  priority = priorityRadioArray.find((element) => element.checked).value;
  const recurringPeriod = recurringPeriodArray.find(
    (element) => element.checked
  ).value;
  const duration = durationType.value;

  const progressEachDay = {};
  switch (priority) {
    case "daily":
      let date = moment(
        moment(startDate, "YYYY-MM-DD").format("DD/MM/YYYY"),
        "DD/MM/YYYY"
      );
      let lastDate = moment(
        moment(endDate, "YYYY-MM-DD").format("DD/MM/YYYY"),
        "DD/MM/YYYY"
      );

      console.log(date);
      console.log(lastDate);

      while (date.isSameOrBefore(lastDate)) {
        progressEachDay[date.format("DD/MM/YYYY")] = 0;
        date.add(1, "days");
      }
      break;
    case "weekly": {
      let date = moment(
        moment(pickedFirstStartDate, "YYYY-MM-DD").format("DD/MM/YYYY"),
        "DD/MM/YYYY"
      );
      let lastDate = moment(
        moment(endDate, "YYYY-MM-DD").format("DD/MM/YYYY"),
        "DD/MM/YYYY"
      );
      while (date.isSameOrBefore(lastDate)) {
        progressEachDay[date.format("DD/MM/YYYY")] = 0;
        date.add(7, "days");
      }
      break;
    }
    case "biweekly": {
      let firstDate = moment(
        moment(pickedFirstStartDate, "YYYY-MM-DD").format("DD/MM/YYYY"),
        "DD/MM/YYYY"
      );
      let secondDate = moment(
        moment(pickedSecondStartDate, "YYYY-MM-DD").format("DD/MM/YYYY"),
        "DD/MM/YYYY"
      );
      let lastDate = moment(
        moment(endDate, "YYYY-MM-DD").format("DD/MM/YYYY"),
        "DD/MM/YYYY"
      );
      while (firstDate.isSameOrBefore(lastDate)) {
        progressEachDay[firstDate.format("DD/MM/YYYY")] = 0;
        firstDate.add(7, "days");
      }
      while (secondDate.isSameOrBefore(lastDate)) {
        progressEachDay[secondDate.format("DD/MM/YYYY")] = 0;
        secondDate.add(7, "days");
      }
      break;
    }
    case "monthly": {
      const dates = getMonthlyDates(pickedFirstStartDate, endDate);
      dates.forEach((date) => (progressEachDay[date] = 0));
      break;
    }
    default:
      console.log("Something went wrong!");
  }

  const newTask = {
    taskName,
    taskDesc,
    subTask,
    startDate,
    endDate,
    customCategory,
    priority,
    recurringPeriod,
    duration,
    progressEachDay: { ...progressEachDay },
  };
  console.log(newTask);

  const temp = JSON.parse(localStorage.getItem("tasks"));
  temp.push(newTask);
  localStorage.setItem("tasks", JSON.stringify(temp));
  resetForm();
});

const formDiv = document.querySelector(".form-custom");
formDiv.addEventListener("change", (event) => {
  if (event.target.getAttribute("type") === "date") {
    const date = event.target;
    if (date.getAttribute("id") === "sdate") {
      startDate = inputStartDate.value;
    } else {
      endDate = inputEndDate.value;
    }
  }
});

priorityDatePicker.addEventListener("change", () => {
  const datePickerArray = Array.from(priorityDatePicker.children).map(
    (labelChild) => Array.from(labelChild.children)[0]
  );
  console.log(datePickerArray);
  if (datePickerArray.length === 1) {
    pickedFirstStartDate = datePickerArray[0].value;
  } else {
    console.log("I'm here");
    pickedFirstStartDate = datePickerArray[0].value;
    pickedSecondStartDate = datePickerArray[1].value;
  }
});
