import "./style.css";
import { format, formatRFC3339 } from "date-fns";
import projectModal from "./projectModal";
import taskModal from "./taskModal";
import detailsModal from "./detailsModal";
import createProject from "./createProject";
import createTask from "./createTask";

const mainTitle = document.querySelector(".main-title");
const projectList = document.querySelector(".projects-nav");
const LOCAL_STORAGE_PROJECT_KEY = "project.list";
let projects =
  JSON.parse(localStorage.getItem(LOCAL_STORAGE_PROJECT_KEY)) || [];
let LOCAL_STORAGE_SELECTED_PROJECT_KEY = "project.selectedListId";
let selectedListId = localStorage.getItem(LOCAL_STORAGE_SELECTED_PROJECT_KEY);
const taskList = document.querySelector(".tasks-list");

const projectHeader = document.querySelector(".project-title-text");
projectHeader.innerText = `Projects (${projects.length})`;
const addProjectBtn = document.querySelector(".add-project");
addProjectBtn.addEventListener("click", () => {
  projectModal();
  const projectForm = document.querySelector("#project-form");
  const projectInput = document.getElementById("project-title");

  projectForm.addEventListener("submit", e => {
    e.preventDefault();
    const newProject = createProject(projectInput.value);
    projects.push(newProject);
    render();
  });
});

render();

projectList.addEventListener("click", e => {
  if (e.target.tagName.toLowerCase() === "li") {
    selectedListId = e.target.dataset.projectId;
    render();
  }
  if (e.target.tagName.toLowerCase() === "img") {
    selectedListId = e.target.parentElement.dataset.projectId;
    render();
  }
  if (e.target.tagName.toLowerCase() === "h3") {
    selectedListId = e.target.parentElement.dataset.projectId;
    render();
  }
});

const home = document.querySelector(".home");
home.addEventListener("click", e => {
  console.log(e.target);
  selectedListId = null;
  clearElement(projectList);
  if (document.querySelector(".modal-bg")) {
    document.querySelector(".modal-bg").remove();
  }
  renderProjects();
  document.querySelector(
    ".project-title-text"
  ).innerText = `Projects (${projects.length})`;

  mainTitle.innerText = "Home";
  clearElement(taskList);
  projects.forEach(project => {
    renderTasks(project);
  });
});

const addTaskBtn = document.querySelector(".add-task");
addTaskBtn.addEventListener("click", () => {
  taskModal();
  const taskForm = document.querySelector("#task-form");
  const taskTitleInput = document.getElementById("task-title");
  const taskDescriptionInput = document.getElementById("task-description");
  const taskDueDateInput = document.getElementById("task-date");
  const priorityInput = document.getElementsByName("priority");
  taskForm.addEventListener("submit", e => {
    e.preventDefault();
    const priority = Array.from(priorityInput).find(input => input.checked).id;
    const newTask = createTask(
      taskTitleInput.value,
      taskDescriptionInput.value,
      taskDueDateInput.value,
      priority
    );

    const selectedProject = projects.find(
      project => project.id === selectedListId
    );
    selectedProject.tasks.push(newTask);

    render();
  });
});

function render() {
  clearElement(projectList);
  if (document.querySelector(".modal-bg")) {
    document.querySelector(".modal-bg").remove();
  }
  renderProjects();
  document.querySelector(
    ".project-title-text"
  ).innerText = `Projects (${projects.length})`;

  const selectedProject = projects.find(
    project => project.id === selectedListId
  );
  if (selectedProject) {
    mainTitle.innerText = selectedProject.name;
  }

  clearElement(taskList);
  renderTasks(selectedProject);
}

function clearElement(element) {
  while (element.firstChild) {
    element.removeChild(element.firstChild);
  }
}

function save() {
  localStorage.setItem(LOCAL_STORAGE_PROJECT_KEY, JSON.stringify(projects));
  localStorage.setItem(LOCAL_STORAGE_SELECTED_PROJECT_KEY, selectedListId);
}

