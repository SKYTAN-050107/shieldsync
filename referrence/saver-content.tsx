"use client"

import React from "react"

import { useState, useTransition } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import {
  Save,
  Loader2,
  CheckCircle2,
  User,
  ListTodo,
  FileText,
  Link2,
  Lightbulb,
  Calendar,
  FolderOpen,
  BookOpen,
  Inbox,
  Sparkles,
  Clock,
  X,
  Tag,
} from "lucide-react"
import { saveItem } from "@/app/(app)/saver/actions"
import { toast } from "sonner"
import { useRouter } from "next/navigation"
import { useAuthGate } from "@/components/auth-gate"
import { MockDataBanner, EmptyUserBanner } from "@/components/mock-data-banner"

type SavedItem = {
  id: string
  title: string
  summary: string | null
  category: string
  tags: string[]
  metadata: Record<string, unknown>
  created_at: string
}

type SaveResult = {
  id: string
  title: string
  summary: string
  category: string
  tags: string[]
  metadata: Record<string, unknown>
}

const categoryConfig: Record<string, { icon: React.ElementType; label: string; color: string }> = {
  person: { icon: User, label: "Person", color: "bg-blue-100 text-blue-700" },
  task: { icon: ListTodo, label: "Task", color: "bg-amber-100 text-amber-700" },
  note: { icon: FileText, label: "Note", color: "bg-emerald-100 text-emerald-700" },
  link: { icon: Link2, label: "Link", color: "bg-indigo-100 text-indigo-700" },
  idea: { icon: Lightbulb, label: "Idea", color: "bg-yellow-100 text-yellow-700" },
  meeting: { icon: Calendar, label: "Meeting", color: "bg-rose-100 text-rose-700" },
  project: { icon: FolderOpen, label: "Project", color: "bg-teal-100 text-teal-700" },
  reference: { icon: BookOpen, label: "Reference", color: "bg-purple-100 text-purple-700" },
  general: { icon: Inbox, label: "General", color: "bg-gray-100 text-gray-700" },
}

interface SaverContentProps {
  recentItems: SavedItem[]
  isGuest?: boolean
  showingMockData?: boolean
}

