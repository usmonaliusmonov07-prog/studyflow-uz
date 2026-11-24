
/* StudyFlow UZ - Task Management */

const taskForm = document.getElementById("taskForm");
const taskInput = document.getElementById("taskInput");
const taskDate = document.getElementById("taskDate");
const taskList = document.getElementById("taskList");

const totalCount = document.getElementById("total");
const completedCount = document.getElementById("completed");

const STORAGE_KEY = "studyflow_uz_tasks";

// Oldingi vazifalarni yuklash
function loadTasks() {
  try {
    const saved = JSON.parse(
      localStorage.getItem(STORAGE_KEY) || "[]"
    );
    return Array.isArray(saved) ? saved : [];
  } catch (error) {
    console.error("Ma'lumotni o'qishda xato:", error);
    return [];
  }
}

let tasks = loadTasks();

// Vazifalarni saqlash
function saveTasks() {
  localStorage.setItem(
    STORAGE_KEY,
    JSON.stringify(tasks)
  );
}

// Statistikani yangilash
function updateStatistics() {
  totalCount.textContent = tasks.length;

  completedCount.textContent = tasks.filter(
    task => task.completed
  ).length;
}

// Vazifalarni ekranga chiqarish
function renderTasks() {
  taskList.innerHTML = "";

  if (tasks.length === 0) {
    const emptyMessage = document.createElement("li");
    emptyMessage.textContent =
      "Hozircha vazifalar yo'q. Yangi vazifa qo'shing!";
    taskList.appendChild(emptyMessage);
  }

  tasks.forEach(task => {
    const li = document.createElement("li");

    if (task.completed) {
      li.classList.add("completed");
    }

    const info = document.createElement("div");
    info.className = "task-info";

    const title = document.createElement("strong");
    title.textContent = task.title;
    info.appendChild(title);

    if (task.date) {
      const date = document.createElement("small");
      date.textContent = "Muddat: " + task.date;
      info.appendChild(date);
    }

    const actions = document.createElement("div");
    actions.className = "task-actions";

    // Bajarilgan deb belgilash
    const completeBtn = document.createElement("button");
    completeBtn.textContent = task.completed ? "↩" : "✓";
    completeBtn.title = task.completed
      ? "Qayta faollashtirish"
      : "Bajarildi";

    completeBtn.addEventListener("click", () => {
      task.completed = !task.completed;
      saveTasks();
      renderTasks();
    });

    // Vazifani o'chirish
    const deleteBtn = document.createElement("button");
    deleteBtn.textContent = "✕";
    deleteBtn.className = "delete-btn";
    deleteBtn.title = "O'chirish";

    deleteBtn.addEventListener("click", () => {
      tasks = tasks.filter(item => item.id !== task.id);
      saveTasks();
      renderTasks();
    });

    actions.appendChild(completeBtn);
    actions.appendChild(deleteBtn);

    li.appendChild(info);
    li.appendChild(actions);

    taskList.appendChild(li);
  });

  updateStatistics();
}

// Yangi vazifa qo'shish
taskForm.addEventListener("submit", event => {
  event.preventDefault();

  const title = taskInput.value.trim();

  if (!title) {
    alert("Iltimos, vazifa nomini kiriting!");
    return;
  }

  const newTask = {
    id: Date.now().toString() +
      Math.random().toString(36).slice(2),
    title: title,
    date: taskDate.value,
    completed: false
  };

  tasks.push(newTask);

  saveTasks();
  renderTasks();

  taskForm.reset();
  taskInput.focus();
});

// Sahifa ochilganda vazifalarni ko'rsatish
renderTasks();
