import Chart from "chart.js/auto";
const moment = require("moment");
const lodash = require("lodash");

const tasks = JSON.parse(localStorage.getItem("tasks"));

const myTasksContainer = document.querySelector(".mytasks-container");
const detailsBox = document.querySelector(".details-box");
const myTasksBox = document.querySelector(".mytasks-container");

const getStreak = (task) => {
  const today = moment(moment().format("DD/MM/YYYY"), "DD/MM/YYYY");
  const sortedTaskDates = Object.keys(task.progressEachDay).sort(
    (date1, date2) => {
      const dateA = moment(date1, "DD/MM/YYYY");
      const dateB = moment(date2, "DD/MM/YYYY");
      return dateA.diff(dateB);
    }
  );

  // find the date this task was last performed on except today
  let index = 0;
  while (
    index < sortedTaskDates.length &&
    moment(sortedTaskDates[index], "DD/MM/YYYY").isBefore(today)
  ) {
    ++index;
  }

  --index;

  // count the streak
  let count = 0;
  while (index >= 0 && task.progressEachDay[sortedTaskDates[index]] > 0) {
    ++count;
    --index;
  }

  return count;
};

function formatNumber(num) {
  if (Number.isInteger(num)) {
    return num.toString();
  } else {
    return num.toFixed(2);
  }
}

const getProgressTillDate = (task) => {
  let totalProgress = 0;
  let count = 0;
  for (const key in task.progressEachDay) {
    const date = moment(key, "DD/MM/YYYY");
    const today = moment();
    if (date.isSameOrBefore(today)) {
      ++count;
    }

    if (count === 0) {
      return 0;
    }

    if (date.isSameOrBefore(today) && task.progressEachDay[date._i] > 0) {
      totalProgress += Number(task.progressEachDay[date._i]);
    }
  }

  // const possibleProgress = count * 100;
  const possibleProgress = Object.keys(task.progressEachDay).length * 100;
  const totalProgressPercentage = (totalProgress / possibleProgress) * 100;
  return formatNumber(totalProgressPercentage);
};

const constructGraph = async (task) => {
  const data = Object.keys(task.progressEachDay)
    .map((date) => ({
      date,
      progress:
        task.progressEachDay[date] === null ? 0 : task.progressEachDay[date],
    }))
    .filter((obj) =>
      moment(obj.date).isSameOrBefore(moment().format("DD/MM/YYYY"))
    )
    .sort((obj1, obj2) => {
      const dateA = moment(obj1.date, "DD/MM/YYYY");
      const dateB = moment(obj2.date, "DD/MM/YYYY");
      return dateA.diff(dateB);
    });

  new Chart(document.getElementById("progress-by-day"), {
    type: "line",
    options: {
      animation: false,
      plugins: {
        legend: {
          display: true,
          onClick: null,
        },
      },
    },
    data: {
      labels: data.map((row) => row.date),
      datasets: [
        {
          label: "Progress each day",
          data: data.map((row) => row.progress),
        },
      ],
    },
  });
};