export function SaverContent({ recentItems, isGuest = false, showingMockData = false }: SaverContentProps) {
  const [text, setText] = useState("")
  const [isPending, startTransition] = useTransition()
  const [lastResult, setLastResult] = useState<SaveResult | null>(null)
  const router = useRouter()
  const { requireAuth } = useAuthGate()

  function handleSubmit() {
    if (!requireAuth("save and categorize content")) return
    if (!text.trim()) return

    setLastResult(null)
    startTransition(async () => {
      const result = await saveItem(text)
      if (result.error) {
        toast.error(result.error)
      } else if (result.item) {
        setLastResult(result.item as SaveResult)
        setText("")
        toast.success("Saved and categorized successfully!")
        router.refresh()
      }
    })
  }

  const charCount = text.length
  const isOverLimit = charCount > 50000

  return (
    <div className="flex flex-col gap-8">
      {isGuest && <MockDataBanner dataType="saver data" />}
      {showingMockData && (
        <EmptyUserBanner dataType="saved items" actionLabel="Save your first item above" />
      )}
      {/* Header */}
      <div>
        <h1 className="text-2xl font-semibold tracking-tight text-foreground text-balance">
          Universal Saver
        </h1>
        <p className="text-sm text-muted-foreground">
          Paste anything -- AI will analyze, categorize, and index it for smart retrieval.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-5">
        {/* Input Area - Takes 3 columns */}
        <div className="flex flex-col gap-6 lg:col-span-3">
          <Card>
            <CardContent className="pt-6">
              <div className="flex flex-col gap-4">
                <Textarea
                  placeholder="Paste a LinkedIn profile, meeting notes, task description, article snippet, contact info, or any text you want to save and organize..."
                  value={text}
                  onChange={(e) => setText(e.target.value)}
                  className="min-h-[240px] resize-y text-sm leading-relaxed"
                  disabled={isPending}
                />
                <div className="flex items-center justify-between">
                  <span
                    className={`text-xs ${isOverLimit ? "text-destructive font-medium" : "text-muted-foreground"}`}
                  >
                    {charCount.toLocaleString()} / 50,000 characters
                  </span>
                  <Button
                    onClick={handleSubmit}
                    disabled={isPending || !text.trim() || isOverLimit}
                    size="lg"
                  >
                    {isPending ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Analyzing...
                      </>
                    ) : (
                      <>
                        <Sparkles className="mr-2 h-4 w-4" />
                        Save & Categorize
                      </>
                    )}
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Result Card */}
          {lastResult && (
            <Card className="border-success/30 bg-success/5">
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="h-5 w-5 text-success" />
                    <CardTitle className="text-base">Saved Successfully</CardTitle>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-7 w-7 p-0"
                    onClick={() => setLastResult(null)}
                  >
                    <X className="h-4 w-4" />
                    <span className="sr-only">Dismiss</span>
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="flex flex-col gap-3">
                  <div>
                    <p className="font-medium text-foreground">{lastResult.title}</p>
                    <p className="text-sm text-muted-foreground">{lastResult.summary}</p>
                  </div>
                  <div className="flex flex-wrap items-center gap-2">
                    <CategoryBadge category={lastResult.category} />
                    {lastResult.tags.map((tag) => (
                      <Badge key={tag} variant="outline" className="text-xs">
                        <Tag className="mr-1 h-3 w-3" />
                        {tag}
                      </Badge>
                    ))}
                  </div>
                  {lastResult.metadata && (
                    <div className="flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
                      {(lastResult.metadata as { content_type?: string }).content_type && (
                        <span className="rounded-md bg-muted px-2 py-1">
                          Type: {(lastResult.metadata as { content_type?: string }).content_type}
                        </span>
                      )}
                      {(lastResult.metadata as { urgency?: string | null }).urgency && (
                        <span className="rounded-md bg-muted px-2 py-1">
                          Urgency: {(lastResult.metadata as { urgency?: string }).urgency}
                        </span>
                      )}
                      {(lastResult.metadata as { entities?: string[] }).entities?.length > 0 && (
                        <span className="rounded-md bg-muted px-2 py-1">
                          Entities: {(lastResult.metadata as { entities?: string[] }).entities?.join(", ")}
                        </span>
                      )}
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Example Prompts */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                What can you save?
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
                {[
                  { label: "LinkedIn profiles", example: "Sarah Chen - VP of Engineering at TechCorp..." },
                  { label: "Meeting notes", example: "Discussed Q2 roadmap with the product team..." },
                  { label: "Task descriptions", example: "Build the new onboarding flow for enterprise..." },
                  { label: "Article snippets", example: "According to recent research, AI adoption..." },
                  { label: "Contact information", example: "John Smith, CEO at Acme Inc, john@acme.com..." },
                  { label: "Ideas & brainstorms", example: "What if we integrated the CRM with Slack..." },
                ].map((item) => (
                  <button
                    type="button"
                    key={item.label}
                    className="flex flex-col items-start rounded-lg border border-border p-3 text-left transition-colors hover:bg-accent"
                    onClick={() => setText(item.example)}
                  >
                    <span className="text-sm font-medium text-foreground">{item.label}</span>
                    <span className="line-clamp-1 text-xs text-muted-foreground">{item.example}</span>
                  </button>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Recent Items - Takes 2 columns */}
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-base">Recent Saves</CardTitle>
                <Button variant="ghost" size="sm" asChild>
                  <a href="/saved">View all</a>
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              {recentItems.length === 0 ? (
                <div className="flex flex-col items-center gap-2 py-8 text-center">
                  <Save className="h-8 w-8 text-muted-foreground/40" />
                  <p className="text-sm text-muted-foreground">
                    No saved items yet. Paste something to get started!
                  </p>
                </div>
              ) : (
                <div className="flex flex-col gap-3">
                  {recentItems.map((item) => (
                    <div
                      key={item.id}
                      className="flex flex-col gap-1.5 rounded-lg border border-border p-3"
                    >
                      <div className="flex items-start justify-between gap-2">
                        <p className="text-sm font-medium text-foreground line-clamp-1">
                          {item.title}
                        </p>
                        <CategoryBadge category={item.category} small />
                      </div>
                      {item.summary && (
                        <p className="text-xs text-muted-foreground line-clamp-2">
                          {item.summary}
                        </p>
                      )}
                      <div className="flex items-center gap-2">
                        <Clock className="h-3 w-3 text-muted-foreground" />
                        <span className="text-xs text-muted-foreground">
                          {new Date(item.created_at).toLocaleDateString("en-US", {
                            month: "short",
                            day: "numeric",
                            hour: "numeric",
                            minute: "2-digit",
                          })}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}

function CategoryBadge({ category, small = false }: { category: string; small?: boolean }) {
  const config = categoryConfig[category] || categoryConfig.general
  const Icon = config.icon
  return (
    <Badge
      variant="secondary"
      className={`${config.color} ${small ? "px-1.5 py-0 text-[10px]" : "text-xs"}`}
    >
      <Icon className={`mr-1 ${small ? "h-2.5 w-2.5" : "h-3 w-3"}`} />
      {config.label}
    </Badge>
  )
}
