export default function taskModal() {
  const taskModalTemplate = document.querySelector("#task-modal");
  const taskModal = document.importNode(taskModalTemplate.content, true);
  document.body.appendChild(taskModal);
  const modalClose = document.querySelector(".modal-close");

  modalClose.addEventListener("click", () => {
    document.querySelector(".modal-bg").remove();
  });
}
