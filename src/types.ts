export interface ITodo {
  id: number
  text: string
  completed: boolean
  createdAt: string
}

export type FilterType = 'all' | 'active' | 'completed'

export interface IStats {
  total: number
  active: number
  completed: number
}

export interface ITodoDOMElements {
  todoInput: HTMLInputElement
  addBtn: HTMLButtonElement
  todoList: HTMLUListElement
  emptyState: HTMLDivElement
  filters: NodeListOf<HTMLButtonElement>
  stats: {
    total: HTMLDivElement
    active: HTMLDivElement
    completed: HTMLDivElement
  }
}
