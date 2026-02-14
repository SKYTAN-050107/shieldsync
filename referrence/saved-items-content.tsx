"use client"

import React from "react"

import { useState, useTransition, useCallback } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import {
  Search,
  Loader2,
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
  Tag,
  Clock,
  Trash2,
  Eye,
  Archive,
} from "lucide-react"
import { deleteItem } from "@/app/(app)/saver/actions"
import { toast } from "sonner"
import { useRouter } from "next/navigation"
import { useAuthGate } from "@/components/auth-gate"
import { MockDataBanner, EmptyUserBanner } from "@/components/mock-data-banner"

type SavedItem = {
  id: string
  raw_text: string
  title: string
  summary: string | null
  category: string
  tags: string[]
  metadata: Record<string, unknown>
  created_at: string
  similarity?: number
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

interface SavedItemsContentProps {
  initialItems: SavedItem[]
  categoryCounts: Record<string, number>
  isGuest?: boolean
  showingMockData?: boolean
}

export function SavedItemsContent({ initialItems, categoryCounts, isGuest = false, showingMockData = false }: SavedItemsContentProps) {
  const [items, setItems] = useState<SavedItem[]>(initialItems)
  const [searchQuery, setSearchQuery] = useState("")
  const [categoryFilter, setCategoryFilter] = useState("all")
  const [isSearching, setIsSearching] = useState(false)
  const [isSemanticResults, setIsSemanticResults] = useState(false)
  const [viewItem, setViewItem] = useState<SavedItem | null>(null)
  const [isPending, startTransition] = useTransition()
  const router = useRouter()
  const { requireAuth } = useAuthGate()

  const handleSemanticSearch = useCallback(async () => {
    if (!requireAuth("use AI-powered search")) return
    if (!searchQuery.trim()) {
      setItems(initialItems)
      setIsSemanticResults(false)
      return
    }

    setIsSearching(true)
    try {
      const res = await fetch("/api/saved-items/search", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ query: searchQuery, category: categoryFilter }),
      })
      const data = await res.json()
      if (data.results) {
        setItems(data.results)
        setIsSemanticResults(true)
      }
    } catch {
      toast.error("Search failed. Please try again.")
    } finally {
      setIsSearching(false)
    }
  }, [searchQuery, categoryFilter, initialItems])

  function handleClearSearch() {
    setSearchQuery("")
    setItems(initialItems)
    setIsSemanticResults(false)
  }

  function handleCategoryChange(value: string) {
    setCategoryFilter(value)
    if (isSemanticResults) {
      // Re-filter from initial items when not in semantic mode
      return
    }
    if (value === "all") {
      setItems(initialItems)
    } else {
      setItems(initialItems.filter((item) => item.category === value))
    }
  }

  function handleDelete(id: string) {
    if (!requireAuth("delete saved items")) return
    startTransition(async () => {
      const result = await deleteItem(id)
      if (result.error) {
        toast.error(result.error)
      } else {
        setItems((prev) => prev.filter((item) => item.id !== id))
        toast.success("Item deleted")
        router.refresh()
      }
    })
  }

  const totalItems = Object.values(categoryCounts).reduce((a, b) => a + b, 0)

  return (
    <div className="flex flex-col gap-6">
      {isGuest && <MockDataBanner dataType="saved items" />}
      {showingMockData && (
        <EmptyUserBanner dataType="saved items" actionLabel="Use the Universal Saver to add your first item" />
      )}
      {/* Header */}
      <div>
        <h1 className="text-2xl font-semibold tracking-tight text-foreground text-balance">
          Saved Items
        </h1>
        <p className="text-sm text-muted-foreground">
          {totalItems} items saved. Use semantic search to find anything by meaning.
        </p>
      </div>

      {/* Search & Filter Bar */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-col gap-3 sm:flex-row">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Search by meaning... e.g. 'people at AI startups' or 'urgent tasks'"
                className="pl-10"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSemanticSearch()}
              />
            </div>
            <Select value={categoryFilter} onValueChange={handleCategoryChange}>
              <SelectTrigger className="w-full sm:w-44">
                <SelectValue placeholder="All categories" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All categories</SelectItem>
                {Object.entries(categoryConfig).map(([key, config]) => (
                  <SelectItem key={key} value={key}>
                    {config.label} {categoryCounts[key] ? `(${categoryCounts[key]})` : ""}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Button onClick={handleSemanticSearch} disabled={isSearching || !searchQuery.trim()}>
              {isSearching ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                <Sparkles className="mr-2 h-4 w-4" />
              )}
              AI Search
            </Button>
          </div>
          {isSemanticResults && (
            <div className="mt-3 flex items-center gap-2">
              <Badge variant="secondary" className="text-xs">
                <Sparkles className="mr-1 h-3 w-3" />
                Semantic results for &quot;{searchQuery}&quot;
              </Badge>
              <Button variant="ghost" size="sm" onClick={handleClearSearch} className="h-6 text-xs">
                Clear search
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Results */}
      {items.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center gap-3 py-12">
            <Archive className="h-10 w-10 text-muted-foreground/40" />
            <div className="text-center">
              <p className="font-medium text-foreground">
                {isSemanticResults ? "No matching items found" : "No saved items yet"}
              </p>
              <p className="text-sm text-muted-foreground">
                {isSemanticResults
                  ? "Try a different search query or clear the search"
                  : "Head to the Universal Saver to start saving content"}
              </p>
            </div>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
          {items.map((item) => {
            const config = categoryConfig[item.category] || categoryConfig.general
            const Icon = config.icon
            return (
              <Card key={item.id} className="flex flex-col">
                <CardHeader className="pb-2">
                  <div className="flex items-start justify-between gap-2">
                    <CardTitle className="line-clamp-2 text-sm font-medium">
                      {item.title}
                    </CardTitle>
                    <Badge
                      variant="secondary"
                      className={`shrink-0 px-1.5 py-0 text-[10px] ${config.color}`}
                    >
                      <Icon className="mr-1 h-2.5 w-2.5" />
                      {config.label}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="flex flex-1 flex-col gap-3">
                  {item.summary && (
                    <p className="line-clamp-3 text-xs leading-relaxed text-muted-foreground">
                      {item.summary}
                    </p>
                  )}
                  {item.similarity !== undefined && (
                    <div className="flex items-center gap-1.5">
                      <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-muted">
                        <div
                          className="h-full rounded-full bg-primary transition-all"
                          style={{ width: `${Math.round(item.similarity * 100)}%` }}
                        />
                      </div>
                      <span className="text-[10px] font-medium text-muted-foreground">
                        {Math.round(item.similarity * 100)}% match
                      </span>
                    </div>
                  )}
                  <div className="flex flex-wrap gap-1">
                    {item.tags?.slice(0, 4).map((tag) => (
                      <Badge key={tag} variant="outline" className="px-1.5 py-0 text-[10px]">
                        <Tag className="mr-0.5 h-2.5 w-2.5" />
                        {tag}
                      </Badge>
                    ))}
                    {item.tags?.length > 4 && (
                      <Badge variant="outline" className="px-1.5 py-0 text-[10px]">
                        +{item.tags.length - 4}
                      </Badge>
                    )}
                  </div>
                  <div className="mt-auto flex items-center justify-between pt-2">
                    <div className="flex items-center gap-1 text-xs text-muted-foreground">
                      <Clock className="h-3 w-3" />
                      {new Date(item.created_at).toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                      })}
                    </div>
                    <div className="flex items-center gap-1">
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-7 w-7 p-0"
                        onClick={() => setViewItem(item)}
                      >
                        <Eye className="h-3.5 w-3.5" />
                        <span className="sr-only">View item</span>
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-7 w-7 p-0 text-destructive hover:text-destructive"
                        onClick={() => handleDelete(item.id)}
                        disabled={isPending}
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                        <span className="sr-only">Delete item</span>
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )
          })}
        </div>
      )}

      {/* Detail Dialog */}
      <Dialog open={!!viewItem} onOpenChange={() => setViewItem(null)}>
        <DialogContent className="max-h-[80vh] max-w-2xl overflow-y-auto">
          {viewItem && (
            <>
              <DialogHeader>
                <div className="flex items-start gap-2">
                  <DialogTitle className="text-lg">{viewItem.title}</DialogTitle>
                </div>
              </DialogHeader>
              <div className="flex flex-col gap-4">
                <div className="flex flex-wrap items-center gap-2">
                  <CategoryBadge category={viewItem.category} />
                  {viewItem.tags?.map((tag) => (
                    <Badge key={tag} variant="outline" className="text-xs">
                      <Tag className="mr-1 h-3 w-3" />
                      {tag}
                    </Badge>
                  ))}
                </div>
                {viewItem.summary && (
                  <div>
                    <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                      Summary
                    </p>
                    <p className="text-sm leading-relaxed text-foreground">{viewItem.summary}</p>
                  </div>
                )}
                {viewItem.metadata && Object.keys(viewItem.metadata).length > 0 && (
                  <div>
                    <p className="mb-1 text-xs font-medium uppercase tracking-wide text-muted-foreground">
                      Extracted Metadata
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {(viewItem.metadata as { content_type?: string }).content_type && (
                        <Badge variant="secondary" className="text-xs">
                          Type: {(viewItem.metadata as { content_type?: string }).content_type}
                        </Badge>
                      )}
                      {(viewItem.metadata as { sentiment?: string }).sentiment && (
                        <Badge variant="secondary" className="text-xs">
                          Sentiment: {(viewItem.metadata as { sentiment?: string }).sentiment}
                        </Badge>
                      )}
                      {(viewItem.metadata as { urgency?: string }).urgency && (
                        <Badge variant="secondary" className="text-xs">
                          Urgency: {(viewItem.metadata as { urgency?: string }).urgency}
                        </Badge>
                      )}
                      {(viewItem.metadata as { entities?: string[] }).entities?.map((entity) => (
                        <Badge key={entity} variant="outline" className="text-xs">
                          {entity}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}
                <div>
                  <p className="mb-1 text-xs font-medium uppercase tracking-wide text-muted-foreground">
                    Original Content
                  </p>
                  <div className="max-h-[300px] overflow-y-auto rounded-lg border border-border bg-muted/50 p-4">
                    <pre className="whitespace-pre-wrap font-sans text-sm leading-relaxed text-foreground">
                      {viewItem.raw_text}
                    </pre>
                  </div>
                </div>
                <div className="flex items-center gap-1 text-xs text-muted-foreground">
                  <Clock className="h-3 w-3" />
                  Saved on{" "}
                  {new Date(viewItem.created_at).toLocaleDateString("en-US", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                    hour: "numeric",
                    minute: "2-digit",
                  })}
                </div>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}

function CategoryBadge({ category }: { category: string }) {
  const config = categoryConfig[category] || categoryConfig.general
  const Icon = config.icon
  return (
    <Badge variant="secondary" className={`text-xs ${config.color}`}>
      <Icon className="mr-1 h-3 w-3" />
      {config.label}
    </Badge>
  )
}
