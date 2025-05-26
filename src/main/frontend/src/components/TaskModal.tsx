import React, { useState } from 'react'
import { 
  X, 
  Calendar, 
  User, 
  Tag, 
  Bell, 
  BellOff, 
  Plus, 
  Trash2, 
  Check, 
  Clock,
  Users,
  Edit
} from 'lucide-react'
import { Button } from './ui/button'
import { Card, CardContent, CardHeader } from './ui/card'
import { Badge } from './ui/badge'
import { format } from 'date-fns'
import { pl } from 'date-fns/locale'
import { useTasks } from '../hooks/useTasks'

interface TaskModalProps {
  isOpen: boolean
  onClose: () => void
  task: {
    id: string
    title: string
    description?: string
    priority?: 'low' | 'medium' | 'high'
    dueDate?: string
    assignee?: string
    tags?: string[]
    status?: string
    createdAt?: string
    members?: string[]
    checklist?: { id: string; text: string; completed: boolean }[]
    isWatching?: boolean
  }
}

export function TaskModal({ isOpen, onClose, task }: TaskModalProps) {
  const { deleteTask, updateTask } = useTasks()
  const [isWatching, setIsWatching] = useState(task.isWatching || false)
  const [newChecklistItem, setNewChecklistItem] = useState('')
  const [checklist, setChecklist] = useState(task.checklist || [])
  
  if (!isOpen) return null

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

  const handleDeleteTask = () => {
    if (window.confirm('Czy na pewno chcesz usunąć to zadanie?')) {
      deleteTask(task.id)
      onClose()
    }
  }

  const toggleWatching = () => {
    setIsWatching(!isWatching)
    updateTask(task.id, { isWatching: !isWatching })
  }

  const addChecklistItem = () => {
    if (newChecklistItem.trim()) {
      const newItem = {
        id: Date.now().toString(),
        text: newChecklistItem.trim(),
        completed: false
      }
      const updatedChecklist = [...checklist, newItem]
      setChecklist(updatedChecklist)
      updateTask(task.id, { checklist: updatedChecklist })
      setNewChecklistItem('')
    }
  }

  const toggleChecklistItem = (itemId: string) => {
    const updatedChecklist = checklist.map(item =>
      item.id === itemId ? { ...item, completed: !item.completed } : item
    )
    setChecklist(updatedChecklist)
    updateTask(task.id, { checklist: updatedChecklist })
  }

  const removeChecklistItem = (itemId: string) => {
    const updatedChecklist = checklist.filter(item => item.id !== itemId)
    setChecklist(updatedChecklist)
    updateTask(task.id, { checklist: updatedChecklist })
  }

  const completedItems = checklist.filter(item => item.completed).length
  const totalItems = checklist.length

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <Card className="w-full max-w-4xl max-h-[90vh] overflow-auto">
        <CardHeader className="flex flex-row items-center justify-between border-b">
          <div className="flex-1">
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
              {task.title}
            </h3>
            <div className="flex items-center space-x-4 text-sm text-gray-600 dark:text-gray-300">
              {task.createdAt && (
                <div className="flex items-center">
                  <Clock className="w-4 h-4 mr-1" />
                  Utworzone {format(new Date(task.createdAt), 'd MMM yyyy', { locale: pl })}
                </div>
              )}
              <div className="flex items-center">
                <User className="w-4 h-4 mr-1" />
                w liście "{task.status}"
              </div>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <Button
              variant={isWatching ? "default" : "outline"}
              size="sm"
              onClick={toggleWatching}
              className="flex items-center space-x-1"
            >
              {isWatching ? <Bell className="w-4 h-4" /> : <BellOff className="w-4 h-4" />}
              <span>{isWatching ? 'Obserwujesz' : 'Obserwuj'}</span>
            </Button>
            <Button variant="ghost" size="sm" onClick={onClose}>
              <X className="w-4 h-4" />
            </Button>
          </div>
        </CardHeader>
        <CardContent className="space-y-6 p-6">
          {/* Members */}
          {task.members && task.members.length > 0 && (
            <div>
              <h4 className="font-medium mb-3 flex items-center">
                <Users className="w-4 h-4 mr-2" />
                Członkowie ({task.members.length})
              </h4>
              <div className="flex flex-wrap gap-2">
                {task.members.map((member, index) => (
                  <div key={index} className="flex items-center space-x-2 bg-gray-100 dark:bg-gray-700 rounded-full px-3 py-1">
                    <div className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center text-white text-xs font-semibold">
                      {member.charAt(0).toUpperCase()}
                    </div>
                    <span className="text-sm text-gray-700 dark:text-gray-300">{member}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Etykiety */}
          {task.tags && task.tags.length > 0 && (
            <div>
              <h4 className="font-medium mb-3 flex items-center">
                <Tag className="w-4 h-4 mr-2" />
                Etykiety
              </h4>
              <div className="flex flex-wrap gap-2">
                {task.tags.map((tag, index) => (
                  <Badge key={index} variant="secondary" className="text-xs">
                    {tag}
                  </Badge>
                ))}
              </div>
            </div>
          )}

          {/* Description */}
          {task.description && (
            <div>
              <h4 className="font-medium mb-3">Opis</h4>
              <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4">
                <p className="text-gray-700 dark:text-gray-300 whitespace-pre-wrap">
                  {task.description}
                </p>
              </div>
            </div>
          )}

          {/* Lista zadań (Checklist) */}
          <div>
            <h4 className="font-medium mb-3 flex items-center justify-between">
              Lista zadań
              {totalItems > 0 && (
                <span className="text-sm text-gray-500">
                  {completedItems}/{totalItems} ukończone
                </span>
              )}
            </h4>
            
            {/* Progress bar */}
            {totalItems > 0 && (
              <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2 mb-4">
                <div 
                  className="bg-green-600 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${(completedItems / totalItems) * 100}%` }}
                />
              </div>
            )}

            {/* Checklist items */}
            <div className="space-y-2 mb-4">
              {checklist.map((item) => (
                <div key={item.id} className="flex items-center space-x-3 group">
                  <button
                    onClick={() => toggleChecklistItem(item.id)}
                    className={`w-5 h-5 rounded border-2 flex items-center justify-center transition-colors ${
                      item.completed 
                        ? 'bg-green-600 border-green-600 text-white' 
                        : 'border-gray-300 hover:border-green-600'
                    }`}
                  >
                    {item.completed && <Check className="w-3 h-3" />}
                  </button>
                  <span className={`flex-1 ${
                    item.completed 
                      ? 'line-through text-gray-500 dark:text-gray-400' 
                      : 'text-gray-700 dark:text-gray-300'
                  }`}>
                    {item.text}
                  </span>
                  <button
                    onClick={() => removeChecklistItem(item.id)}
                    className="opacity-0 group-hover:opacity-100 p-1 text-red-500 hover:text-red-700 transition-opacity"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>

            {/* Add new checklist item */}
            <div className="flex space-x-2">
              <input
                type="text"
                value={newChecklistItem}
                onChange={(e) => setNewChecklistItem(e.target.value)}
                placeholder="Dodaj nowy element do listy..."
                className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md text-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                onKeyPress={(e) => e.key === 'Enter' && addChecklistItem()}
              />
              <Button size="sm" onClick={addChecklistItem}>
                <Plus className="w-4 h-4" />
              </Button>
            </div>
          </div>

          {/* Details Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Priority */}
            {task.priority && (
              <div>
                <h4 className="font-medium mb-2">Priorytet</h4>
                <Badge className={priorityColors[task.priority]}>
                  {priorityLabels[task.priority]}
                </Badge>
              </div>
            )}

            {/* Due Date */}
            {task.dueDate && (
              <div>
                <h4 className="font-medium mb-2 flex items-center">
                  <Calendar className="w-4 h-4 mr-2" />
                  Termin
                </h4>
                <p className="text-gray-700 dark:text-gray-300">
                  {format(new Date(task.dueDate), 'd MMMM yyyy', { locale: pl })}
                </p>
              </div>
            )}

            {/* Assignee */}
            {task.assignee && (
              <div>
                <h4 className="font-medium mb-2 flex items-center">
                  <User className="w-4 h-4 mr-2" />
                  Przypisane do
                </h4>
                <p className="text-gray-700 dark:text-gray-300">{task.assignee}</p>
              </div>
            )}

            {/* Created date */}
            {task.createdAt && (
              <div>
                <h4 className="font-medium mb-2">Data utworzenia</h4>
                <p className="text-gray-700 dark:text-gray-300">
                  {format(new Date(task.createdAt), 'd MMMM yyyy, HH:mm', { locale: pl })}
                </p>
              </div>
            )}
          </div>

          {/* Actions */}
          <div className="flex justify-between items-center pt-6 border-t">
            <Button 
              variant="destructive" 
              onClick={handleDeleteTask}
              className="flex items-center space-x-2"
            >
              <Trash2 className="w-4 h-4" />
              <span>Usuń zadanie</span>
            </Button>
            
            <div className="flex space-x-2">
              <Button variant="outline" onClick={onClose}>
                Zamknij
              </Button>
              <Button className="flex items-center space-x-2">
                <Edit className="w-4 h-4" />
                <span>Edytuj zadanie</span>
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}