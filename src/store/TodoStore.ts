import type { FilterType, IStats, ITodo } from "../types";

export class TodoStore {
  private todos: ITodo[] = []
  private readonly STORAGE_KEY = 'todos'

  constructor() {
    this.todos = this.loadFromStorage();
  }

  getActiveTodos(): ITodo[] {
    return this.todos.filter(t => !t.completed)
  }

  getCompletedTodos(): ITodo[] {
    return this.todos.filter(t => t.completed)
  }

  loadFromStorage(): ITodo[] {
    try {
      const data = localStorage.getItem(this.STORAGE_KEY)
      return data ? JSON.parse(data) : []
    } catch (error) {
      console.log("Ошибка при загрузке todos:", error)
      return []
    }
  }

  saveToStorage(): void {
    try {
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(this.todos))
    } catch (error) {
      console.error("Ошибка при сохранении todos:", error)
    }
  }

  addTodo(text: string): ITodo {
    const todo: ITodo = {
      id: Date.now(),
      text: text.trim(),
      completed: false,
      createdAt: new Date().toISOString()
    }
    this.todos.push(todo)
    this.saveToStorage()
    return todo
  }

  deleteTodo(id: number): void {
    this.todos = this.todos.filter(todo => todo.id !== id)
    this.saveToStorage()
  }

  toggleTodo(id: number): void {
    const todo: ITodo | undefined = this.todos.find(t => t.id === id)
    if (todo) {
      todo.completed = !todo.completed
      this.saveToStorage()
    }
  }

  getTodos(filter: FilterType = "all") {
    switch (filter) {
      case 'active':
        return this.getActiveTodos();
      case 'completed':
        return this.getCompletedTodos();
      default:
        return this.todos;
    }
  }

  getStats(): IStats {
    return {
      total: this.todos.length,
      active: this.getActiveTodos().length,
      completed: this.getCompletedTodos().length
    }
  }
}


