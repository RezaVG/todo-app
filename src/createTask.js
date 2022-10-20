export default function createTask(
  title,
  description,
  dueDate,
  priority
  //   complete
) {
  return {
    id: Date.now().toString(),
    title: title,
    description: description,
    dueDate: dueDate,
    priority: priority,
    // complete: complete,
  };
}
