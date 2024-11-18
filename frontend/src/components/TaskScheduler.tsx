"use client"

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Button } from "./ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "./ui/card"
import { Input } from "./ui/input"
import { Label } from "./ui/label"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "./ui/table"
import { Loader2, Calendar as CalendarIcon } from "lucide-react"
import { Calendar } from "./ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover"
import { format } from "date-fns"
import { cn } from "../lib/utils"
import { toast } from "sonner"

interface Task {
  name: string;
  deadline: Date;
  profit: number;
}

export default function TaskScheduler() {
  const [tasks, setTasks] = useState<Task[]>([])
  const [name, setName] = useState('')
  const [deadline, setDeadline] = useState<Date | undefined>(undefined)
  const [profit, setProfit] = useState('')
  const [scheduledTasks, setScheduledTasks] = useState<Task[]>([])
  const [totalProfit, setTotalProfit] = useState(0)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const today = new Date()
  today.setHours(0, 0, 0, 0)

  const addTask = () => {
    if (name && deadline && profit) {
      setTasks([...tasks, { name, deadline, profit: parseInt(profit) }])
      setName('')
      setDeadline(undefined)
      setProfit('')
    }
  }

  const scheduleTasks = async () => {
    setLoading(true)
    setError(null)
    try {
      const response = await fetch('http://localhost:5000/schedule_tasks', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          tasks: tasks.map(task => ({
            name: task.name,
            deadline: format(task.deadline, 'yyyy-MM-dd'),
            profit: task.profit
          }))
        }),
      })

      if (!response.ok) {
        throw new Error(`Error del servidor: ${response.status}`)
      }

      const data = await response.json()
      
      if (!data.scheduled_tasks || !Array.isArray(data.scheduled_tasks)) {
        throw new Error('Formato de respuesta inválido del servidor')
      }

      setScheduledTasks(data.scheduled_tasks.map((task: any) => ({
        name: task.name,
        deadline: new Date(task.deadline),
        profit: task.profit
      })))
      setTotalProfit(data.total_profit)
      toast.success('Tareas planificadas exitosamente')
    } catch (error) {
      console.error('Error al conectar con el servidor:', error)
      setError(
        error instanceof Error
          ? error.message
          : 'Error al conectar con el servidor. Por favor, verifica que el servidor esté ejecutándose en http://localhost:5000'
      )
      toast.error('Error al planificar las tareas')
    }
    setLoading(false)
  }

  return (
    <Card className="w-[600px]">
      <CardHeader>
        <CardTitle className="text-3xl font-bold">Planificador de Tareas</CardTitle>
        <CardDescription>Maximiza las ganancias programando tareas dentro de sus fechas límite</CardDescription>
      </CardHeader>
      <CardContent>
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="grid w-full items-center gap-4"
        >
          <div className="flex flex-col space-y-1.5">
            <Label htmlFor="name">Nombre de la tarea</Label>
            <Input id="name" value={name} onChange={(e) => setName(e.target.value)} />
          </div>
          <div className="flex flex-col space-y-1.5">
            <Label htmlFor="deadline">Fecha límite</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  id="deadline"
                  variant={"outline"}
                  className={cn(
                    "w-full justify-start text-left font-normal",
                    !deadline && "text-muted-foreground"
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {deadline ? format(deadline, "PPP") : <span>Selecciona una fecha</span>}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0">
                <Calendar
                  mode="single"
                  selected={deadline}
                  onSelect={setDeadline}
                  initialFocus
                  fromDate={today}
                />
              </PopoverContent>
            </Popover>
          </div>
          <div className="flex flex-col space-y-1.5">
            <Label htmlFor="profit">Ganancia</Label>
            <Input id="profit" type="number" min="0" value={profit} onChange={(e) => setProfit(e.target.value)} />
          </div>
          <Button 
            onClick={addTask}
            className="transition-all duration-200 hover:scale-105"
          >
            Agregar Tarea
          </Button>
        </motion.div>

        {error && (
          <div className="mt-4 p-4 bg-destructive/10 text-destructive rounded-md">
            {error}
          </div>
        )}

        <AnimatePresence>
          {tasks.length > 0 && (
            <motion.div 
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.5 }}
              className="mt-4 overflow-hidden"
            >
              <h3 className="text-lg font-semibold">Tareas Agregadas:</h3>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Nombre</TableHead>
                    <TableHead>Fecha límite</TableHead>
                    <TableHead>Ganancia</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {tasks.map((task, index) => (
                    <TableRow key={index}>
                      <TableCell>{task.name}</TableCell>
                      <TableCell>{format(task.deadline, "PPP")}</TableCell>
                      <TableCell>${task.profit}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </motion.div>
          )}
        </AnimatePresence>
      </CardContent>
      <CardFooter className="flex flex-col items-start">
        <Button 
          onClick={scheduleTasks} 
          disabled={loading || tasks.length === 0}
          className="transition-all duration-200 hover:scale-105"
        >
          {loading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Planificando...
            </>
          ) : (
            'Planificar Tareas'
          )}
        </Button>
        <AnimatePresence>
          {scheduledTasks.length > 0 && (
            <motion.div 
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.5 }}
              className="mt-4 w-full overflow-hidden"
            >
              <h3 className="text-lg font-semibold">Tareas Planificadas:</h3>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Nombre</TableHead>
                    <TableHead>Fecha límite</TableHead>
                    <TableHead>Ganancia</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {scheduledTasks.map((task, index) => (
                    <TableRow key={index}>
                      <TableCell>{task.name}</TableCell>
                      <TableCell>{format(task.deadline, "PPP")}</TableCell>
                      <TableCell>${task.profit}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
              <motion.p 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.3 }}
                className="mt-4 font-semibold text-2xl"
              >
                Ganancia Total: ${totalProfit}
              </motion.p>
            </motion.div>
          )}
        </AnimatePresence>
      </CardFooter>
      <div className="text-center text-sm text-gray-500 mt-8">
        <p>Universidad Tecnológica de Bolivar - Proyecto realizado por:</p>
        <p>José Fernando González Ortiz</p>
        <p>Isabella Sofía Arrieta Guardo</p>
        <p>Daniel David Herrera Acevedo</p>
      </div>
    </Card>
  )
}