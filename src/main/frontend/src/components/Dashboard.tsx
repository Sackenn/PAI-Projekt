import React from 'react'
import { Card, CardContent, CardHeader, CardTitle } from './ui/card'
import { Badge } from './ui/badge'
import { 
  BarChart3, 
  Calendar, 
  Users, 
  Tag, 
  TrendingUp,
  Clock,
  CheckCircle,
  AlertCircle
} from 'lucide-react'
import { useTasks } from '../hooks/useTasks'
import { format } from 'date-fns'
import { pl } from 'date-fns/locale'

export function Dashboard() {
  const { lists, tasks } = useTasks()

  // Statystyki kart na listę
  const cardsPerList = lists.map(list => ({
    name: list.title,
    count: tasks.filter(task => task.listId === list.id).length,
    color: list.color
  }))

  // Statystyki kart na termin (grupowanie po tygodniach)
  const cardsPerDeadline = tasks
    .filter(task => task.dueDate)
    .reduce((acc, task) => {
      const week = format(new Date(task.dueDate!), 'wo \'tydzień\' yyyy', { locale: pl })
      acc[week] = (acc[week] || 0) + 1
      return acc
    }, {} as Record<string, number>)

  // Statystyki kart na członka
  const cardsPerMember = tasks
    .filter(task => task.assignee)
    .reduce((acc, task) => {
      acc[task.assignee!] = (acc[task.assignee!] || 0) + 1
      return acc
    }, {} as Record<string, number>)

  // Statystyki kart na etykietę
  const cardsPerTag = tasks
    .flatMap(task => task.tags || [])
    .reduce((acc, tag) => {
      acc[tag] = (acc[tag] || 0) + 1
      return acc
    }, {} as Record<string, number>)

  // Statystyki priorytetów
  const priorityStats = tasks.reduce((acc, task) => {
    if (task.priority) {
      acc[task.priority] = (acc[task.priority] || 0) + 1
    }
    return acc
  }, {} as Record<string, number>)

  const priorityLabels = {
    low: 'Niski',
    medium: 'Średni',
    high: 'Wysoki'
  }

  const priorityColors = {
    low: 'bg-green-100 text-green-800 dark:bg-green-900/50 dark:text-green-300',
    medium: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/50 dark:text-yellow-300',
    high: 'bg-red-100 text-red-800 dark:bg-red-900/50 dark:text-red-300'
  }

  // Ogólne statystyki
  const completedTasks = tasks.filter(task => task.status === 'completed').length
  const overdueTasks = tasks.filter(task => 
    task.dueDate && new Date(task.dueDate) < new Date() && task.status !== 'completed'
  ).length

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white">
            Dashboard Analytics
          </h2>
          <p className="text-gray-600 dark:text-gray-300 mt-1">
            Przegląd statystyk i analityki Twoich zadań
          </p>
        </div>
      </div>

      {/* Ogólne statystyki */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-300">
                  Wszystkie zadania
                </p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                  {tasks.length}
                </p>
              </div>
              <BarChart3 className="w-8 h-8 text-blue-600 dark:text-blue-400" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-300">
                  Ukończone
                </p>
                <p className="text-2xl font-bold text-green-600 dark:text-green-400">
                  {completedTasks}
                </p>
              </div>
              <CheckCircle className="w-8 h-8 text-green-600 dark:text-green-400" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-300">
                  Przeterminowane
                </p>
                <p className="text-2xl font-bold text-red-600 dark:text-red-400">
                  {overdueTasks}
                </p>
              </div>
              <AlertCircle className="w-8 h-8 text-red-600 dark:text-red-400" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-300">
                  Wskaźnik ukończenia
                </p>
                <p className="text-2xl font-bold text-purple-600 dark:text-purple-400">
                  {tasks.length > 0 ? Math.round((completedTasks / tasks.length) * 100) : 0}%
                </p>
              </div>
              <TrendingUp className="w-8 h-8 text-purple-600 dark:text-purple-400" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Szczegółowe statystyki */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Karty na listę */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <BarChart3 className="w-5 h-5" />
              <span>Liczba kart na listę</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {cardsPerList.map((list, index) => (
                <div key={index} className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div 
                      className="w-3 h-3 rounded-full"
                      style={{ backgroundColor: list.color }}
                    />
                    <span className="font-medium text-gray-900 dark:text-white">
                      {list.name}
                    </span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="w-24 bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                      <div 
                        className="h-2 rounded-full"
                        style={{ 
                          width: `${(list.count / Math.max(...cardsPerList.map(l => l.count))) * 100}%`,
                          backgroundColor: list.color 
                        }}
                      />
                    </div>
                    <span className="text-sm font-bold min-w-[2rem] text-right">
                      {list.count}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Karty na termin */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Calendar className="w-5 h-5" />
              <span>Liczba kart na termin</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {Object.entries(cardsPerDeadline)
                .slice(0, 5)
                .map(([week, count], index) => (
                <div key={index} className="flex items-center justify-between">
                  <span className="font-medium text-gray-900 dark:text-white text-sm">
                    {week}
                  </span>
                  <div className="flex items-center space-x-2">
                    <div className="w-24 bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                      <div 
                        className="bg-blue-600 h-2 rounded-full"
                        style={{ 
                          width: `${(count / Math.max(...Object.values(cardsPerDeadline))) * 100}%`
                        }}
                      />
                    </div>
                    <span className="text-sm font-bold min-w-[2rem] text-right">
                      {count}
                    </span>
                  </div>
                </div>
              ))}
              {Object.keys(cardsPerDeadline).length === 0 && (
                <p className="text-gray-500 dark:text-gray-400 text-sm">
                  Brak zadań z terminami
                </p>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Karty na członka */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Users className="w-5 h-5" />
              <span>Liczba kart na członka</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {Object.entries(cardsPerMember)
                .sort(([,a], [,b]) => b - a)
                .map(([member, count], index) => (
                <div key={index} className="flex items-center justify-between">
                  <span className="font-medium text-gray-900 dark:text-white">
                    {member}
                  </span>
                  <div className="flex items-center space-x-2">
                    <div className="w-24 bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                      <div 
                        className="bg-green-600 h-2 rounded-full"
                        style={{ 
                          width: `${(count / Math.max(...Object.values(cardsPerMember))) * 100}%`
                        }}
                      />
                    </div>
                    <span className="text-sm font-bold min-w-[2rem] text-right">
                      {count}
                    </span>
                  </div>
                </div>
              ))}
              {Object.keys(cardsPerMember).length === 0 && (
                <p className="text-gray-500 dark:text-gray-400 text-sm">
                  Brak przypisanych zadań
                </p>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Karty na etykietę */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Tag className="w-5 h-5" />
              <span>Liczba kart na etykietę</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {Object.entries(cardsPerTag)
                .sort(([,a], [,b]) => b - a)
                .slice(0, 8)
                .map(([tag, count], index) => (
                <div key={index} className="flex items-center justify-between">
                  <Badge variant="secondary" className="text-xs">
                    {tag}
                  </Badge>
                  <div className="flex items-center space-x-2">
                    <div className="w-24 bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                      <div 
                        className="bg-purple-600 h-2 rounded-full"
                        style={{ 
                          width: `${(count / Math.max(...Object.values(cardsPerTag))) * 100}%`
                        }}
                      />
                    </div>
                    <span className="text-sm font-bold min-w-[2rem] text-right">
                      {count}
                    </span>
                  </div>
                </div>
              ))}
              {Object.keys(cardsPerTag).length === 0 && (
                <p className="text-gray-500 dark:text-gray-400 text-sm">
                  Brak etykiet w zadaniach
                </p>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Statystyki priorytetów */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <AlertCircle className="w-5 h-5" />
            <span>Rozkład priorytetów zadań</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {Object.entries(priorityStats).map(([priority, count]) => (
              <div key={priority} className="text-center">
                <Badge className={`${priorityColors[priority as keyof typeof priorityColors]} mb-2`}>
                  {priorityLabels[priority as keyof typeof priorityLabels]}
                </Badge>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                  {count}
                </p>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  {tasks.length > 0 ? Math.round((count / tasks.length) * 100) : 0}% wszystkich zadań
                </p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}