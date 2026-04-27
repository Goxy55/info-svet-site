const STORAGE_KEY = "taskflow_mvp_v1";

const state = loadState();

const els = {
  projectForm: document.getElementById("project-form"),
  projectName: document.getElementById("project-name"),
  projectsList: document.getElementById("projects-list"),
  taskForm: document.getElementById("task-form"),
  taskTitle: document.getElementById("task-title"),
  taskProject: document.getElementById("task-project"),
  taskPriority: document.getElementById("task-priority"),
  taskDue: document.getElementById("task-due"),
  taskToday: document.getElementById("task-today"),
  filterStatus: document.getElementById("filter-status"),
  filterProject: document.getElementById("filter-project"),
  board: document.getElementById("board"),
  topThree: document.getElementById("top-three"),
  ideaForm: document.getElementById("idea-form"),
  ideaContent: document.getElementById("idea-content"),
  ideasList: document.getElementById("ideas-list"),
};

const statuses = [
  { id: "todo", title: "TODO" },
  { id: "in_progress", title: "In Progress" },
  { id: "done", title: "Done" },
];

bootstrap();

function bootstrap() {
  bindEvents();
  renderAll();
}

function bindEvents() {
  els.projectForm.addEventListener("submit", (e) => {
    e.preventDefault();
    const name = els.projectName.value.trim();
    if (!name) return;
    state.projects.push({ id: uid(), name });
    els.projectName.value = "";
    persistAndRender();
  });

  els.taskForm.addEventListener("submit", (e) => {
    e.preventDefault();
    const title = els.taskTitle.value.trim();
    if (!title) return;

    state.tasks.push({
      id: uid(),
      title,
      projectId: els.taskProject.value || null,
      priority: Number(els.taskPriority.value),
      dueDate: els.taskDue.value || null,
      isToday: els.taskToday.checked,
      status: "todo",
      createdAt: Date.now(),
    });

    els.taskForm.reset();
    persistAndRender();
  });

  els.ideaForm.addEventListener("submit", (e) => {
    e.preventDefault();
    const content = els.ideaContent.value.trim();
    if (!content) return;
    state.ideas.push({ id: uid(), content });
    els.ideaContent.value = "";
    persistAndRender();
  });

  els.filterStatus.addEventListener("change", renderBoard);
  els.filterProject.addEventListener("change", renderBoard);
}

function renderAll() {
  renderProjectOptions();
  renderProjects();
  renderIdeas();
  renderBoard();
  renderTopThree();
}

function renderProjectOptions() {
  const options = ["<option value=''>Bez projekta</option>"]
    .concat(state.projects.map((p) => `<option value='${p.id}'>${escapeHtml(p.name)}</option>`))
    .join("");

  els.taskProject.innerHTML = options;

  const filterOptions = ["<option value='all'>Svi projekti</option>"]
    .concat(state.projects.map((p) => `<option value='${p.id}'>${escapeHtml(p.name)}</option>`))
    .join("");

  els.filterProject.innerHTML = filterOptions;
}

function renderProjects() {
  if (!state.projects.length) {
    els.projectsList.innerHTML = "<li class='muted'>Nema projekata.</li>";
    return;
  }

  els.projectsList.innerHTML = state.projects
    .map((p) => {
      const count = state.tasks.filter((t) => t.projectId === p.id && t.status !== "done").length;
      return `<li>${escapeHtml(p.name)} <span class='muted'>(${count} otvoreno)</span></li>`;
    })
    .join("");
}

function renderIdeas() {
  if (!state.ideas.length) {
    els.ideasList.innerHTML = "<li class='muted'>Inbox je prazan.</li>";
    return;
  }

  els.ideasList.innerHTML = state.ideas
    .map(
      (idea) =>
        `<li>${escapeHtml(idea.content)}
          <button data-action='idea-to-task' data-id='${idea.id}'>u task</button>
          <button data-action='idea-to-project' data-id='${idea.id}'>u projekat</button>
        </li>`
    )
    .join("");

  els.ideasList.querySelectorAll("button").forEach((button) => {
    button.addEventListener("click", () => {
      const id = button.dataset.id;
      const action = button.dataset.action;
      convertIdea(id, action);
    });
  });
}

