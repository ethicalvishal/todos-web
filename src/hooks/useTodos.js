import { useCallback, useEffect, useState } from "react";
import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  onSnapshot,
  orderBy,
  query,
  serverTimestamp,
  updateDoc,
  writeBatch,
} from "firebase/firestore";
import { db } from "../firebase";

const NO_TODOS = [];

// Every user's tasks live at users/{uid}/todos, so lists never mix.
function todosCollection(uid) {
  return collection(db, "users", uid, "todos");
}

export function useTodos(uid) {
  const [snapshot, setSnapshot] = useState({
    uid: null,
    todos: NO_TODOS,
    error: null,
  });

  useEffect(() => {
    if (!uid || !db) return undefined;

    const todosQuery = query(todosCollection(uid), orderBy("createdAt", "desc"));

    return onSnapshot(
      todosQuery,
      (result) => {
        setSnapshot({
          uid,
          todos: result.docs.map((item) => ({
            id: item.id,
            ...item.data({ serverTimestamps: "estimate" }),
          })),
          error: null,
        });
      },
      (error) => {
        setSnapshot({ uid, todos: NO_TODOS, error });
      },
    );
  }, [uid]);

  const ready = Boolean(uid) && snapshot.uid === uid;

  const addTodo = useCallback(
    ({ title, priority, dueDate }) =>
      addDoc(todosCollection(uid), {
        title: title.trim(),
        completed: false,
        priority,
        dueDate: dueDate || null,
        createdAt: serverTimestamp(),
        completedAt: null,
      }),
    [uid],
  );

  const toggleTodo = useCallback(
    (id, completed) =>
      updateDoc(doc(db, "users", uid, "todos", id), {
        completed,
        completedAt: completed ? serverTimestamp() : null,
      }),
    [uid],
  );

  const editTodo = useCallback(
    (id, { title, priority, dueDate }) =>
      updateDoc(doc(db, "users", uid, "todos", id), {
        title: title.trim(),
        priority,
        dueDate: dueDate || null,
      }),
    [uid],
  );

  const deleteTodo = useCallback(
    (id) => deleteDoc(doc(db, "users", uid, "todos", id)),
    [uid],
  );

  const clearCompleted = useCallback(
    (ids) => {
      const batch = writeBatch(db);
      ids.forEach((id) => batch.delete(doc(db, "users", uid, "todos", id)));
      return batch.commit();
    },
    [uid],
  );

  const importTodos = useCallback(
    (items) => {
      const batch = writeBatch(db);
      items.forEach((item) => {
        batch.set(doc(todosCollection(uid)), {
          title: item.title.trim(),
          completed: Boolean(item.completed),
          priority: "normal",
          dueDate: null,
          createdAt: serverTimestamp(),
          completedAt: null,
        });
      });
      return batch.commit();
    },
    [uid],
  );

  return {
    todos: ready ? snapshot.todos : NO_TODOS,
    loading: Boolean(uid) && !ready,
    error: ready ? snapshot.error : null,
    addTodo,
    toggleTodo,
    editTodo,
    deleteTodo,
    clearCompleted,
    importTodos,
  };
}
