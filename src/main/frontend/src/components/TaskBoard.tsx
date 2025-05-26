import React from 'react'
import { DndProvider } from 'react-dnd'
import { HTML5Backend } from 'react-dnd-html5-backend'
import { TaskList } from './TaskList'
import { useTasks } from '../hooks/useTasks'

export function TaskBoard() {
  const { lists, isLoading } = useTasks()

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  return (
    <DndProvider backend={HTML5Backend}>
      <div className="flex gap-6 overflow-x-auto pb-6">
        {lists.map((list) => (
          <TaskList key={list.id} list={list} />
        ))}
      </div>
    </DndProvider>
  )
}