<template>
  <div class="container">
    <b-card title="ToDo List" class="mb-4">
      <b-form @submit.prevent="addTodo">
        <b-form-group>
          <b-form-input
            v-model="newTodo.title"
            placeholder="Add a new task"
            required
          />
        </b-form-group>
        <b-form-group>
          <b-form-select
            v-model="newTodo.importance"
            :options="importanceOptions"
            required
          />
        </b-form-group>
        <b-form-group>
          <b-form-textarea
            v-model="newTodo.description"
            placeholder="Add an optional description"
          />
        </b-form-group>
        <b-button type="submit" variant="primary">Add</b-button>
      </b-form>

      <b-list-group class="mt-3">
        <b-list-group-item
          v-for="(todo, index) in todos"
          :key="index"
          class="d-flex justify-content-between align-items-center"
        >
          <!-- View mode -->
          <div v-if="!todo.isEditing" @click="editTodo(index)" class="task-title">
            <div :class="{ 'line-through text-gray-500': todo.done }">
              <strong>{{ todo.title }}</strong><br />
              <small>Importance: {{ todo.importance }}</small>
              <p v-if="todo.description">{{ todo.description }}</p>
            </div>
          </div>

          <!-- Edit mode -->
          <div v-else>
            <b-form-input
              v-model="todo.title"
              @blur="saveTodo(index)"
              @keyup.enter="saveTodo(index)"
              placeholder="Edit task title"
              required
            />
            <b-form-select
              v-model="todo.importance"
              :options="importanceOptions"
              @blur="saveTodo(index)"
            />
            <b-form-textarea
              v-model="todo.description"
              @blur="saveTodo(index)"
              placeholder="Edit description"
            />
          </div>

          <!-- Checkbox and remove -->
          <div class="d-flex align-items-center">
            <b-form-checkbox
              v-model="todo.done"
              @change="toggleTodo(index)"
              class="mr-2"
            ></b-form-checkbox>
            <b-button variant="danger" size="sm" @click="removeTodo(index)">
              Remove
            </b-button>
          </div>
        </b-list-group-item>
      </b-list-group>
    </b-card>
  </div>
</template>

<script>
import { getTodoItems, createTodo, deleteTodo, updateTodo, patchTodo } from "../connection";

export default {
  data() {
    return {
      newTodo: {
        title: "",
        importance: "Select",
        done: false,
        description: "",
      },
      todos: [],
      importanceOptions: [
        { text: "-- Select --", value: "Select" },
        { text: "Low", value: "Low" },
        { text: "Medium", value: "Medium" },
        { text: "High", value: "High" },
      ],
    };
  },
  created() {
    this.loadTodos();
  },
  methods: {
    // Load todos with isEditing field
    async loadTodos() {
      const response = await getTodoItems();
      const todoItems = response.data;

     console.log(todoItems); // {data: []}
      this.todos = todoItems.map(todo => ({ ...todo, isEditing: false }));
    },

    async addTodo() {
      if (this.newTodo.title.trim() && this.newTodo.importance !== "Select") {
        const createdTodo = await createTodo(this.newTodo);
        if (createdTodo) {
          this.todos.push({ ...createdTodo, isEditing: false });
          this.newTodo = { title: "", importance: "Select", description: "", done: false };
        }
        this.loadTodos();
      } else {
        alert("Please enter a valid title and select an importance level.");
      }
    },

    async removeTodo(index) {
      const todoId = this.todos[index].id;
      const deletedTodo = await deleteTodo(todoId);
      if (deletedTodo) {
        this.todos.splice(index, 1);
      }
    },

    // Toggle done status and update server via patchTodo
    async toggleTodo(index) {
      const todo = this.todos[index];
      todo.done = !todo.done;
      const updatedTodo = await patchTodo(todo.id);
      if (!updatedTodo) {
        todo.done = !todo.done; // Revert if error
      }
    },

    editTodo(index) {
      this.todos.forEach((todo, i) => {
        if (i !== index) todo.isEditing = false; // Cancel editing on other items
      });
      this.todos[index].isEditing = true;
    },

    async saveTodo(index) {
      const todo = this.todos[index];
      if (todo.title.trim()) {
        const updatedTodo = await updateTodo(todo.id, todo);
        if (updatedTodo) {
          this.todos[index].isEditing = false;
        }
      } else {
        alert("Title cannot be empty.");
      }
    },
  },
};
</script>

<style scoped>
.container {
  max-width: 800px;
  margin: 0 auto;
}

.bg-low {
  border-color: #96a621;
}

.bg-medium {
  border-color: #f2b705;
}

.bg-high {
  border-color: #fe5b48;
}

.line-through {
  text-decoration: line-through;
}

.text-gray-500 {
  color: #6b7280;
}

.d-flex {
  display: flex;
}

.mr-2 {
  margin-right: 0.5rem;
}

.align-items-center {
  align-items: center;
}

.task-title {
  cursor: pointer;
}
</style>
