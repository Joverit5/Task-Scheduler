'use client'

import { useState } from "react"
import { format } from "date-fns"
import { es } from "date-fns/locale"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet"
import { CalendarIcon, Plus, Trash2 } from 'lucide-react'

interface Task {
  id: string
  name: string
  deadline: Date
  benefit: number
}

export default function TaskScheduler() {
  const [tasks, setTasks] = useState<Task[]>([])
  const [newTask, setNewTask] = useState({
    name: '',
    deadline: new Date(),
    benefit: 0
  })
  const [scheduledTasks, setScheduledTasks] = useState<Task[]>([])
  const [isSheetOpen, setIsSheetOpen] = useState(false)

  const scheduleTasksGreedy = (taskList: Task[]): Task[] => {
    const sortedTasks = [...taskList].sort((a, b) => b.benefit - a.benefit)
    const timeline: boolean[] = new Array(31).fill(false)
    const scheduledTasks: Task[] = []
    
    let comparisons = 0
    
    for (const task of sortedTasks) {
      const deadline = task.deadline.getDate()
      let assigned = false
      
      for (let day = deadline - 1; day >= 0; day--) {
        comparisons++
        if (!timeline[day]) {
          timeline[day] = true
          scheduledTasks.push({...task, deadline: new Date(task.deadline.getFullYear(), task.deadline.getMonth(), day + 1)})
          assigned = true
          break
        }
      }
      
      if (!assigned) {
        console.log(`Could not schedule task: ${task.name}`)
      }
    }
    
    console.log(`Total comparisons made: ${comparisons}`)
    console.log(`Time complexity: O(n * m), where n is the number of tasks and m is the maximum deadline`)
    
    return scheduledTasks.sort((a, b) => a.deadline.getTime() - b.deadline.getTime())
  }

  const handleAddTask = () => {
    if (newTask.name && newTask.benefit > 0) {
      const task: Task = {
        id: Date.now().toString(),
        ...newTask,
      }
      setTasks([...tasks, task])
      setNewTask({ name: '', deadline: new Date(), benefit: 0 })
      setIsSheetOpen(false)
    }
  }

  const handleDeleteTask = (id: string) => {
    setTasks(tasks.filter(task => task.id !== id))
  }

  const handleScheduleTasks = () => {
    const schedule = scheduleTasksGreedy(tasks)
    setScheduledTasks(schedule)
  }

  const calculateTotalBenefit = () => {
    return scheduledTasks.reduce((sum, task) => sum + task.benefit, 0)
  }

  return (
    <div className="max-w-3xl mx-auto bg-white rounded-xl shadow-sm p-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-semibold mb-2">Today&apos;s Task</h1>
          <p className="text-gray-500">
            {format(new Date(), "EEEE, dd MMM", { locale: es })}
          </p>
        </div>
        <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
          <SheetTrigger asChild>
            <Button className="bg-blue-100 hover:bg-blue-200 text-blue-600">
              <Plus className="mr-2 h-4 w-4" />
              New Task
            </Button>
          </SheetTrigger>
          <SheetContent side="bottom" className="w-[90%] mx-auto rounded-t-xl">
            <SheetHeader>
              <SheetTitle>Add New Task</SheetTitle>
            </SheetHeader>
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="name">Task Name</Label>
                <Input
                  id="name"
                  value={newTask.name}
                  onChange={(e) => setNewTask({ ...newTask, name: e.target.value })}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="deadline">Deadline</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button variant="outline" className="w-full justify-start text-left font-normal">
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {newTask.deadline ? format(newTask.deadline, "PPP") : <span>Pick a date</span>}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <Calendar
                      mode="single"
                      selected={newTask.deadline}
                      onSelect={(date) => date && setNewTask({ ...newTask, deadline: date })}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="benefit">Benefit</Label>
                <Input
                  id="benefit"
                  type="number"
                  value={newTask.benefit || ''}
                  onChange={(e) => setNewTask({ ...newTask, benefit: parseInt(e.target.value) })}
                />
              </div>
            </div>
            <Button onClick={handleAddTask}>Add Task</Button>
          </SheetContent>
        </Sheet>
      </div>

      <div className="flex gap-4 mb-8 text-sm">
        <button className="text-blue-600 font-medium">
          Tasks <span className="ml-1 bg-blue-600 text-white px-2 py-0.5 rounded-full">{tasks.length}</span>
        </button>
      </div>

      <div className="space-y-4">
        {tasks.map((task) => (
          <Card key={task.id} className="border border-gray-100">
            <CardContent className="p-4">
              <div className="flex justify-between items-start mb-2">
                <div className="min-w-0 flex-1 mr-4">
                  <h3 className="text-lg mb-1 font-medium truncate">{task.name}</h3>
                  <p className="text-gray-500 truncate">Deadline: {format(task.deadline, "PPP")}</p>
                </div>
                <div className="flex items-center gap-2 flex-shrink-0">
                  <p className="text-green-600 font-semibold whitespace-nowrap">Benefit: {task.benefit}</p>
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    onClick={() => handleDeleteTask(task.id)}
                    className="hover:bg-red-100 hover:text-red-600 transition-colors"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {tasks.length > 0 && (
        <Button onClick={handleScheduleTasks} className="mt-6">
          Schedule Tasks
        </Button>
      )}

      {scheduledTasks.length > 0 && (
        <Card className="mt-6">
          <CardContent className="p-4">
            <h3 className="text-lg font-semibold mb-4">Scheduled Tasks</h3>
            <div className="space-y-2">
              {scheduledTasks.map((task, index) => (
                <div key={index} className="flex justify-between items-center">
                  <span className="min-w-[100px]">{format(task.deadline, "PPP")}</span>
                  <span className="flex-1 px-2 truncate">{task.name}</span>
                  <span className="min-w-[80px] text-right">Benefit: {task.benefit}</span>
                </div>
              ))}
            </div>
            <div className="mt-4 text-right">
              <p className="text-lg font-semibold">
                Total Benefit: {calculateTotalBenefit()}
              </p>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}