"use client";
import { useEffect, useState } from "react";

interface TodoItem {
  id: string;
  title: string;
  description: string;
  completed: boolean;
}

const API_URL = process.env.NEXT_PUBLIC_API_URL + "/todo";

export default function Home() {
  const [todos, setTodos] = useState<TodoItem[]>([]);
  const [newTodo, setNewTodo] = useState({ title: "", description: "" });
  const [loading, setLoading] = useState(true);

  const fetchTodos = async () => {
    setLoading(true);
    try {
      const response = await fetch(API_URL);
      const data = await response.json();
      setTodos(data.data);
    } catch (error) {
      console.error("Failed to fetch todos:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTodos();
  }, []);

  const addTodo = async () => {
    if (!newTodo.title || !newTodo.description) return;
    try {
      const response = await fetch(API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: newTodo.title,
          description: newTodo.description,
          completed: false,
        }),
      });
      if (response.ok) {
        setNewTodo({ title: "", description: "" });
        fetchTodos();
      }
    } catch (error) {
      console.error("Failed to create todo:", error);
    }
  };

  const deleteTodo = async (id: string) => {
    try {
      await fetch(`${API_URL}/${id}`, { method: "DELETE" });
      fetchTodos();
    } catch (error) {
      console.error("Failed to delete todo:", error);
    }
  };

  const toggleTodo = async (id: string, completed: boolean) => {
    try {
      await fetch(`${API_URL}/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ completed: !completed }),
      });
      fetchTodos();
    } catch (error) {
      console.error("Failed to update todo:", error);
    }
  };

  return (
    <div className="max-w-lg mx-auto p-6 bg-white shadow-md rounded-md mt-10">
      <h1 className="text-3xl font-bold text-center mb-8 text-gray-800">
        Todo List
      </h1>

      <div className="mb-6">
        <input
          type="text"
          placeholder="Enter a title"
          className="border border-gray-300 rounded-lg p-3 w-full mb-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
          value={newTodo.title}
          onChange={(e) => setNewTodo({ ...newTodo, title: e.target.value })}
        />
        <input
          type="text"
          placeholder="Enter a description"
          className="border border-gray-300 rounded-lg p-3 w-full mb-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
          value={newTodo.description}
          onChange={(e) =>
            setNewTodo({ ...newTodo, description: e.target.value })}
        />
        <button
          onClick={addTodo}
          className="w-full bg-blue-500 text-white p-3 rounded-lg font-medium hover:bg-blue-600 transition duration-300"
        >
          Add Todo
        </button>
      </div>

      {loading
        ? <p className="text-center text-gray-500">Loading...</p>
        : (
          <ul className="space-y-4">
            {todos.map((todo) => (
              <li
                key={todo.id}
                className="flex justify-between items-center bg-gray-100 p-4 rounded-lg shadow"
              >
                <div>
                  <h3
                    className={`${
                      todo.completed
                        ? "line-through text-gray-400"
                        : "text-gray-800"
                    } font-semibold text-lg`}
                  >
                    {todo.title}
                  </h3>
                  <p className="text-sm text-gray-600">{todo.description}</p>
                </div>
                <div className="flex space-x-2">
                  <button
                    onClick={() => toggleTodo(todo.id, todo.completed)}
                    className={`text-xs px-3 py-1 rounded-lg ${
                      todo.completed
                        ? "bg-green-100 text-green-700"
                        : "bg-yellow-100 text-yellow-700"
                    } font-medium`}
                  >
                    {todo.completed ? "completed" : "Pending"}
                  </button>
                  <button
                    onClick={() => deleteTodo(todo.id)}
                    className="text-xs bg-red-100 text-red-700 px-3 py-1 rounded-lg font-medium hover:bg-red-200 transition duration-300"
                  >
                    Delete
                  </button>
                </div>
              </li>
            ))}
          </ul>
        )}
    </div>
  );
}
