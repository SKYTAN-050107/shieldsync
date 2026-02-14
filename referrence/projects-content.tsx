"use client"

import React, { useMemo, useState } from "react"
import {
  CheckSquare,
  Users,
  BarChart3,
  ArrowRight,
  Circle,
  Clock,
  CheckCircle2,
  ArrowUpCircle,
  ArrowRightCircle,
  ArrowDownCircle,
  Calendar,
  User2,
  Mail,
  Building2,
  AlertTriangle,
  TrendingUp,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Progress } from "@/components/ui/progress"
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart"
import {
  Bar,
  BarChart,
  XAxis,
  YAxis,
  CartesianGrid,
  ResponsiveContainer,
} from "recharts"
import { TasksList } from "@/components/tasks-list"
import { ContactsList } from "@/components/contacts-list"
import { AnalyticsContent } from "@/components/analytics-content"
import { MockDataBanner, EmptyUserBanner } from "@/components/mock-data-banner"

// Types
type Task = {
  id: string
  title: string
  description: string | null
  status: string
  priority: string
  due_date: string | null
  contact_id: string | null
  contacts: { first_name: string; last_name: string | null } | null
  created_at: string
}

type Contact = {
  id: string
  first_name: string
  last_name: string | null
  email: string | null
  phone: string | null
  company: string | null
  role: string | null
  status: string
  notes: string | null
  created_at: string
}

type ContactOption = { id: string; name: string }

type AnalyticsContact = {
  id: string
  first_name: string
  last_name: string | null
  email: string | null
  company: string | null
  status: string
  created_at: string
}

type AnalyticsTask = {
  id: string
  title: string
  status: string
  priority: string
  due_date: string | null
  contact_id: string | null
  created_at: string
}

interface ProjectsContentProps {
  tasks: Task[]
  contacts: Contact[]
  contactOptions: ContactOption[]
  analyticsContacts: AnalyticsContact[]
  analyticsTasks: AnalyticsTask[]
  isGuest?: boolean
  showingMockData?: boolean
}

// Helpers
const statusIcons: Record<string, React.ReactNode> = {
  todo: <Circle className="h-4 w-4 text-muted-foreground" />,
  in_progress: <Clock className="h-4 w-4 text-primary" />,
  done: <CheckCircle2 className="h-4 w-4 text-success" />,
}

const statusLabels: Record<string, string> = {
  todo: "To Do",
  in_progress: "In Progress",
  done: "Done",
}

const priorityConfig: Record<string, { icon: React.ReactNode; class: string }> = {
  low: {
    icon: <ArrowDownCircle className="h-3.5 w-3.5" />,
    class: "bg-muted text-muted-foreground border-border",
  },
  medium: {
    icon: <ArrowRightCircle className="h-3.5 w-3.5" />,
    class: "bg-warning/15 text-warning border-warning/30",
  },
  high: {
    icon: <ArrowUpCircle className="h-3.5 w-3.5" />,
    class: "bg-destructive/15 text-destructive border-destructive/30",
  },
}

const contactStatusColors: Record<string, string> = {
  lead: "bg-chart-3/15 text-chart-3 border-chart-3/30",
  active: "bg-success/15 text-success border-success/30",
  inactive: "bg-muted text-muted-foreground border-border",
}

const COLORS = {
  primary: "hsl(215, 80%, 48%)",
  success: "hsl(142, 71%, 45%)",
  warning: "hsl(38, 92%, 50%)",
  destructive: "hsl(0, 72%, 51%)",
  muted: "hsl(220, 10%, 46%)",
}