const renderDetailsCard = (sNo, task) => {
  const progress = getProgressTillDate(task);
  const conicGradientDegree = (360 / 100) * progress;
  const streak = getStreak(task);
  const {
    taskName,
    taskDesc,
    subTask,
    startDate,
    endDate,
    customCategory,
    priority,
    recurringPeriod,
    duration,
    progressEachDay,
  } = task;

  detailsBox.innerHTML = "";
  detailsBox.insertAdjacentHTML(
    "beforeend",
    `
    <!-- Header part -->
    <div class="details-box__header">
      <i
        class="bx bx-arrow-back details-box__back-btn"
        style="color: #fffefe"
      ></i>
      <div class="details-box__header-inner-container">
        <i class="bx bxs-trash-alt" style="color: #fffefe"></i>
      </div>
    </div>

    <!-- main data part -->
    <div class="details-box__main">
      <!-- S.no, name and description-->
      <div class="details-box__heading-outer-container">
        <span class="task-no">${sNo}</span>
        <div class="details-box__heading-inner-container">
          <span class="details-box__task-name">${taskName}</span>
          <span class="details-box__task-description"
            >${taskDesc}</span
          >
        </div>
      </div>
      <!-- Category -->
      <span class="details-box__category">${customCategory}</span>
      <!-- start date -->
      <div class="details-box__start-date">
        <i class="bx bxs-calendar" style="color: #fffefe"></i>
        <span>Start date: ${startDate}</span>
      </div>
      <!-- end date -->
      <div class="details-box__end-date">
        <i class="bx bxs-calendar" style="color: #fffefe"></i>
        <span>End date: ${endDate}</span>
      </div>

      <!-- streak -->
      <span class="details-box__streak">
        <span class="details-box__property">Streak:</span>
        <span class="details-box__streak-value">${streak} ${
      streak === 1 ? "day" : "days"
    }</span>
      </span>

      <!-- progress -->
      <div class="details-box__progress">
        <span class="details-box__property">Progress:</span>
        <div class="details-box__progress-circle" style="  background: conic-gradient(#45a2a9 ${conicGradientDegree}deg, #bcccbf ${conicGradientDegree}deg 360deg);
        ">
          <span class="details-box__progress-value">${progress}%</span>
        </div>
      </div>

      <!-- Tag details -->
      <div class="details-box__tags-table">
        <div class="details-box__tags-table-item">
          <span class="details-box__property">Duration:</span>
          <span class="details-box__property-value details-tag">
            ${recurringPeriod}
          </span>
        </div>
        <div class="details-box__tags-table-item">
          <span class="details-box__property">Recurring:</span>
          <span class="details-box__property-value details-tag">${priority}</span>
        </div>
        <div class="details-box__tags-table-item">
          <span class="details-box__property">Priority:</span>
          <span class="details-box__property-value details-tag details-tag-${duration.toLowerCase()}">
              ${duration}
          </span>
        </div>
        <div class="details-box__tags-table-item">
          <span class="details-box__property">Missed:</span>
          <span class="details-box__property-value details-tag">0</span>
        </div>
      </div>

      <!-- Subtasks -->
      <div class="details-box__subtasks-table">
        <span class="details-box__property">Subtasks:</span>
        <div class="details-box__subtasks-table-items">
          <div class="details-box__subtasks-table-item">
            <i class="bx bx-check-square" style="color: #0e8c87"></i>
            <span class="subtask-item">
              ${subTask}
            </span>
          </div>
        </div>
      </div>

      <!-- Graph -->
      <div class="graph">
        <canvas id="progress-by-day"></canvas>
      </div>
      <dialog class="dialog">
        <p>Are you sure you want to delete this task?</p>
        <div>
          <button class="no-btn">No</button>
          <button class="yes-btn">Yes</button>
        </div>
      </dialog>
    </div>
  </div>
    `
  );

  const backBtn = document.querySelector(".details-box__back-btn");

  backBtn.addEventListener("click", () => {
    detailsBox.setAttribute("hidden", true);
    myTasksContainer.removeAttribute("hidden");
  });

  const deleteBtn = document.querySelector(".bxs-trash-alt");
  const dialogBox = document.querySelector(".dialog");
  const noBtn = document.querySelector(".no-btn");
  const yesBtn = document.querySelector(".yes-btn");
  deleteBtn.addEventListener("click", () => {
    dialogBox.showModal();
  });

  noBtn.addEventListener("click", () => {
    dialogBox.close();
  });

  yesBtn.addEventListener("click", () => {
    backBtn.click();
    dialogBox.close();
    const tasksArray = JSON.parse(localStorage.getItem("tasks"));
    const newTasksArray = tasksArray.filter(
      (ele) => !lodash.isEqual(ele, task)
    );
    localStorage.setItem("tasks", JSON.stringify(newTasksArray));
    updateMyTasksList();
  });
};

const updateMyTasksList = () => {
  const tasks = JSON.parse(localStorage.getItem("tasks"));

  myTasksContainer.innerHTML = "";

  if (tasks.length === 0) {
    myTasksContainer.insertAdjacentHTML(
      "beforeend",
      `<h2 style="text-align: center;">No tasks available to show. Please create one :)</h2>`
    );
  }

  tasks.forEach((task, index) => {
    const {
      taskName,
      taskDesc,
      subTask,
      startDate,
      recurringPeriod,
      priority,
      endDate,
      duration,
      customCategory,
    } = task;

    myTasksContainer.insertAdjacentHTML(
      "beforeend",
      `<div class="tasks-details task-${index + 1}">
        <div id="sno" class="mytasks">${index + 1}</div>
        <div id="task-name" class="mytasks">${taskName}</div>
        <div id="progress-bar" class="mytasks">
          <label for="file"></label>
          <span class="progress-details">${getProgressTillDate(
            task
          )}% Completed</span>
          <progress
            id="file"
            value="${getProgressTillDate(task)}"
            max="100"
            step="1"
            style="height: 24px; width: 100%"
          >
          </progress>
        </div>
        <button class="details-btn" type="button">Details</button>
      </div>
`
    );
  });
};
updateMyTasksList();

myTasksBox.addEventListener("click", (event) => {
  if (event.target.classList.contains("details-btn")) {
    myTasksBox.setAttribute("hidden", true);
    detailsBox.removeAttribute("hidden");

    const tasksArray = JSON.parse(localStorage.getItem("tasks"));

    const sNo = Number(event.target.parentElement.classList[1].slice(5));
    const index = sNo - 1;

    const task = tasksArray[index];
    renderDetailsCard(sNo, task);
    constructGraph(task);
  }
});
