import { useState } from "react";

function Todo(props) {
  const [isEditing, setIsEditing] = useState(false);
  const [editTitle, setEditTitle] = useState(props.title);

  return (
    <div
      className="card shadow-sm border-0 my-3"
      style={{
        backgroundColor: props.completed ? "#d1e7dd" : "white",
      }}
    >
      <div className="card-body d-flex flex-column flex-md-row justify-content-between align-items-stretch align-items-md-center gap-3 py-3 px-3 px-md-4">
        {/* Todo Content */}
        <div className="d-flex align-items-center flex-grow-1 min-width-0">
          <input
            type="checkbox"
            className="form-check-input me-2 flex-shrink-0"
            checked={props.completed}
            onChange={() => props.toggleComplete(props.id)}
          />

          {isEditing ? (
            <input
              type="text"
              className="form-control"
              value={editTitle}
              onChange={(event) => setEditTitle(event.target.value)}
            />
          ) : (
            <span
              className="text-break"
              style={{
                textDecoration: props.completed ? "line-through" : "none",
                color: props.completed ? "gray" : "black",
              }}
            >
              {props.title}
            </span>
          )}
        </div>

        {/* Buttons */}
        <div className="d-flex flex-wrap gap-2 justify-content-start justify-content-md-end">
          {isEditing ? (
            <>
              <button
                className="btn btn-outline-success btn-sm"
                onClick={() => {
                  if (editTitle.trim() === "") return;
                  props.editTodo(props.id, editTitle);
                  setIsEditing(false);
                }}
              >
                <i className="bi bi-check-lg me-1"></i>
                Save
              </button>

              <button
                className="btn btn-outline-secondary btn-sm"
                onClick={() => {
                  setIsEditing(false);
                  setEditTitle(props.title);
                }}
              >
                <i className="bi bi-x-lg me-1"></i>
                Cancel
              </button>
            </>
          ) : (
            <>
              <button
                className="btn btn-outline-warning btn-sm"
                onClick={() => setIsEditing(true)}
              >
                <i className="bi bi-pencil-square me-1"></i>
                Edit
              </button>

              <button
                className="btn btn-outline-danger btn-sm"
                onClick={() => {
                  if (confirm("Are you sure you want to delete this todo?")) {
                    props.deleteTodo(props.id);
                  }
                }}
              >
                <i className="bi bi-trash me-1"></i>
                Delete
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

export default Todo;