export function ProjectsContent({
  tasks,
  contacts,
  contactOptions,
  analyticsContacts,
  analyticsTasks,
  isGuest = false,
  showingMockData = false,
}: ProjectsContentProps) {
  const [tab, setTab] = useState("home")

  // Stats
  const totalTasks = tasks.length
  const completedTasks = tasks.filter((t) => t.status === "done").length
  const inProgressTasks = tasks.filter((t) => t.status === "in_progress").length
  const todoTasks = tasks.filter((t) => t.status === "todo").length
  const completionRate = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0
  const totalContacts = contacts.length
  const activeContacts = contacts.filter((c) => c.status === "active").length
  const leadContacts = contacts.filter((c) => c.status === "lead").length

  const overdueTasks = useMemo(() => {
    const now = new Date()
    return tasks.filter(
      (t) => t.due_date && new Date(t.due_date) < now && t.status !== "done"
    )
  }, [tasks])

  // Task flow chart data (last 6 months)
  const taskFlowData = useMemo(() => {
    const now = new Date()
    const months: { month: string; created: number; completed: number }[] = []
    for (let i = 5; i >= 0; i--) {
      const d = new Date(now.getFullYear(), now.getMonth() - i, 1)
      const label = d.toLocaleString("default", { month: "short" })
      const created = tasks.filter((t) => {
        const cr = new Date(t.created_at)
        return cr.getMonth() === d.getMonth() && cr.getFullYear() === d.getFullYear()
      }).length
      const completed = tasks.filter((t) => {
        if (t.status !== "done") return false
        const cr = new Date(t.created_at)
        return cr.getMonth() === d.getMonth() && cr.getFullYear() === d.getFullYear()
      }).length
      months.push({ month: label, created, completed })
    }
    return months
  }, [tasks])

  // Recent tasks (5)
  const recentTasks = tasks.slice(0, 5)

  // Recent contacts (5)
  const recentContacts = contacts.slice(0, 5)

  function formatDate(dateStr: string) {
    return new Date(dateStr).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
    })
  }

  function getInitials(firstName: string, lastName: string | null) {
    return `${firstName[0]}${lastName?.[0] ?? ""}`.toUpperCase()
  }

  function getFullName(firstName: string, lastName: string | null) {
    return lastName ? `${firstName} ${lastName}` : firstName
  }

  return (
    <div className="flex flex-col gap-6">
      {isGuest && <MockDataBanner dataType="project data" />}
      {showingMockData && (
        <EmptyUserBanner dataType="project data" actionLabel="Seed demo data to get started" />
      )}

      {/* Page header */}
      <div>
        <h1 className="text-2xl font-semibold tracking-tight text-foreground">Projects</h1>
        <p className="text-sm text-muted-foreground">
          Manage tasks, contacts, and analytics in one place
        </p>
      </div>

      {/* Tabs */}
      <Tabs value={tab} onValueChange={setTab}>
        <TabsList>
          <TabsTrigger value="home">Home</TabsTrigger>
          <TabsTrigger value="tasks">Tasks</TabsTrigger>
          <TabsTrigger value="contacts">Contacts</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
        </TabsList>

        {/* ── HOME TAB ── */}
        <TabsContent value="home" className="mt-6">
          <div className="flex flex-col gap-6">
            {/* Stat cards */}
            <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
              <Card>
                <CardContent className="flex items-center gap-4 p-5">
                  <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-primary/10">
                    <CheckSquare className="h-5 w-5 text-primary" />
                  </div>
                  <div className="min-w-0">
                    <p className="text-xs text-muted-foreground">Tasks</p>
                    <p className="text-2xl font-bold text-foreground">{totalTasks}</p>
                    <p className="text-xs text-muted-foreground">
                      {completedTasks} done, {inProgressTasks} active
                    </p>
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="flex items-center gap-4 p-5">
                  <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-primary/10">
                    <Users className="h-5 w-5 text-primary" />
                  </div>
                  <div className="min-w-0">
                    <p className="text-xs text-muted-foreground">Contacts</p>
                    <p className="text-2xl font-bold text-foreground">{totalContacts}</p>
                    <p className="text-xs text-muted-foreground">
                      {activeContacts} active, {leadContacts} leads
                    </p>
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="flex items-center gap-4 p-5">
                  <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-success/10">
                    <TrendingUp className="h-5 w-5 text-success" />
                  </div>
                  <div className="min-w-0">
                    <p className="text-xs text-muted-foreground">Completion</p>
                    <p className="text-2xl font-bold text-foreground">{completionRate}%</p>
                    <Progress value={completionRate} className="mt-1 h-1.5" />
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="flex items-center gap-4 p-5">
                  <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-destructive/10">
                    <AlertTriangle className="h-5 w-5 text-destructive" />
                  </div>
                  <div className="min-w-0">
                    <p className="text-xs text-muted-foreground">Overdue</p>
                    <p className="text-2xl font-bold text-foreground">{overdueTasks.length}</p>
                    <p className="text-xs text-muted-foreground">
                      {todoTasks} still to do
                    </p>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Task flow chart */}
            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <div>
                  <CardTitle className="text-base">Task Flow</CardTitle>
                  <CardDescription>Created vs completed (6 months)</CardDescription>
                </div>
                <Button variant="ghost" size="sm" onClick={() => setTab("analytics")}>
                  View all <ArrowRight className="ml-1 h-4 w-4" />
                </Button>
              </CardHeader>
              <CardContent>
                <ChartContainer
                  config={{
                    created: { label: "Created", color: "hsl(var(--chart-1))" },
                    completed: { label: "Completed", color: "hsl(var(--chart-2))" },
                  }}
                  className="h-[220px]"
                >
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={taskFlowData} margin={{ top: 5, right: 20, left: 0, bottom: 5 }}>
                      <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
                      <XAxis dataKey="month" className="text-xs" tick={{ fill: COLORS.muted }} />
                      <YAxis className="text-xs" tick={{ fill: COLORS.muted }} allowDecimals={false} />
                      <ChartTooltip content={<ChartTooltipContent />} />
                      <Bar dataKey="created" fill={COLORS.primary} radius={[4, 4, 0, 0]} name="Created" />
                      <Bar dataKey="completed" fill={COLORS.success} radius={[4, 4, 0, 0]} name="Completed" />
                    </BarChart>
                  </ResponsiveContainer>
                </ChartContainer>
              </CardContent>
            </Card>

            {/* Recent tasks */}
            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <div>
                  <CardTitle className="text-base">Recent Tasks</CardTitle>
                  <CardDescription>{totalTasks} total tasks</CardDescription>
                </div>
                <Button variant="ghost" size="sm" onClick={() => setTab("tasks")}>
                  View all <ArrowRight className="ml-1 h-4 w-4" />
                </Button>
              </CardHeader>
              <CardContent>
                {recentTasks.length === 0 ? (
                  <p className="py-6 text-center text-sm text-muted-foreground">
                    No tasks yet
                  </p>
                ) : (
                  <div className="flex flex-col gap-2">
                    {recentTasks.map((task) => (
                      <div
                        key={task.id}
                        className="flex items-center gap-3 rounded-lg border border-border p-3"
                      >
                        {statusIcons[task.status] ?? statusIcons.todo}
                        <div className="min-w-0 flex-1">
                          <p
                            className={`text-sm font-medium truncate ${
                              task.status === "done"
                                ? "line-through text-muted-foreground"
                                : "text-foreground"
                            }`}
                          >
                            {task.title}
                          </p>
                          <div className="flex items-center gap-2 text-xs text-muted-foreground">
                            {task.due_date && (
                              <span className="flex items-center gap-1">
                                <Calendar className="h-3 w-3" />
                                {formatDate(task.due_date)}
                              </span>
                            )}
                            {task.contacts?.first_name && (
                              <span className="flex items-center gap-1 truncate">
                                <User2 className="h-3 w-3" />
                                {task.contacts.first_name}
                              </span>
                            )}
                          </div>
                        </div>
                        <Badge
                          variant="outline"
                          className={`shrink-0 capitalize text-xs ${
                            priorityConfig[task.priority]?.class ?? ""
                          }`}
                        >
                          {priorityConfig[task.priority]?.icon}
                          <span className="ml-1">{task.priority}</span>
                        </Badge>
                        <Badge variant="secondary" className="shrink-0 capitalize text-xs">
                          {statusLabels[task.status] ?? task.status}
                        </Badge>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Recent contacts */}
            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <div>
                  <CardTitle className="text-base">Recent Contacts</CardTitle>
                  <CardDescription>{totalContacts} total contacts</CardDescription>
                </div>
                <Button variant="ghost" size="sm" onClick={() => setTab("contacts")}>
                  View all <ArrowRight className="ml-1 h-4 w-4" />
                </Button>
              </CardHeader>
              <CardContent>
                {recentContacts.length === 0 ? (
                  <p className="py-6 text-center text-sm text-muted-foreground">
                    No contacts yet
                  </p>
                ) : (
                  <div className="flex flex-col gap-2">
                    {recentContacts.map((contact) => (
                      <div
                        key={contact.id}
                        className="flex items-center gap-3 rounded-lg border border-border p-3"
                      >
                        <Avatar className="h-9 w-9 shrink-0">
                          <AvatarFallback className="bg-primary/10 text-primary text-xs font-medium">
                            {getInitials(contact.first_name, contact.last_name)}
                          </AvatarFallback>
                        </Avatar>
                        <div className="min-w-0 flex-1">
                          <p className="text-sm font-medium text-foreground truncate">
                            {getFullName(contact.first_name, contact.last_name)}
                          </p>
                          <div className="flex items-center gap-2 text-xs text-muted-foreground">
                            {contact.email && (
                              <span className="flex items-center gap-1 truncate">
                                <Mail className="h-3 w-3" />
                                <span className="truncate">{contact.email}</span>
                              </span>
                            )}
                            {contact.company && (
                              <span className="flex items-center gap-1 truncate">
                                <Building2 className="h-3 w-3" />
                                <span className="truncate">{contact.company}</span>
                              </span>
                            )}
                          </div>
                        </div>
                        <Badge
                          variant="outline"
                          className={`shrink-0 capitalize text-xs ${
                            contactStatusColors[contact.status] ?? ""
                          }`}
                        >
                          {contact.status}
                        </Badge>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* ── TASKS TAB ── */}
        <TabsContent value="tasks" className="mt-6">
          <TasksList
            initialTasks={tasks}
            contacts={contactOptions}
            isGuest={isGuest}
            showingMockData={showingMockData}
            hideHeader
          />
        </TabsContent>

        {/* ── CONTACTS TAB ── */}
        <TabsContent value="contacts" className="mt-6">
          <ContactsList
            initialContacts={contacts}
            isGuest={isGuest}
            showingMockData={showingMockData}
            hideHeader
          />
        </TabsContent>

        {/* ── ANALYTICS TAB ── */}
        <TabsContent value="analytics" className="mt-6">
          <AnalyticsContent
            contacts={analyticsContacts}
            tasks={analyticsTasks}
            isGuest={isGuest}
            showingMockData={showingMockData}
            hideHeader
          />
        </TabsContent>
      </Tabs>
    </div>
  )
}
