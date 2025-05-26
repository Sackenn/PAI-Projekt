import React, { useState } from 'react'
import { useDrag } from 'react-dnd'
import { Calendar, User, MessageSquare, Paperclip, CheckSquare, Users, Bell } from 'lucide-react'
import { format } from 'date-fns'
import { pl } from 'date-fns/locale'
import { Card, CardContent } from './ui/card'
import { Badge } from './ui/badge'
import { TaskModal } from './TaskModal'

interface TaskCardProps {
  task: {
    id: string
    listId: string
    title: string
    description?: string
    priority?: 'low' | 'medium' | 'high'
    dueDate?: string
    assignee?: string
    tags?: string[]
    status?: string
    comments?: number
    attachments?: number
    createdAt?: string
    members?: string[]
    checklist?: { id: string; text: string; completed: boolean }[]
    isWatching?: boolean
  }
}

export function TaskCard({ task }: TaskCardProps) {
  const [isModalOpen, setIsModalOpen] = useState(false)
  
  const [{ isDragging }, drag] = useDrag({
    type: 'TASK',
    item: { id: task.id, listId: task.listId },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  })

  const priorityColors = {
    low: 'bg-green-100 text-green-800 dark:bg-green-900/50 dark:text-green-300',
    medium: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/50 dark:text-yellow-300',
    high: 'bg-red-100 text-red-800 dark:bg-red-900/50 dark:text-red-300'
  }

  const priorityLabels = {
    low: 'Niski',
    medium: 'Średni', 
    high: 'Wysoki'
  }

  return (
    <>
      <Card 
        ref={drag}
        className={`cursor-pointer hover:shadow-md transition-shadow ${
          isDragging ? 'opacity-50' : ''
        }`}
        onClick={() => setIsModalOpen(true)}
      >
        <CardContent className="p-4">
          <div className="space-y-3">
            {/* Title */}
            <h4 className="font-medium text-gray-900 dark:text-white line-clamp-2">
              {task.title}
            </h4>
            
            {/* Tags */}
            {task.tags && task.tags.length > 0 && (
              <div className="flex flex-wrap gap-1">
                {task.tags.slice(0, 2).map((tag, index) => (
                  <Badge key={index} variant="secondary" className="text-xs">
                    {tag}
                  </Badge>
                ))}
                {task.tags.length > 2 && (
                  <Badge variant="outline" className="text-xs">
                    +{task.tags.length - 2}
                  </Badge>
                )}
              </div>
            )}
            
            {/* Members */}
            {task.members && task.members.length > 0 && (
              <div className="flex items-center space-x-1">
                <Users className="w-3 h-3 text-gray-500" />
                <div className="flex -space-x-1">
                  {task.members.slice(0, 3).map((member, index) => (
                    <div 
                      key={index}
                      className="w-5 h-5 bg-blue-500 rounded-full flex items-center justify-center text-white text-xs font-semibold border border-white"
                      title={member}
                    >
                      {member.charAt(0).toUpperCase()}
                    </div>
                  ))}
                  {task.members.length > 3 && (
                    <div className="w-5 h-5 bg-gray-400 rounded-full flex items-center justify-center text-white text-xs border border-white">
                      +{task.members.length - 3}
                    </div>
                  )}
                </div>
              </div>
            )}
            
            {/* Priority */}
            {task.priority && (
              <Badge className={`text-xs ${priorityColors[task.priority]}`}>
                {priorityLabels[task.priority]}
              </Badge>
            )}
            
            {/* Due date */}
            {task.dueDate && (
              <div className="flex items-center text-sm text-gray-600 dark:text-gray-300">
                <Calendar className="w-4 h-4 mr-1" />
                {format(new Date(task.dueDate), 'd MMM', { locale: pl })}
              </div>
            )}
            
            {/* Footer with stats and indicators */}
            <div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400">
              <div className="flex items-center space-x-2">
                {/* Checklist progress */}
                {task.checklist && task.checklist.length > 0 && (
                  <div className="flex items-center">
                    <CheckSquare className="w-3 h-3 mr-1" />
                    {task.checklist.filter(item => item.completed).length}/{task.checklist.length}
                  </div>
                )}
                
                {task.comments && task.comments > 0 && (
                  <div className="flex items-center">
                    <MessageSquare className="w-3 h-3 mr-1" />
                    {task.comments}
                  </div>
                )}
                {task.attachments && task.attachments > 0 && (
                  <div className="flex items-center">
                    <Paperclip className="w-3 h-3 mr-1" />
                    {task.attachments}
                  </div>
                )}
              </div>
              
              <div className="flex items-center space-x-1">
                {/* Watching indicator */}
                {task.isWatching && (
                  <Bell className="w-3 h-3 text-blue-500" title="Obserwujesz to zadanie" />
                )}
                
                {/* Assignee avatar */}
                {task.assignee && (
                  <div 
                    className="w-4 h-4 bg-green-500 rounded-full flex items-center justify-center text-white text-xs font-semibold"
                    title={task.assignee}
                  >
                    {task.assignee.charAt(0).toUpperCase()}
                  </div>
                )}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <TaskModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        task={task}
      />
    </>
  )
}