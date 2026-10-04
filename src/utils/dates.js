const MS_PER_DAY = 24 * 60 * 60 * 1000;

function startOfToday() {
  const now = new Date();
  return new Date(now.getFullYear(), now.getMonth(), now.getDate());
}

function parseDateString(value) {
  const [year, month, day] = value.split("-").map(Number);
  return new Date(year, month - 1, day);
}

function toDateString(date) {
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${date.getFullYear()}-${month}-${day}`;
}

// "YYYY-MM-DD" for today plus a number of days (what <input type="date"> uses).
export function dateStringFromToday(offsetDays) {
  const date = startOfToday();
  date.setDate(date.getDate() + offsetDays);
  return toDateString(date);
}

// Whole days from today: negative means the date has passed.
export function daysFromToday(dateString) {
  return Math.round((parseDateString(dateString) - startOfToday()) / MS_PER_DAY);
}

export function formatDay(dateString) {
  return parseDateString(dateString).toLocaleDateString(undefined, {
    weekday: "short",
    day: "numeric",
    month: "short",
  });
}

export function greeting() {
  const hour = new Date().getHours();

  if (hour < 12) return "Good morning";
  if (hour < 17) return "Good afternoon";
  return "Good evening";
}

export function todayLong() {
  return new Date().toLocaleDateString(undefined, {
    weekday: "long",
    day: "numeric",
    month: "long",
  });
}

// Short text for a due date, with a tone the UI uses for colour.
export function describeDue(dueDate, completed) {
  if (!dueDate) return null;

  const days = daysFromToday(dueDate);
  const date = parseDateString(dueDate).toLocaleDateString(undefined, {
    day: "numeric",
    month: "short",
  });

  if (completed) return { tone: "done", label: `Due ${date}` };

  if (days < 0) {
    const late = Math.abs(days);
    return {
      tone: "overdue",
      label: `${late} ${late === 1 ? "day" : "days"} overdue`,
    };
  }
  if (days === 0) return { tone: "today", label: "Today" };
  if (days === 1) return { tone: "soon", label: "Tomorrow" };
  if (days <= 6) {
    return {
      tone: "soon",
      label: parseDateString(dueDate).toLocaleDateString(undefined, {
        weekday: "long",
      }),
    };
  }

  return { tone: "later", label: date };
}

// createdAt comes from Firestore as a Timestamp (or null for a moment after adding).
export function describeCreated(createdAt) {
  const date = createdAt?.toDate ? createdAt.toDate() : null;
  if (!date) return "Added just now";

  const isToday = date.toDateString() === new Date().toDateString();
  if (isToday) {
    return `Added today, ${date.toLocaleTimeString(undefined, {
      hour: "numeric",
      minute: "2-digit",
    })}`;
  }

  return `Added ${date.toLocaleDateString(undefined, {
    day: "numeric",
    month: "short",
  })}`;
}

// The order tasks appear on the page, grouped by when they are due.
export const SECTIONS = [
  { id: "overdue", label: "Overdue" },
  { id: "today", label: "Today" },
  { id: "tomorrow", label: "Tomorrow" },
  { id: "week", label: "This week" },
  { id: "later", label: "Later" },
  { id: "none", label: "No due date" },
  { id: "done", label: "Completed" },
];

export function sectionOf(todo) {
  if (todo.completed) return "done";
  if (!todo.dueDate) return "none";

  const days = daysFromToday(todo.dueDate);
  if (days < 0) return "overdue";
  if (days === 0) return "today";
  if (days === 1) return "tomorrow";
  if (days <= 7) return "week";
  return "later";
}

const PRIORITY_RANK = { high: 0, normal: 1, low: 2 };

function millis(timestamp) {
  return timestamp?.toMillis ? timestamp.toMillis() : Date.now();
}

// Earliest due date first, then higher priority, then newest.
// Completed tasks show the most recently finished first.
export function compareTodos(a, b) {
  if (a.completed && b.completed) {
    return millis(b.completedAt) - millis(a.completedAt);
  }

  if (a.dueDate !== b.dueDate) {
    if (!a.dueDate) return 1;
    if (!b.dueDate) return -1;
    return a.dueDate < b.dueDate ? -1 : 1;
  }

  const byPriority =
    PRIORITY_RANK[a.priority || "normal"] - PRIORITY_RANK[b.priority || "normal"];
  if (byPriority !== 0) return byPriority;

  return millis(b.createdAt) - millis(a.createdAt);
}
