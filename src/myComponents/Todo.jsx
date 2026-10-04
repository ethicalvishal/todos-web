import { useState } from "react";
import { TaskFields } from "./Composer";
import { describeCreated, describeDue } from "../utils/dates";

const PRIORITY_LABELS = { low: "Low priority", normal: "Normal", high: "High priority" };

function Todo({ todo, onToggle, onSave, onDelete }) {
  const priority = todo.priority || "normal";
  const due = describeDue(todo.dueDate, todo.completed);

  const [isEditing, setIsEditing] = useState(false);
  const [confirmingDelete, setConfirmingDelete] = useState(false);
  const [draft, setDraft] = useState(null);

  function startEditing() {
    setDraft({ title: todo.title, priority, dueDate: todo.dueDate || "" });
    setConfirmingDelete(false);
    setIsEditing(true);
  }

  function handleSave(event) {
    event.preventDefault();
    if (draft.title.trim() === "") return;

    onSave(todo.id, draft);
    setIsEditing(false);
  }

  if (isEditing) {
    return (
      <li className="task is-editing">
        <form
          className="task-edit"
          onSubmit={handleSave}
          onKeyDown={(event) => {
            if (event.key === "Escape") setIsEditing(false);
          }}
        >
          <TaskFields
            values={draft}
            onChange={setDraft}
            idPrefix={`edit-${todo.id}`}
            autoFocus
          />
          <div className="composer-footer">
            <button
              type="button"
              className="btn btn-quiet"
              onClick={() => setIsEditing(false)}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="btn btn-primary"
              disabled={draft.title.trim() === ""}
            >
              Save changes
            </button>
          </div>
        </form>
      </li>
    );
  }

  return (
    <li className={`task priority-${priority}${todo.completed ? " is-done" : ""}`}>
      <label className="task-check">
        <input
          type="checkbox"
          checked={todo.completed}
          onChange={() => onToggle(todo.id, !todo.completed)}
          aria-label={`${todo.completed ? "Mark as not done" : "Mark as done"}: ${todo.title}`}
        />
        <span className="check-box" aria-hidden="true">
          <i className="bi bi-check-lg"></i>
        </span>
      </label>

      <div className="task-body">
        <p className="task-title">{todo.title}</p>

        <div className="task-meta">
          {due && (
            <span className={`chip chip-due-${due.tone}`}>
              <i className="bi bi-calendar-event" aria-hidden="true"></i>
              {due.label}
            </span>
          )}
          {priority !== "normal" && (
            <span className={`chip chip-priority-${priority}`}>
              <i className="bi bi-flag-fill" aria-hidden="true"></i>
              {PRIORITY_LABELS[priority]}
            </span>
          )}
          <span className="added">{describeCreated(todo.createdAt)}</span>
        </div>
      </div>

      <div className={confirmingDelete ? "task-actions is-visible" : "task-actions"}>
        {confirmingDelete ? (
          <>
            <span className="confirm-text">Delete this task?</span>
            <button
              type="button"
              className="btn btn-danger btn-small"
              onClick={() => onDelete(todo.id)}
            >
              Delete
            </button>
            <button
              type="button"
              className="btn btn-quiet btn-small"
              onClick={() => setConfirmingDelete(false)}
            >
              Keep
            </button>
          </>
        ) : (
          <>
            <button
              type="button"
              className="icon-btn"
              onClick={startEditing}
              aria-label={`Edit: ${todo.title}`}
              title="Edit"
            >
              <i className="bi bi-pencil" aria-hidden="true"></i>
            </button>
            <button
              type="button"
              className="icon-btn icon-btn-danger"
              onClick={() => setConfirmingDelete(true)}
              aria-label={`Delete: ${todo.title}`}
              title="Delete"
            >
              <i className="bi bi-trash3" aria-hidden="true"></i>
            </button>
          </>
        )}
      </div>
    </li>
  );
}

export default Todo;
