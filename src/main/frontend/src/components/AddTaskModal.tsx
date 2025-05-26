import React, { useState } from 'react'
import { X } from 'lucide-react'
import { Button } from './ui/button'
import { Card, CardContent, CardHeader } from './ui/card'
import { useTasks } from '../hooks/useTasks'

interface AddTaskModalProps {
  isOpen: boolean
  onClose: () => void
  listId: string
}

export function AddTaskModal({ isOpen, onClose, listId }: AddTaskModalProps) {
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const { addTask } = useTasks()

  if (!isOpen) return null

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (title.trim()) {
      addTask(listId, { title: title.trim(), description: description.trim() })
      setTitle('')
      setDescription('')
      onClose()
    }
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <Card className="w-full max-w-md">
        <CardHeader className="flex flex-row items-center justify-between">
          <h3 className="text-lg font-semibold">Dodaj nowe zadanie</h3>
          <Button variant="ghost" size="sm" onClick={onClose}>
            <X className="w-4 h-4" />
          </Button>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">Tytuł</label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full p-2 border rounded-md"
                placeholder="Wprowadź tytuł zadania..."
                autoFocus
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Opis</label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full p-2 border rounded-md h-20"
                placeholder="Opisz zadanie..."
              />
            </div>
            <div className="flex justify-end space-x-2">
              <Button type="button" variant="outline" onClick={onClose}>
                Anuluj
              </Button>
              <Button type="submit">Dodaj zadanie</Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}