class TodoStore {
  constructor() {
    this.todos = this.loadFromStorage();
  }

  getActiveTodos() {
    return this.todos.filter(t => !t.completed)
  }

  getCompletedTodos() {
    return this.todos.filter(t => t.completed)
  }

  loadFromStorage() {
    const data = localStorage.getItem('todos')
    return data ? JSON.parse(data) : []
  }

  saveToStorage() {
    localStorage.setItem('todos', JSON.stringify(this.todos))
  }

  addTodo(text) {
    const todo = {
      id: Date.now(),
      text: text.trim(),
      completed: false,
      createdAt: new Date().toISOString()
    }
    this.todos.push(todo)
    this.saveToStorage()
    return todo
  }

  deleteTodo(id) {
    this.todos = this.todos.filter(todo => todo.id !== id)
    this.saveToStorage()
  }

  toggleTodo(id) {
    const todo = this.todos.find(t => t.id === id)
    if (todo) {
      todo.completed = !todo.completed
      this.saveToStorage()
    }
  }

  getTodos(filter = "all") {
    switch (filter) {
      case 'active':
        return this.getActiveTodos();
      case 'completed':
        return this.getCompletedTodos();
      default:
        return this.todos;
    }
  }

  getStats() {
    return {
      total: this.todos.length,
      active: this.getActiveTodos().length,
      completed: this.getCompletedTodos().length
    }
  }
}

class TodoUI {
  constructor() {
    this.todoInput = document.getElementById('todoInput')
    this.addBtn = document.getElementById('addBtn')
    this.todoList = document.getElementById('todoList')
    this.emptyState = document.getElementById('emptyState')
    this.filters = document.querySelectorAll(".filter-btn")
    this.stats = {
      total: document.getElementById('totalCount'),
      active: document.getElementById('activeCount'),
      completed: document.getElementById("completedCount")
    }
  }

  renderTodos(todos) {
    this.todoList.innerHTML = '';

    if (todos.length === 0) {
      this.emptyState.style.display = 'block';
      return;
    }

    this.emptyState.style.display = 'none';
    todos.forEach(todo => {
      this.todoList.appendChild(this.createTodoElement(todo))
    })
  }

  createTodoElement(todo) {
    const li = document.createElement('li')
    li.className = `todo-item ${todo.completed ? 'completed' : ''}`
    li.dataset.id = todo.id

    const createdTime = new Date(todo.createdAt).toLocaleTimeString('ru-RU', {
      hour: '2-digit',
      minute: '2-digit'
    });

    li.innerHTML = `
      <input 
        type="checkbox"
        class="checkbox"
        ${todo.completed ? 'checked' : ''}
        aria-lable="Отметить задачу как заверншенную"
      />
      <div class="todo-content">
        <p class="todo-text">${this.escapeHtml(todo.text)}</p>
        <p class="todo-time">${createdTime}</p>
      </div>
      <div class="todo-actions">
        <button 
          class="btn-icon-small btn-delete"
          aria-lable="Удалить задачу"
        >
          Удалить
        </button>
      </div>
    `;

    return li;
  }

  escapeHtml(text) {
    const div = document.createElement('div')
    div.textContent = text;
    return div.innerHTML;
  }

  updateStats(stats) {
    this.stats.total.textContent = stats.total;
    this.stats.active.textContent = stats.active;
    this.stats.completed.textContent = stats.completed;
  }

  clearAndFocusInput() {
    this.todoInput.value = "";
    this.todoInput.focus();
  }

  setActiveFilter(filterName) {
    this.filters.forEach(btn => {
      btn.classList.toggle('active', btn.dataset.filter === filterName);
    });
  }

  getInputValue() {
    return this.todoInput.value;
  }
}


class TodoApp {
  constructor() {
    this.store = new TodoStore();
    this.ui = new TodoUI();
    this.currentFilter = 'all';
    this.init();
  }

  init() {
    this.attachEventListeners();
    this.render();
  }

  attachEventListeners() {
    this.ui.addBtn.addEventListener('click', () => this.handleAddTodo());
    this.ui.todoInput.addEventListener('keydown', (e) => {
      if (e.key === "Enter") this.handleAddTodo();
    })

    // filters
    this.ui.filters.forEach(btn => {
      btn.addEventListener('click', () => {
        this.currentFilter = btn.dataset.filter;
        this.ui.setActiveFilter(this.currentFilter)
        this.render()
      })
    })

    // Events delegate
    this.ui.todoList.addEventListener('change', (e) => {
      if (e.target.classList.contains('checkbox')) {
        const id = Number(e.target.closest('.todo-item').dataset.id);
        this.handleToggleTodo(id);
      }
    })

    this.ui.todoList.addEventListener('click', (e) => {
      const deleteBtn = e.target.closest('.btn-delete')
      if (deleteBtn) {
        const id = Number(deleteBtn.closest('.todo-item').dataset.id)
        this.handleDeleteTodo(id)
      }
    })
  }

  handleAddTodo() {
    const text = this.ui.getInputValue();

    if (!text.trim()) {
      alert('Пожалуйста введите текст задачи')
      return;
    }

    if (text.length > 200) {
      alert("Задача не должна быть длиннее 200 символов")
      return;
    }

    this.store.addTodo(text)
    this.ui.clearAndFocusInput()
    this.render();
  }

  handleDeleteTodo(id) {
    console.log("call handleDeleteTodo")
    if (confirm("Вы уверены что хотите удалить задачу?")) {
      console.log(true)
      this.store.deleteTodo(id);
      this.render();
    }
  }

  handleToggleTodo(id) {
    this.store.toggleTodo(id);
    this.render();
  }

  render() {
    const todos = this.store.getTodos(this.currentFilter);
    const stats = this.store.getStats();

    this.ui.renderTodos(todos);
    this.ui.updateStats(stats);
  }
}

document.addEventListener('DOMContentLoaded', () => {
  new TodoApp();
})

/* 
 *
 *
 *
 *
 *
 *
 *
 *
 *
 *
 *
 *
 *
 *
 *
 *
 *
 *
 *
 *
 *
 *
 *
 *
 *
 *
 *
 *
 *
 *
 *
 *
 *
 *
 *
 *
 *
 *
 *
 *
 *
 *
 *
 *
 *
 *
 *
 *
 *
 *
 * */
