import "./style.css";
import projectModal from "./projectModal";
import createProject from "./createProject";
import render from "./render";
import { save } from "./render";

export const mainTitle = document.querySelector(".main-title");
export const projectList = document.querySelector(".projects-nav");
export const LOCAL_STORAGE_PROJECT_KEY = "project.list";
export let projects =
  JSON.parse(localStorage.getItem(LOCAL_STORAGE_PROJECT_KEY)) || [];
export let LOCAL_STORAGE_SELECTED_PROJECT_KEY = "project.selectedListId";
export let selectedListId = localStorage.getItem(
  LOCAL_STORAGE_SELECTED_PROJECT_KEY
);

const projectHeader = document.querySelector(".project-title-text");
projectHeader.innerText = `Projects (${projects.length})`;
const addProjectBtn = document.querySelector(".add-project");
addProjectBtn.addEventListener("click", () => {
  projectModal();
  const projectForm = document.querySelector("form");
  const projectInput = document.getElementById("project-title");

  projectForm.addEventListener("submit", e => {
    e.preventDefault();
    const newProject = createProject(projectInput.value);
    projects.push(newProject);
    render();
  });
});

function firstRender() {
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
    const selectedProject = projects.find(
      project => project.id === selectedListId
    );
    mainTitle.innerText = selectedProject.name;
    save();
  });
}
firstRender();

const projectContainer = document.querySelector(".projects-nav");

projectContainer.addEventListener("click", e => {
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
