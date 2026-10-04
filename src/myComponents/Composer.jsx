import { useState } from "react";
import { dateStringFromToday, formatDay } from "../utils/dates";

const PRIORITIES = [
  { id: "low", label: "Low" },
  { id: "normal", label: "Normal" },
  { id: "high", label: "High" },
];

const QUICK_DATES = [
  { label: "Today", offset: 0 },
  { label: "Tomorrow", offset: 1 },
  { label: "Next week", offset: 7 },
];

// Shared by the "add" box and the "edit" form so both look and work the same.
export function TaskFields({ values, onChange, idPrefix, autoFocus }) {
  const { title, priority, dueDate } = values;

  return (
    <>
      <label className="sr-only" htmlFor={`${idPrefix}-title`}>
        Task name
      </label>
      <input
        id={`${idPrefix}-title`}
        className="composer-input"
        type="text"
        maxLength={200}
        autoFocus={autoFocus}
        autoComplete="off"
        placeholder="What needs to get done?"
        value={title}
        onChange={(event) => onChange({ ...values, title: event.target.value })}
      />

      <div className="option-group">
        <span className="option-label" id={`${idPrefix}-due-label`}>
          Due date
        </span>
        <div className="chip-row" role="group" aria-labelledby={`${idPrefix}-due-label`}>
          {QUICK_DATES.map((quick) => {
            const value = dateStringFromToday(quick.offset);
            return (
              <button
                key={quick.label}
                type="button"
                className={dueDate === value ? "pill is-selected" : "pill"}
                aria-pressed={dueDate === value}
                onClick={() =>
                  onChange({ ...values, dueDate: dueDate === value ? "" : value })
                }
              >
                {quick.label}
              </button>
            );
          })}

          <label className={dueDate ? "pill pill-date is-selected" : "pill pill-date"}>
            <i className="bi bi-calendar-event" aria-hidden="true"></i>
            <span className="pill-date-text">
              {dueDate ? formatDay(dueDate) : "Pick a date"}
            </span>
            <input
              type="date"
              className="pill-date-input"
              aria-label="Choose a due date"
              value={dueDate}
              onChange={(event) =>
                onChange({ ...values, dueDate: event.target.value })
              }
            />
          </label>

          {dueDate && (
            <button
              type="button"
              className="pill pill-clear"
              onClick={() => onChange({ ...values, dueDate: "" })}
            >
              <i className="bi bi-x-lg" aria-hidden="true"></i>
              No date
            </button>
          )}
        </div>
      </div>

      <div className="option-group">
        <span className="option-label" id={`${idPrefix}-priority-label`}>
          Priority
        </span>
        <div
          className="segmented"
          role="group"
          aria-labelledby={`${idPrefix}-priority-label`}
        >
          {PRIORITIES.map((item) => (
            <button
              key={item.id}
              type="button"
              className={
                priority === item.id
                  ? `segment is-selected segment-${item.id}`
                  : "segment"
              }
              aria-pressed={priority === item.id}
              onClick={() => onChange({ ...values, priority: item.id })}
            >
              {item.label}
            </button>
          ))}
        </div>
      </div>
    </>
  );
}

const EMPTY_TASK = { title: "", priority: "normal", dueDate: "" };

function Composer({ onAdd }) {
  const [values, setValues] = useState(EMPTY_TASK);
  const [error, setError] = useState("");

  function handleSubmit(event) {
    event.preventDefault();

    if (values.title.trim() === "") {
      setError("Write a task name before adding it.");
      return;
    }

    onAdd(values);
    setValues(EMPTY_TASK);
    setError("");
  }

  return (
    <form className="composer" onSubmit={handleSubmit} noValidate>
      <h2 className="composer-heading">New task</h2>

      <TaskFields
        values={values}
        idPrefix="new"
        onChange={(next) => {
          setValues(next);
          setError("");
        }}
      />

      {error && (
        <p className="form-error" role="alert">
          <i className="bi bi-exclamation-circle" aria-hidden="true"></i>
          {error}
        </p>
      )}

      <div className="composer-footer">
        <button type="submit" className="btn btn-primary">
          <i className="bi bi-plus-lg" aria-hidden="true"></i>
          Add task
        </button>
      </div>
    </form>
  );
}

export default Composer;
