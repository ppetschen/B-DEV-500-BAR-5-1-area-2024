import axios from "axios";

const getTodoItems = async () => {
  try {
    const response = await axios.get(`${process.env.REACT_APP_BASE_URL}/todo`);
    return response.status === 200 ? response.data : [];
  } catch (error) {
    console.error("Error fetching todos:", error);
    return [];
  }
};

const createTodo = async (newTodo) => {
  try {
    const response = await axios.post(`${process.env.REACT_APP_BASE_URL}/todo`, newTodo);
    return response.status === 200 ? response.data : null;
  } catch (error) {
    console.error("Error creating todo:", error);
    return null;
  }
};

const deleteTodo = async (todoId) => {
  try {
    const response = await axios.delete(`${process.env.REACT_APP_BASE_URL}/todo/${todoId}`);
    return response.status === 200 ? response.data : null;
  } catch (error) {
    console.error("Error deleting todo:", error);
    return null;
  }
};

const updateTodo = async (todoId, updatedTodo) => {
  try {
    const response = await axios.put(`${process.env.REACT_APP_BASE_URL}/todo/${todoId}`, updatedTodo);
    return response.status === 200 ? response.data : null;
  } catch (error) {
    console.error("Error updating todo:", error);
    return null;
  }
};

const patchTodo = async (todoID) => {
    try {
        const response = await axios.patch(`${process.env.REACT_APP_BASE_URL}/todo/${todoID}`);
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
