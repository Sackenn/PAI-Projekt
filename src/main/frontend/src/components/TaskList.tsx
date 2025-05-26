import React, { useState } from 'react'
import { Plus, MoreVertical } from 'lucide-react'
import { useDrop } from 'react-dnd'
import { Button } from './ui/button'
import { Card, CardContent, CardHeader } from './ui/card'
import { TaskCard } from './TaskCard'
import { AddTaskModal } from './AddTaskModal'
import { useTasks } from '../hooks/useTasks'

interface TaskListProps {
  list: {
    id: string
    title: string
    color: string
  }
}

export function TaskList({ list }: TaskListProps) {
  const [isAddModalOpen, setIsAddModalOpen] = useState(false)
  const { tasks, moveTask } = useTasks()

  const listTasks = tasks.filter(task => task.listId === list.id)

  const [{ isOver }, drop] = useDrop({
    accept: 'TASK',
    drop: (item: { id: string; listId: string }) => {
      if (item.listId !== list.id) {
        moveTask(item.id, list.id)
      }
    },
    collect: (monitor) => ({
      isOver: monitor.isOver(),
    }),
  })

  return (
    <Card 
      ref={drop}
      className={`w-80 min-h-[400px] ${isOver ? 'bg-blue-50 dark:bg-blue-900/20' : ''}`}
    >
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div 
              className="w-3 h-3 rounded-full"
              style={{ backgroundColor: list.color }}
            />
            <h3 className="font-semibold text-gray-900 dark:text-white">
              {list.title}
            </h3>
            <span className="text-sm text-gray-500 bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded-full">
              {listTasks.length}
            </span>
          </div>
          <Button variant="ghost" size="sm">
            <MoreVertical className="w-4 h-4" />
          </Button>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-3">
        {listTasks.map((task) => (
          <TaskCard key={task.id} task={task} />
        ))}
        
        <Button
          variant="ghost"
          className="w-full justify-start text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
          onClick={() => setIsAddModalOpen(true)}
        >
          <Plus className="w-4 h-4 mr-2" />
          Dodaj kartę
        </Button>
      </CardContent>

      <AddTaskModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        listId={list.id}
      />
    </Card>
  )
}