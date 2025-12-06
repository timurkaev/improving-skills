import type { FilterType, IStats, ITodo, ITodoDOMElements } from "../types"

export class TodoUI {
  private elements: ITodoDOMElements;

  constructor() {
    this.elements = this.initializeElements()
  }

  private initializeElements(): ITodoDOMElements {
    const todoInput = document.getElementById('todoInput') as HTMLInputElement
    const addBtn = document.getElementById('addBtn') as HTMLButtonElement
    const todoList = document.getElementById('todoList') as HTMLUListElement
    const emptyState = document.getElementById('emptyState') as HTMLDivElement
    const filters = document.querySelectorAll(".filter-btn") as NodeListOf<HTMLButtonElement>
    const emptyError = document.getElementById("emptyError") as HTMLDivElement
    const tooLongError = document.getElementById("tooLongError") as HTMLDivElement

    if (!todoInput || !addBtn || !todoList || !emptyState) {
      throw new Error("Не найдены необходимые DOM элементы")
    }

    return {
      todoInput,
      addBtn,
      todoList,
      emptyState,
      filters,
      emptyError,
      tooLongError,
      stats: {
        total: document.getElementById('totalCount') as HTMLDivElement,
        active: document.getElementById('activeCount') as HTMLDivElement,
        completed: document.getElementById('completedCount') as HTMLDivElement
      }
    }
  }

  renderTodos(todos: ITodo[]): void {
    this.elements.todoList.innerHTML = '';

    if (todos.length === 0) {
      this.elements.emptyState.style.display = 'block';
      return;
    }

    this.elements.emptyState.style.display = 'none';
    todos.forEach(todo => {
      this.elements.todoList.appendChild(this.createTodoElement(todo))
    })
  }

  createTodoElement(todo: ITodo): HTMLLIElement {
    const li: HTMLLIElement = document.createElement('li')
    li.className = `todo-item ${todo.completed ? 'completed' : ''}`
    li.dataset.id = String(todo.id)

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

  escapeHtml(text: string): string {
    const div: HTMLDivElement = document.createElement('div')
    div.textContent = text;
    return div.innerHTML;
  }

  updateStats(stats: IStats): void {
    this.elements.stats.total.textContent = String(stats.total);
    this.elements.stats.active.textContent = String(stats.active);
    this.elements.stats.completed.textContent = String(stats.completed);
  }

  clearAndFocusInput(): void {
    this.elements.todoInput.value = "";
    this.elements.todoInput.focus();
  }

  setActiveFilter(filterName: FilterType) {
    this.elements.filters.forEach((btn: HTMLButtonElement) => {
      btn.classList.toggle('active', btn.dataset.filter === filterName);
    });
  }

  getInputValue(): string {
    return this.elements.todoInput.value;
  }

  getAddButton(): HTMLButtonElement {
    return this.elements.addBtn
  }

  getTodoInput(): HTMLInputElement {
    return this.elements.todoInput
  }

  getTodoList(): HTMLUListElement {
    return this.elements.todoList
  }

  getFilters(): NodeListOf<HTMLButtonElement> {
    return this.elements.filters
  }

  getEmptyError(): HTMLDivElement {
    return this.elements.emptyError
  }

  getTooLongError(): HTMLDivElement {
    return this.elements.tooLongError
  }
}
