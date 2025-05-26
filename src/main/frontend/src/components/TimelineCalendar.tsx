import React, { useState } from 'react'
import { format, startOfMonth, endOfMonth, eachDayOfInterval, isSameDay, isToday, addMonths, subMonths } from 'date-fns'
import { pl } from 'date-fns/locale'
import { ChevronLeft, ChevronRight, Calendar } from 'lucide-react'
import { Button } from './ui/button'
import { Card, CardContent } from './ui/card'
import { Badge } from './ui/badge'
import { useTasks } from '../hooks/useTasks'
import { TaskCard } from './TaskCard'

export function TimelineCalendar() {
  const [currentDate, setCurrentDate] = useState(new Date())
  const { tasks, isLoading } = useTasks()

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  const monthStart = startOfMonth(currentDate)
  const monthEnd = endOfMonth(currentDate)
  const days = eachDayOfInterval({ start: monthStart, end: monthEnd })

  const getTasksForDate = (date: Date) => {
    return tasks.filter(task => 
      task.dueDate && isSameDay(new Date(task.dueDate), date)
    )
  }

  const monthlyTaskCount = tasks.filter(task => 
    task.dueDate && 
    new Date(task.dueDate) >= monthStart && 
    new Date(task.dueDate) <= monthEnd
  ).length

  const previousMonth = () => setCurrentDate(subMonths(currentDate, 1))
  const nextMonth = () => setCurrentDate(addMonths(currentDate, 1))
  const goToToday = () => setCurrentDate(new Date())

  return (
    <div className="space-y-6">
      {/* Calendar Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white">
            {format(currentDate, 'MMMM yyyy', { locale: pl })}
          </h2>
          <p className="text-gray-600 dark:text-gray-300 mt-1">
            Zadania w kalendarzu timeline • {monthlyTaskCount} zadań w tym miesiącu
          </p>
        </div>
        
        <div className="flex items-center space-x-2">
          <Button variant="outline" size="sm" onClick={goToToday}>
            <Calendar className="w-4 h-4 mr-2" />
            Dzisiaj
          </Button>
          <Button variant="outline" size="sm" onClick={previousMonth}>
            <ChevronLeft className="w-4 h-4" />
          </Button>
          <Button variant="outline" size="sm" onClick={nextMonth}>
            <ChevronRight className="w-4 h-4" />
          </Button>
        </div>
      </div>

      {/* Calendar Grid */}
      <Card>
        <CardContent className="p-6">
          {/* Days of week header */}
          <div className="grid grid-cols-7 gap-2 mb-4">
            {['Pon', 'Wt', 'Śr', 'Czw', 'Pt', 'Sob', 'Nie'].map((day, index) => (
              <div
                key={day}
                className={`text-center text-sm font-medium p-3 ${
                  index >= 5 ? 'text-gray-500 dark:text-gray-400' : 'text-gray-700 dark:text-gray-300'
                }`}
              >
                {day}
              </div>
            ))}
          </div>

          {/* Calendar days */}
          <div className="grid grid-cols-7 gap-2">
            {days.map((day) => {
              const dayTasks = getTasksForDate(day)
              const isCurrentDay = isToday(day)
              const isWeekend = day.getDay() === 0 || day.getDay() === 6

              return (
                <div
                  key={day.toISOString()}
                  className={`min-h-[120px] p-2 rounded-lg border transition-colors ${
                    isCurrentDay
                      ? 'bg-blue-50 border-blue-200 dark:bg-blue-900/20 dark:border-blue-700'
                      : isWeekend
                      ? 'bg-gray-50 border-gray-200 dark:bg-gray-800/50 dark:border-gray-700'
                      : 'bg-white border-gray-200 dark:bg-gray-800 dark:border-gray-700'
                  } hover:bg-gray-50 dark:hover:bg-gray-700/50`}
                >
                  {/* Day number */}
                  <div className={`text-sm font-medium mb-2 ${
                    isCurrentDay 
                      ? 'text-blue-600 dark:text-blue-400' 
                      : 'text-gray-900 dark:text-white'
                  }`}>
                    {format(day, 'd')}
                  </div>

                  {/* Tasks for this day */}
                  <div className="space-y-1">
                    {dayTasks.slice(0, 3).map((task) => (
                      <div
                        key={task.id}
                        className="text-xs p-1 rounded bg-blue-100 dark:bg-blue-900/50 text-blue-800 dark:text-blue-200 truncate"
                        title={task.title}
                      >
                        {task.title}
                        {task.priority && (
                          <Badge
                            variant={
                              task.priority === 'high' ? 'destructive' :
                              task.priority === 'medium' ? 'default' : 'secondary'
                            }
                            className="ml-1 text-xs"
                          >
                            {task.priority === 'high' ? 'W' : 
                             task.priority === 'medium' ? 'Ś' : 'N'}
                          </Badge>
                        )}
                      </div>
                    ))}
                    
                    {dayTasks.length > 3 && (
                      <div className="text-xs text-gray-500 dark:text-gray-400">
                        +{dayTasks.length - 3} więcej zadań
                      </div>
                    )}
                  </div>
                </div>
              )
            })}
          </div>
        </CardContent>
      </Card>

      {/* Monthly Summary */}
      <Card>
        <CardContent className="p-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            Podsumowanie miesięczne
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                {monthlyTaskCount}
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-300">
                Wszystkie zadania
              </div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600 dark:text-green-400">
                {tasks.filter(t => t.dueDate && new Date(t.dueDate) >= monthStart && new Date(t.dueDate) <= monthEnd && t.status === 'completed').length}
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-300">
                Ukończone
              </div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-orange-600 dark:text-orange-400">
                {tasks.filter(t => t.dueDate && new Date(t.dueDate) >= monthStart && new Date(t.dueDate) <= monthEnd && t.priority === 'high').length}
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-300">
                Wysoki priorytet
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}