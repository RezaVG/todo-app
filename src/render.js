import {
  projects,
  LOCAL_STORAGE_PROJECT_KEY,
  LOCAL_STORAGE_SELECTED_PROJECT_KEY,
  projectList,
  selectedListId,
  mainTitle,
} from ".";

export default function render() {
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
  mainTitle.innerText = selectedProject.name;
}

function clearElement(element) {
  while (element.firstChild) {
    element.removeChild(element.firstChild);
  }
}

export function save() {
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
