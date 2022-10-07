export default function projectModal() {
  const projectModalTemplate = document.querySelector("#project-modal");
  const projectModal = document.importNode(projectModalTemplate.content, true);
  document.body.appendChild(projectModal);
  const modalClose = document.querySelector(".modal-close");

  modalClose.addEventListener("click", () => {
    document.querySelector(".modal-bg").remove();
  });
}
