import { useState } from "react";
import Composer from "./Composer";
import ProgressStrip from "./ProgressStrip";
import Todo from "./Todo";
import { SECTIONS, compareTodos, greeting, sectionOf, todayLong } from "../utils/dates";

const FILTERS = [
  { id: "all", label: "All" },
  { id: "pending", label: "Pending" },
  { id: "done", label: "Done" },
];

function Todos({
  user,
  todos,
  loading,
  loadError,
  actions,
  legacyCount,
  onImportLegacy,
  onDismissLegacy,
}) {
  const [filter, setFilter] = useState("all");
  const [search, setSearch] = useState("");
  const [showComposer, setShowComposer] = useState(true);
  const [confirmClear, setConfirmClear] = useState(false);
  const [actionError, setActionError] = useState("");

  const total = todos.length;
  const doneTodos = todos.filter((todo) => todo.completed);
  const overdueCount = todos.filter((todo) => sectionOf(todo) === "overdue").length;
  const todayCount = todos.filter((todo) => sectionOf(todo) === "today").length;
  const firstName = (user.displayName || user.email || "").split(/[\s@]/)[0];

  // Writes show on screen instantly; this only reports a save that failed.
  function run(promise) {
    setActionError("");
    promise.catch(() =>
      setActionError("That change couldn't be saved. Check your connection and try again."),
    );
  }

  const query = search.trim().toLowerCase();
  const visibleTodos = todos
    .filter((todo) => {
      if (filter === "pending") return !todo.completed;
      if (filter === "done") return todo.completed;
      return true;
    })
    .filter((todo) => todo.title.toLowerCase().includes(query))
    .sort(compareTodos);

  const groups = SECTIONS.map((section) => ({
    ...section,
    items: visibleTodos.filter((todo) => sectionOf(todo) === section.id),
  })).filter((group) => group.items.length > 0);

  const counts = {
    all: total,
    pending: total - doneTodos.length,
    done: doneTodos.length,
  };

  let summary = "Nothing here yet. Add your first task below.";
  if (total > 0 && doneTodos.length === total) {
    summary = `All ${total} done. Nice work.`;
  } else if (total > 0) {
    const left = total - doneTodos.length;
    summary = `${left} ${left === 1 ? "task" : "tasks"} left, ${doneTodos.length} done.`;
  }

  return (
    <main className="page">
      <section className="hero">
        <p className="hero-date">{todayLong()}</p>
        <h1>
          {greeting()}, {firstName}
        </h1>
        <p className="hero-summary">{loading ? "Loading your tasks…" : summary}</p>

        {!loading && total > 0 && (
          <>
            <ProgressStrip done={doneTodos.length} total={total} />
            <dl className="stats">
              <div className={overdueCount ? "stat stat-overdue" : "stat"}>
                <dt>Overdue</dt>
                <dd>{overdueCount}</dd>
              </div>
              <div className={todayCount ? "stat stat-today" : "stat"}>
                <dt>Due today</dt>
                <dd>{todayCount}</dd>
              </div>
              <div className="stat">
                <dt>Completed</dt>
                <dd>
                  {doneTodos.length}
                  <span className="stat-of"> / {total}</span>
                </dd>
              </div>
            </dl>
          </>
        )}
      </section>

      {legacyCount > 0 && (
        <div className="notice" role="status">
          <p>
            Found {legacyCount} {legacyCount === 1 ? "task" : "tasks"} saved on
            this device from the old version. Add them to your account?
          </p>
          <div className="notice-actions">
            <button type="button" className="btn btn-primary btn-small" onClick={onImportLegacy}>
              Add to my account
            </button>
            <button type="button" className="btn btn-quiet btn-small" onClick={onDismissLegacy}>
              Not now
            </button>
          </div>
        </div>
      )}

      {showComposer ? (
        <Composer onAdd={(task) => run(actions.add(task))} />
      ) : (
        <button
          type="button"
          className="btn btn-primary btn-block"
          onClick={() => setShowComposer(true)}
        >
          <i className="bi bi-plus-lg" aria-hidden="true"></i>
          New task
        </button>
      )}

      {actionError && (
        <p className="banner banner-error" role="alert">
          {actionError}
        </p>
      )}

      <div className="toolbar">
        <div className="tabs" role="group" aria-label="Filter tasks">
          {FILTERS.map((item) => (
            <button
              key={item.id}
              type="button"
              className={filter === item.id ? "tab is-active" : "tab"}
              aria-pressed={filter === item.id}
              onClick={() => setFilter(item.id)}
            >
              {item.label}
              <span className="tab-count">{counts[item.id]}</span>
            </button>
          ))}
        </div>

        <label className="search">
          <span className="sr-only">Search tasks</span>
          <i className="bi bi-search" aria-hidden="true"></i>
          <input
            type="search"
            placeholder="Search tasks"
            value={search}
            onChange={(event) => setSearch(event.target.value)}
          />
        </label>
      </div>

      {loadError ? (
        <p className="banner banner-error" role="alert">
          Your tasks couldn't be loaded. Check that the Firestore rules from the
          README are published, then refresh the page.
        </p>
      ) : loading ? (
        <p className="empty">Loading your tasks…</p>
      ) : groups.length === 0 ? (
        <div className="empty">
          <i className="bi bi-inbox" aria-hidden="true"></i>
          <p>
            {total === 0
              ? "No tasks yet. Type one above and select Add task."
              : "No tasks match this filter or search."}
          </p>
        </div>
      ) : (
        groups.map((group) => (
          <section className="group" key={group.id} aria-labelledby={`group-${group.id}`}>
            <h2
              id={`group-${group.id}`}
              className={`group-title group-${group.id}`}
            >
              {group.label}
              <span className="group-count">{group.items.length}</span>
            </h2>
            <ul className="task-list">
              {group.items.map((todo) => (
                <Todo
                  key={todo.id}
                  todo={todo}
                  onToggle={(id, completed) => run(actions.toggle(id, completed))}
                  onSave={(id, fields) => run(actions.edit(id, fields))}
                  onDelete={(id) => run(actions.remove(id))}
                />
              ))}
            </ul>
          </section>
        ))
      )}

      {doneTodos.length > 0 && (
        <div className="clear-row">
          {confirmClear ? (
            <>
              <span className="confirm-text">
                Delete {doneTodos.length} completed{" "}
                {doneTodos.length === 1 ? "task" : "tasks"}?
              </span>
              <button
                type="button"
                className="btn btn-danger btn-small"
                onClick={() => {
                  run(actions.clearCompleted(doneTodos.map((todo) => todo.id)));
                  setConfirmClear(false);
                }}
              >
                Delete
              </button>
              <button
                type="button"
                className="btn btn-quiet btn-small"
                onClick={() => setConfirmClear(false)}
              >
                Keep
              </button>
            </>
          ) : (
            <button
              type="button"
              className="btn btn-quiet btn-small"
              onClick={() => setConfirmClear(true)}
            >
              <i className="bi bi-trash3" aria-hidden="true"></i>
              Clear completed
            </button>
          )}
        </div>
      )}
    </main>
  );
}

export default Todos;