function convertIdea(id, action) {
  const idea = state.ideas.find((i) => i.id === id);
  if (!idea) return;

  if (action === "idea-to-task") {
    state.tasks.push({
      id: uid(),
      title: idea.content,
      projectId: null,
      priority: 2,
      dueDate: null,
      isToday: false,
      status: "todo",
      createdAt: Date.now(),
    });
  }

  if (action === "idea-to-project") {
    state.projects.push({ id: uid(), name: idea.content.slice(0, 64) });
  }

  state.ideas = state.ideas.filter((i) => i.id !== id);
  persistAndRender();
}

function renderTopThree() {
  const top = state.tasks
    .filter((t) => t.isToday && t.status !== "done")
    .sort((a, b) => a.priority - b.priority || (a.dueDate || "").localeCompare(b.dueDate || ""))
    .slice(0, 3);

  if (!top.length) {
    els.topThree.innerHTML = "<li class='muted'>Nema prioriteta za danas.</li>";
    return;
  }

  els.topThree.innerHTML = top
    .map((t) => `<li>${escapeHtml(t.title)} <span class='muted'>(${priorityLabel(t.priority)})</span></li>`)
    .join("");
}

function renderBoard() {
  const byStatus = Object.fromEntries(statuses.map((s) => [s.id, []]));
  let tasks = [...state.tasks];

  const statusFilter = els.filterStatus.value;
  const projectFilter = els.filterProject.value;

  if (statusFilter !== "all") tasks = tasks.filter((t) => t.status === statusFilter);
  if (projectFilter !== "all") tasks = tasks.filter((t) => t.projectId === projectFilter);

  tasks.forEach((task) => byStatus[task.status].push(task));

  els.board.innerHTML = statuses
    .map((status) => {
      const cards = byStatus[status.id]
        .map(
          (task) => `<article class='task'>
            <div class='title'>${escapeHtml(task.title)}</div>
            <div class='meta'>${taskMeta(task)}</div>
            <div class='actions'>
              ${status.id !== "todo" ? `<button data-action='prev' data-id='${task.id}'>◀</button>` : ""}
              ${status.id !== "done" ? `<button data-action='next' data-id='${task.id}'>▶</button>` : ""}
              <button data-action='delete' data-id='${task.id}'>Obrisi</button>
            </div>
          </article>`
        )
        .join("");

      return `<section class='column'>
        <h3>${status.title}</h3>
        ${cards || "<p class='muted'>Nema taskova.</p>"}
      </section>`;
    })
    .join("");

  els.board.querySelectorAll("button").forEach((button) => {
    button.addEventListener("click", () => {
      const id = button.dataset.id;
      const action = button.dataset.action;
      mutateTask(id, action);
    });
  });
}

function mutateTask(taskId, action) {
  const task = state.tasks.find((t) => t.id === taskId);
  if (!task) return;

  if (action === "delete") {
    state.tasks = state.tasks.filter((t) => t.id !== taskId);
    return persistAndRender();
  }

  const order = ["todo", "in_progress", "done"];
  const idx = order.indexOf(task.status);

  if (action === "next" && idx < order.length - 1) task.status = order[idx + 1];
  if (action === "prev" && idx > 0) task.status = order[idx - 1];

  persistAndRender();
}

function taskMeta(task) {
  const project = state.projects.find((p) => p.id === task.projectId);
  const parts = [priorityLabel(task.priority)];
  if (project) parts.push(project.name);
  if (task.dueDate) parts.push(`rok: ${task.dueDate}`);
  if (task.isToday) parts.push("danas");
  return parts.map(escapeHtml).join(" • ");
}

function priorityLabel(priority) {
  if (priority === 1) return "visok";
  if (priority === 2) return "srednji";
  return "nizak";
}

function persistAndRender() {
  saveState(state);
  renderAll();
}

function loadState() {
  try {
    const parsed = JSON.parse(localStorage.getItem(STORAGE_KEY));
    if (parsed && typeof parsed === "object") return withDefaults(parsed);
  } catch (error) {
    console.warn("Storage parse error", error);
  }
  return withDefaults({});
}

function saveState(nextState) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(nextState));
}

function withDefaults(raw) {
  return {
    projects: Array.isArray(raw.projects) ? raw.projects : [],
    tasks: Array.isArray(raw.tasks) ? raw.tasks : [],
    ideas: Array.isArray(raw.ideas) ? raw.ideas : [],
  };
}

function uid() {
  return Math.random().toString(36).slice(2, 10);
}

function escapeHtml(value) {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}
