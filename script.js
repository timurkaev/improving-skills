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