function renderProjects() {
  projects.forEach(project => {
    const projectTemplate = document.querySelector("#project-template");
    const projectAdd = document.importNode(projectTemplate.content, true);
    const projectItem = projectAdd.querySelector("li");
    projectAdd.querySelector("h3").textContent = project.name;
    projectAdd.querySelector("li").dataset.projectId = project.id;
    projectList.appendChild(projectAdd);
    if (selectedListId === project.id) {
      projectItem.classList.add("active");
    }

    save();
  });
}

function renderTasks(selectedProject) {
  const taskTemplate = document.querySelector("#task-template");
  if (selectedProject) {
    selectedProject.tasks.forEach(task => {
      const taskElement = document.importNode(taskTemplate.content, true);
      const taskCheckbox = taskElement.querySelector(".task-checkbox");
      if (task.complete) {
        taskCheckbox.src = "./images/checkbox-intermediate.png";
        taskCheckbox.parentElement.style.opacity = "0.2";
      } else {
        taskCheckbox.src = "./images/checkbox-blank-outline.png";
      }
      const taskTitle = taskElement.querySelector(".task-title");
      taskTitle.innerText = task.title;
      const taskDate = taskElement.querySelector(".task-date");
      taskDate.innerText = format(new Date(task.dueDate), "do MMM");
      const detailsBtn = taskElement.querySelector(".details");
      detailsBtn.addEventListener("click", () => {
        detailsModal();
        const detailProjectTitle = document.querySelector(".details-project");
        detailProjectTitle.textContent += ` ${selectedProject.name}`;
        const detailTaskTitle = document.querySelector(".details-title");
        detailTaskTitle.textContent += ` ${task.title}`;
        const detailTaskDescription = document.querySelector(
          ".details-description"
        );
        detailTaskDescription.textContent += ` ${task.description}`;
        const detailTaskDueDate = document.querySelector(".details-dueDate");
        detailTaskDueDate.textContent += ` ${task.dueDate}`;
        const detailTaskPriority = document.querySelector(".details-priority");
        detailTaskPriority.textContent += ` ${task.priority}`;
      });
      const editTaskBtn = taskElement.querySelector(".task-edit");
      editTaskBtn.addEventListener("click", () => {
        taskModal();
        const taskForm = document.querySelector("#task-form");
        const taskTitleInput = document.getElementById("task-title");
        taskTitleInput.value = task.title;
        const taskDescriptionInput =
          document.getElementById("task-description");
        taskDescriptionInput.value = task.description;
        const taskDueDateInput = document.getElementById("task-date");
        taskDueDateInput.value = task.dueDate;
        const priorityInput = document.getElementsByName("priority");
        priorityInput.forEach(input => {
          if (input.id === task.priority) {
            input.checked = true;
          }
        });
        taskForm.addEventListener("submit", e => {
          e.preventDefault();
          task.title = taskTitleInput.value;
          task.description = taskDescriptionInput.value;
          task.dueDate = taskDueDateInput.value;
          task.priority = Array.from(priorityInput).find(
            input => input.checked
          ).id;
          render();
        });
      });
      const removeBtn = taskElement.querySelector(".task-remove");
      removeBtn.addEventListener("click", () => {
        const index = selectedProject.tasks.indexOf(task);
        selectedProject.tasks.splice(index, 1);
        render();
      });
      switch (task.priority) {
        case "low":
          taskElement.querySelector("li").style.backgroundColor =
            "hsl(133, 90%, 80%)";
          break;
        case "medium":
          taskElement.querySelector("li").style.backgroundColor =
            "hsl(41, 75%, 80%)";
          break;
        case "high":
          taskElement.querySelector("li").style.backgroundColor =
            "hsl(0, 79%, 80%)";
          break;
      }
      taskCheckbox.id = task.id;
      taskList.appendChild(taskElement);
      taskCheckbox.addEventListener("click", e => {
        const selectedTask = selectedProject.tasks.find(
          task => task.id === e.target.id
        );
        if (!selectedTask.complete) {
          selectedTask.complete = true;
          render();
        } else {
          selectedTask.complete = false;
          render();
        }
      });
    });
  }
}
