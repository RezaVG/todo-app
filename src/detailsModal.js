export default function detailsModal() {
  const detailsModalTemplate = document.querySelector("#details-modal");
  const detailsModal = document.importNode(detailsModalTemplate.content, true);
  document.body.appendChild(detailsModal);
  const modalClose = document.querySelector(".modal-close");
  modalClose.addEventListener("click", () => {
    document.querySelector(".modal-bg").remove();
  });
}
