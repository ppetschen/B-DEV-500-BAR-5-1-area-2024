<template>
  <div class="container">
    <b-card title="ToDo List" class="mb-4">
      <b-form @submit.prevent="addTodo">
        <b-form-group>
          <b-form-input v-model="newTodo.title" placeholder="Add a new task" />
        </b-form-group>
        <b-form-group>
          <b-form-select
            v-model="newTodo.importance"
            :options="importanceOptions"
          />
        </b-form-group>
        <b-button type="submit" variant="primary">Add</b-button>
      </b-form>

      <b-list-group class="mt-3">
        <b-list-group-item
          v-for="(todo, index) in todos"
          :key="index"
          class="d-flex justify-content-between align-items-center"
          :class="`bg-${todo.importance.toLowerCase()}`"
        >
          <!-- Task title and importance -->
          <div v-if="!todo.isEditing" @click="editTodo(index)" class="task-title">
            <div :class="{ 'line-through text-gray-500': todo.done }">
              <strong>{{ todo.title }}</strong>
              <br />
              <small>Importance: {{ todo.importance }}</small>
            </div>
          </div>

          <!-- to edit mode for task title and importance -->
          <div v-else>
            <b-form-input
              v-model="todo.title"
              @blur="saveTodo(index)"
              @keyup.enter="saveTodo(index)"
              placeholder="Edit task title"
            />
            <b-form-select
              v-model="todo.importance"
              :options="importanceOptions"
              @blur="saveTodo(index)"
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
export default {
  data() {
    return {
      newTodo: {
        title: "",
        importance: "Select",
        done: false,
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
  methods: {
    addTodo() {
      if (this.newTodo.title.trim() && this.newTodo.importance !== "Select") {
        this.todos.push({ ...this.newTodo, isEditing: false });
        this.newTodo.title = "";
        this.newTodo.importance = "Select";
        this.newTodo.done = false;
      }
    },
    removeTodo(index) {
      this.todos.splice(index, 1);
    },
    toggleTodo(index) {
      this.todos[index].done = !this.todos[index].done;
    },
    editTodo(index) {
      this.todos[index].isEditing = true; // Enable the edit mode
    },
    saveTodo(index) {
      this.todos[index].isEditing = false; // Disable edit mode, saving changes
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
  background-color: #96a621;
}

.bg-medium {
  background-color: #f2b705;
}

.bg-high {
  background-color: #fe5b48;
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
