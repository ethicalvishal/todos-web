import { useState } from "react";
import "./App.css";
import AuthProvider from "./auth/AuthProvider";
import { useAuth } from "./auth/useAuth";
import { useTodos } from "./hooks/useTodos";
import Header from "./myComponents/Header";
import Todos from "./myComponents/Todos";
import Footer from "./myComponents/Footer";
import AuthPage from "./pages/AuthPage";
import SetupNotice from "./pages/SetupNotice";

// Tasks the old single-user version saved in this browser.
function readLegacyTodos() {
  try {
    const saved = JSON.parse(localStorage.getItem("todos") || "[]");
    return Array.isArray(saved)
      ? saved.filter((item) => item && typeof item.title === "string" && item.title.trim())
      : [];
  } catch {
    return [];
  }
}

function TodoApp({ user }) {
  const { signOut } = useAuth();
  const {
    todos,
    loading,
    error,
    addTodo,
    toggleTodo,
    editTodo,
    deleteTodo,
    clearCompleted,
    importTodos,
  } = useTodos(user.uid);

  const dismissKey = `legacy-dismissed-${user.uid}`;
  const [legacy, setLegacy] = useState(() =>
    localStorage.getItem(dismissKey) ? [] : readLegacyTodos(),
  );

  function importLegacy() {
    importTodos(legacy)
      .then(() => localStorage.removeItem("todos"))
      .catch(() => {});
    setLegacy([]);
  }

  function dismissLegacy() {
    localStorage.setItem(dismissKey, "1");
    setLegacy([]);
  }

  const actions = {
    add: addTodo,
    toggle: toggleTodo,
    edit: editTodo,
    remove: deleteTodo,
    clearCompleted,
  };

  return (
    <>
      <Header user={user} onSignOut={signOut} />
      <Todos
        user={user}
        todos={todos}
        loading={loading}
        loadError={Boolean(error)}
        actions={actions}
        legacyCount={legacy.length}
        onImportLegacy={importLegacy}
        onDismissLegacy={dismissLegacy}
      />
      <Footer />
    </>
  );
}

function Shell() {
  const { user, loading, isConfigured } = useAuth();

  if (!isConfigured) return <SetupNotice />;

  if (loading) {
    return (
      <div className="splash" role="status">
        Loading…
      </div>
    );
  }

  if (!user) return <AuthPage />;

  return <TodoApp key={user.uid} user={user} />;
}

function App() {
  return (
    <AuthProvider>
      <Shell />
    </AuthProvider>
  );
}

export default App;
