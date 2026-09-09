import type { LucideIcon } from "lucide-react"
import { cn } from "@/lib/utils"

export function Skeleton({ className }: { className?: string }) {
  return <div className={cn("animate-pulse rounded-xl bg-muted/60", className)} />
}

export function PlaceCardSkeleton() {
  return (
    <div className="rounded-2xl border border-border bg-card/60 p-4">
      <Skeleton className="mb-3 h-28 w-full" />
      <Skeleton className="mb-2 h-4 w-2/3" />
      <Skeleton className="h-3 w-1/2" />
    </div>
  )
}

export function EmptyState({
  icon: Icon,
  title,
  description,
  action,
}: {
  icon: LucideIcon
  title: string
  description: string
  action?: React.ReactNode
}) {
  return (
    <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-border bg-card/40 px-6 py-12 text-center">
      <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-primary/10 text-primary">
        <Icon className="h-7 w-7" />
      </div>
      <h3 className="text-base font-semibold text-foreground text-balance">{title}</h3>
      <p className="mt-1 max-w-xs text-sm text-muted-foreground text-pretty">{description}</p>
      {action && <div className="mt-5">{action}</div>}
    </div>
  )
}

export function ErrorState({ onRetry, message }: { onRetry?: () => void; message?: string }) {
  return (
    <div className="flex flex-col items-center justify-center rounded-2xl border border-destructive/30 bg-destructive/5 px-6 py-10 text-center">
      <p className="text-sm font-medium text-foreground">{message ?? "Something went wrong."}</p>
      {onRetry && (
        <button
          type="button"
          onClick={onRetry}
          className="mt-4 rounded-full border border-border px-4 py-2 text-sm font-medium text-foreground transition-colors hover:bg-muted"
        >
          Try again
        </button>
      )}
    </div>
  )
}
