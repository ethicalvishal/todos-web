import Todo from "./Todo";
import { useState } from "react";

function Todos(props) {
  const [newTodo, setNewTodo] = useState("");
  const [error, setError] = useState("");
  const totalTodos = props.todos.length;

  const completedTodos = props.todos.filter((todo) => {
    return todo.completed;
  });

  const pendingTodos = props.todos.filter((todo) => {
    return !todo.completed;
  });

  const [searchTodo, setSearchTodo] = useState("");

  function changeInput(event) {
    setNewTodo(event.target.value);
    setError("");
  }

  function handleAddTodo() {
    if (newTodo.trim() === "") {
      setError("Please enter a task:");
      return;
    }

    props.addTodo(newTodo);
    setNewTodo("");
    setError("");
  }

  function changeSearch(event) {
    setSearchTodo(event.target.value);
  }

  const filteredTodos = props.todos.filter((todo) => {
    return todo.title.toLowerCase().includes(searchTodo.toLowerCase());
  });

  return (
    <div className="container py-4">
      {/* Input Todo */}
      <div className="d-flex flex-column flex-md-row align-items-stretch gap-2 mb-3">
        <div className="input-group flex-grow-1">
          <span className="input-group-text">
            <i className="bi bi-list-task"></i>
          </span>

          <input
            onChange={changeInput}
            onKeyDown={(event) => {
              if (event.key === "Enter") {
                handleAddTodo();
              }
            }}
            value={newTodo}
            type="text"
            className="form-control"
            placeholder="Enter your task..."
          />
        </div>

        <button
          onClick={handleAddTodo}
          className="btn btn-outline-primary px-3 text-nowrap fw-semibold"
        >
          <i className="bi bi-plus-lg me-2"></i>
          Add Todo
        </button>
      </div>

      {/* Error Message */}
      {error && (
        <div className="alert alert-danger py-2 mb-3">
          <i className="bi bi-exclamation-circle me-2"></i>
          {error}
        </div>
      )}

      {/* Search */}
      <div className="input-group mb-4">
        <span className="input-group-text">
          <i className="bi bi-search text-secondary"></i>
        </span>

        <input
          type="text"
          className="form-control"
          placeholder="Search Tasks..."
          value={searchTodo}
          onChange={changeSearch}
        />
      </div>

      {/* Counter */}
      <div className="d-flex flex-wrap gap-2 gap-md-3 mb-4">
        <span className="badge bg-primary fs-6 px-3 py-2">
          Total: {totalTodos}
        </span>

        <span className="badge bg-success fs-6 px-3 py-2">
          Completed: {completedTodos.length}
        </span>

        <span className="badge bg-danger fs-6 px-3 py-2">
          Pending: {pendingTodos.length}
        </span>
      </div>

      {/* Todo List */}
      <div>
        {filteredTodos.length === 0 ? (
          <div className="alert alert-warning">
            <i className="bi bi-search me-2"></i>
            No matching task found.
          </div>
        ) : (
          filteredTodos.map((todo) => {
            return (
              <Todo
                key={todo.id}
                id={todo.id}
                title={todo.title}
                completed={todo.completed}
                deleteTodo={props.deleteTodo}
                toggleComplete={props.toggleComplete}
                editTodo={props.editTodo}
              />
            );
          })
        )}
      </div>
    </div>
  );
}

export default Todos;