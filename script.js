const addBtn = document.getElementById("addBtn");
const taskInput = document.getElementById("taskInput");
const errorMsg = document.getElementsByClassName("errorMsg")[0];
const totalTask = document.getElementById("totalTask");
const completedTask = document.getElementById("totalCompletedTask");
const tasksContainer = document.querySelector(".tasks");
const searchInput = document.getElementById("searchInput");
const emptyState = document.getElementById("emptyState");
let currentFilter = "all";

/* ---------------- ADD TASK ---------------- */
addBtn.addEventListener("click", () => {
  const inputVal = taskInput.value.trim();

  if (inputVal === "") {
    errorMsg.classList.add("show");
    return;
  }

  errorMsg.classList.remove("show");

  const taskDiv = document.createElement("div");
  taskDiv.className = "task";

  const leftDiv = document.createElement("div");
  leftDiv.className = "task-left";

  const taskText = document.createElement("span");
  taskText.textContent = inputVal;
  leftDiv.appendChild(taskText);

  const select = document.createElement("select");
  select.className = "statusSelect";

  ["Todo", "InProgress", "Complete"].forEach((status) => {
    const option = document.createElement("option");
    option.value = status;
    option.textContent = status;
    select.appendChild(option);
  });

  /* -------- STATUS CHANGE -------- */
  select.addEventListener("change", () => {
    taskDiv.classList.remove("completed", "inProgress");

    if (select.value === "Complete") {
      taskDiv.classList.add("completed");
    } else if (select.value === "InProgress") {
      taskDiv.classList.add("inProgress");
    }

    updateCounts();
    applyFilter();
  });

  taskDiv.appendChild(leftDiv);
  taskDiv.appendChild(select);
  tasksContainer.appendChild(taskDiv);

  taskInput.value = "";

  if (!emptyState.classList.contains("hidden")) {
    emptyState.textContent = "";
    emptyState.classList.add("hidden");
    searchInput.value = "";
  }
  updateCounts();
  applyFilter();
});

/* ---------------- COUNTS ---------------- */
function updateCounts() {
  const total = tasksContainer.children.length;
  const completed = tasksContainer.querySelectorAll(".task.completed").length;

  totalTask.textContent = `Total: ${total}`;
  completedTask.textContent = `Completed: ${completed}`;
}

/* ---------------- FILTERS ---------------- */
const filtersContainer = document.querySelector(".filters");

filtersContainer.addEventListener("click", (e) => {
  if (e.target.tagName !== "BUTTON") return;

  document
    .querySelectorAll(".filters button")
    .forEach((btn) => btn.classList.remove("active"));

  e.target.classList.add("active");

  currentFilter = e.target.dataset.filter;
  applyFilter();
});

/* ---------------- APPLY FILTER ---------------- */
function applyFilter() {
  const tasks = tasksContainer.querySelectorAll(".task");

  tasks.forEach((task) => {
    if (currentFilter === "all") {
      task.style.display = "flex";
    } else if (currentFilter === "Complete") {
      task.style.display = task.classList.contains("completed")
        ? "flex"
        : "none";
    } else if (currentFilter === "InProgress") {
      task.style.display = task.classList.contains("inProgress")
        ? "flex"
        : "none";
    } else {
      task.style.display =
        !task.classList.contains("completed") &&
        !task.classList.contains("inProgress")
          ? "flex"
          : "none";
    }
  });
}

/* ---------------- DEBOUNCE ---------------- */

function debounce(fn, delay = 300) {
  let timer;

  return function (...args) {
    clearTimeout(timer);
    timer = setTimeout(() => {
      fn.apply(this, args);
    }, delay);
  };
}

/* ---------------- SEARCH ---------------- */

function searchTask(query) {
  const tasks = tasksContainer.querySelectorAll(".task");

  if (!query.trim()) {
    tasks.forEach((task) => (task.style.display = "flex"));
    updateEmptyTaskState();
    return;
  }

  let visibleCount = 0;
  const lowerQuery = query.toLowerCase();

  tasks.forEach((task) => {
    const textEl = task.querySelector(".task-left span");
    if (!textEl) return;

    const isVisible = textEl.textContent.toLowerCase().includes(lowerQuery);

    task.style.display = isVisible ? "flex" : "none";
    if (isVisible) visibleCount++;
  });

  if (tasks.length > 0 && visibleCount === 0) {
    emptyState.textContent = "🔍 No matching tasks found";
    emptyState.classList.remove("hidden");
  } else {
    updateEmptyTaskState();
  }
}

const debouncedSearch = debounce(searchTask, 300);

function handleSearch(e) {
  debouncedSearch(e.target.value);
}

searchInput.addEventListener("input", handleSearch);

/* ---------------- CLEANUP ---------------- */

window.addEventListener("beforeunload", () => {
  searchInput.removeEventListener("input", handleSearch);
});

/* ---------------- MANAGE EMPTY STATE ---------------- */

function updateEmptyTaskState() {
  const totalTasks = tasksContainer.children.length;

  if (totalTasks === 0) {
    emptyState.textContent = "📝 No tasks yet";
    emptyState.classList.remove("hidden");
  } else {
    emptyState.classList.add("hidden");
  }
}

