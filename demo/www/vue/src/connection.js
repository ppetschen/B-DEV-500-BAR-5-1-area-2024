import axios from "axios";

const getTodoItems = async () => {
  try {
    const response = await axios.get(`http://127.0.0.1:3000/todo`);
    return response.status === 200 ? response.data : [];
  } catch (error) {
    console.error("Error fetching todos:", error);
    return [];
  }
};

const createTodo = async (newTodo) => {
  try {
    const response = await axios.post(`http://127.0.0.1:3000/todo`, newTodo);
    return response.status === 200 ? response.data : null;
  } catch (error) {
    console.error("Error creating todo:", error);
    return null;
  }
};

const deleteTodo = async (todoId) => {
  try {
    const response = await axios.delete(`http://127.0.0.1:3000/todo/${todoId}`);
    return response.status === 200 ? response.data : null;
  } catch (error) {
    console.error("Error deleting todo:", error);
    return null;
  }
};

const updateTodo = async (todoId, updatedTodo) => {
  try {
    const response = await axios.put(`http://127.0.0.1:3000/todo/${todoId}`, updatedTodo);
    return response.status === 200 ? response.data : null;
  } catch (error) {
    console.error("Error updating todo:", error);
    return null;
  }
};

const patchTodo = async (todoID) => {
    try {
        const response = await axios.patch(`http://127.0.0.1:3000/todo/${todoID}`);
        if (response.status === 200) {
            return response.data;
        } else {
            console.log('ERROR! Cannot update the items');
        }
    } catch (e) {
        console.log("Server error", e);
        return null;
    }
}

export {
  getTodoItems,
  createTodo,
  deleteTodo,
  updateTodo,
  patchTodo
};
