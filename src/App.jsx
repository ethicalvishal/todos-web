import { useEffect, useState } from "react";
import Header from "./myComponents/Header";
import "./App.css";
import Todos from "./myComponents/Todos";
import Footer from "./myComponents/Footer";
import { db } from "./firebase";
import {
  collection,
  addDoc,
  deleteDoc,
  updateDoc,
  doc,
  onSnapshot,
} from "firebase/firestore";

function App() {
  const [todos, setTodos] = useState([]);

  useEffect(() => {
    const unsubscribe = onSnapshot(collection(db, "todos"), (snapshot) => {
      const todosData = snapshot.docs.map((docItem) => ({
        id: docItem.id,
        ...docItem.data(),
      }));
      setTodos(todosData);
    });

    return () => unsubscribe();
  }, []);

  async function addTodo(todo) {
    await addDoc(collection(db, "todos"), {
      title: todo,
      completed: false,
    });
  }

  async function deleteTodo(id) {
    await deleteDoc(doc(db, "todos", id));
  }

  async function toggleComplete(id) {
    const todo = todos.find((t) => t.id === id);
    await updateDoc(doc(db, "todos", id), {
      completed: !todo.completed,
    });
  }

  async function editTodo(id, newTitle) {
    await updateDoc(doc(db, "todos", id), {
      title: newTitle,
    });
  }

  return (
    <>
      <Header />
      <Todos
        todos={todos}
        addTodo={addTodo}
        deleteTodo={deleteTodo}
        toggleComplete={toggleComplete}
        editTodo={editTodo}
      />
      <Footer />
    </>
  );
}

export default App;