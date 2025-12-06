import { TodoStore } from "./store/TodoStore";
import type { FilterType, IStats, ITodo } from "./types";
import { TodoUI } from "./ui/TodoUI";

class TodoApp {
  private store: TodoStore
  private ui: TodoUI
  private currentFilter: FilterType = 'all'

  constructor() {
    this.store = new TodoStore();
    this.ui = new TodoUI();
    this.currentFilter = 'all';
    this.init();
  }

  init(): void {
    this.attachEventListeners();
    this.render();
  }

  private attachEventListeners(): void {
    this.ui.getAddButton().addEventListener('click', () => this.handleAddTodo());
    this.ui.getTodoInput().addEventListener('keydown', (e) => {
      if (e.key === "Enter") this.handleAddTodo();
    })

    // filters
    this.ui.getFilters().forEach((btn: HTMLButtonElement) => {
      btn.addEventListener('click', () => {
        this.currentFilter = btn.dataset.filter as FilterType
        this.ui.setActiveFilter(this.currentFilter)
        this.render()
      })
    })

    // Events delegate
    this.ui.getTodoList()?.addEventListener('change', (e: Event) => {
      const target = e.target as HTMLInputElement;
      if (target.classList.contains('checkbox')) {
        const item = target.closest('.todo-item') as HTMLElement;
        const id = Number(item?.dataset.id)
        this.handleToggleTodo(id);
      }
    })

    this.ui.getTodoList().addEventListener('click', (e: Event) => {
      const target = e.target as HTMLElement
      if (target.classList.contains('btn-delete')) {
        const item = target.closest('.todo-item') as HTMLElement
        const id = Number(item?.dataset.id)
        this.handleDeleteTodo(id)
      }
    })
  }

  handleAddTodo(): void {
    const text: string = this.ui.getInputValue();

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

  handleDeleteTodo(id: number): void {
    if (confirm("Вы уверены что хотите удалить задачу?")) {
      this.store.deleteTodo(id);
      this.render();
    }
  }

  handleToggleTodo(id: number): void {
    this.store.toggleTodo(id);
    this.render();
  }

  render(): void {
    const todos: ITodo[] = this.store.getTodos(this.currentFilter);
    const stats: IStats = this.store.getStats();

    this.ui.renderTodos(todos);
    this.ui.updateStats(stats);
  }
}

document.addEventListener('DOMContentLoaded', () => {
  new TodoApp();
})
