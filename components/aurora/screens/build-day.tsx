"use client"

import { useMemo, useState } from "react"
import {
  Clock,
  WandSparkles,
  Wallet,
  Heart,
  ArrowRight,
  ArrowLeft,
  Trash2,
  Plus,
  Route,
  Check,
  CalendarPlus,
  RotateCcw,
} from "lucide-react"
import { GirlMath } from "../girl-math"
import { EmptyState } from "../feedback"
import type { Tab } from "../app-shell"
import { INTERESTS } from "@/lib/aurora/data"
import { buildDayItems, computeTimeline, formatClock, formatDuration, planTotalCost } from "@/lib/aurora/day-builder"
import { money } from "@/lib/aurora/format"
import { useAurora } from "@/lib/aurora/store"
import type { BudgetTier, Interest, TimeBudget } from "@/lib/aurora/types"
import { cn } from "@/lib/utils"

const TIMES: TimeBudget[] = ["2h", "4h", "6h", "Full day"]
const BUDGETS: BudgetTier[] = ["Free", "Under AED 100", "AED 100-300", "Any"]

export function BuildDayScreen({ onNavigate }: { onNavigate: (t: Tab) => void }) {
  const { myDay, setMyDay, removeFromMyDay, clearMyDay, savePlan } = useAurora()
  const [wizardOpen, setWizardOpen] = useState(myDay.length === 0)
  const [step, setStep] = useState(1)
  const [time, setTime] = useState<TimeBudget>("4h")
  const [interests, setInterests] = useState<Interest[]>([])
  const [budget, setBudget] = useState<BudgetTier>("Any")
  const [saved, setSaved] = useState(false)

  const stops = useMemo(() => computeTimeline(myDay, interests), [myDay, interests])
  const total = planTotalCost(stops)
  const totalDuration = stops.reduce((s, x) => s + x.durationMinute + x.travelToNextMinute, 0)

  function toggleInterest(i: Interest) {
    setInterests((prev) => (prev.includes(i) ? prev.filter((x) => x !== i) : [...prev, i]))
  }

  function generate() {
    setMyDay(buildDayItems({ timeBudget: time, interests, budget }))
    setWizardOpen(false)
    setStep(1)
    setSaved(false)
  }

  function handleSave() {
    if (myDay.length === 0) return
    savePlan({
      id: `plan-${Date.now()}`,
      name: `${time} in Dubai`,
      createdAt: Date.now(),
      timeBudget: time,
      interests,
      budget,
      items: myDay,
    })
    setSaved(true)
  }

  if (wizardOpen) {
    return (
      <div className="mx-auto max-w-xl space-y-6">
        <header className="animate-rise">
          <h1 className="text-2xl font-extrabold tracking-tight text-foreground">Build My Day</h1>
          <p className="text-sm text-muted-foreground">Four quick taps and we'll pack the perfect route.</p>
        </header>

        <Stepper step={step} />

        <div className="animate-rise rounded-2xl border border-border bg-card/70 p-5">
          {step === 1 && (
            <Step title="How much time do you have?" icon={Clock}>
              <div className="grid grid-cols-2 gap-3">
                {TIMES.map((t) => (
                  <Option key={t} active={time === t} onClick={() => setTime(t)} label={t} />
                ))}
              </div>
            </Step>
          )}
          {step === 2 && (
            <Step title="What are you into?" icon={Heart} hint="Pick as many as you like">
              <div className="flex flex-wrap gap-2">
                {INTERESTS.map((i) => (
                  <button
                    key={i}
                    type="button"
                    onClick={() => toggleInterest(i)}
                    className={cn(
                      "rounded-full border px-4 py-2 text-sm font-medium transition-colors",
                      interests.includes(i)
                        ? "border-primary bg-primary text-primary-foreground"
                        : "border-border bg-card text-muted-foreground hover:text-foreground",
                    )}
                  >
                    {i}
                  </button>
                ))}
              </div>
            </Step>
          )}
          {step === 3 && (
            <Step title="What's the budget?" icon={Wallet}>
              <div className="grid grid-cols-2 gap-3">
                {BUDGETS.map((b) => (
                  <Option key={b} active={budget === b} onClick={() => setBudget(b)} label={b} />
                ))}
              </div>
            </Step>
          )}
          {step === 4 && (
            <Step title="Ready to roll?" icon={WandSparkles}>
              <ul className="space-y-1.5 text-sm text-muted-foreground">
                <li>
                  Time: <span className="font-medium text-foreground">{time}</span>
                </li>
                <li>
                  Interests:{" "}
                  <span className="font-medium text-foreground">
                    {interests.length ? interests.join(", ") : "Surprise me"}
                  </span>
                </li>
                <li>
                  Budget: <span className="font-medium text-foreground">{budget}</span>
                </li>
              </ul>
            </Step>
          )}

          <div className="mt-6 flex items-center justify-between gap-3">
            <button
              type="button"
              disabled={step === 1}
              onClick={() => setStep((s) => Math.max(1, s - 1))}
              className="inline-flex items-center gap-1.5 rounded-xl px-4 py-2.5 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground disabled:opacity-40"
            >
              <ArrowLeft className="h-4 w-4" />
              Back
            </button>
            {step < 4 ? (
              <button
                type="button"
                onClick={() => setStep((s) => Math.min(4, s + 1))}
                className="inline-flex items-center gap-1.5 rounded-xl bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground"
              >
                Next
                <ArrowRight className="h-4 w-4" />
              </button>
            ) : (
              <button
                type="button"
                onClick={generate}
                className="inline-flex items-center gap-1.5 rounded-xl bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground shadow-[0_0_24px_-6px_var(--color-primary)]"
              >
                <WandSparkles className="h-4 w-4" />
                Generate My Day
              </button>
            )}
          </div>
        </div>

        {myDay.length > 0 && (
          <button
            type="button"
            onClick={() => setWizardOpen(false)}
            className="mx-auto block text-sm font-medium text-primary hover:underline"
          >
            Back to my current plan ({myDay.length} stops)
          </button>
        )}
      </div>
    )
  }

  return (
    <div className="mx-auto max-w-2xl space-y-5">
      <header className="animate-rise flex items-end justify-between gap-3">
        <div>
          <h1 className="text-2xl font-extrabold tracking-tight text-foreground">Your Day</h1>
          <p className="text-sm text-muted-foreground">
            {stops.length} stops · {formatDuration(totalDuration)} · {money(total)}
          </p>
        </div>
        <button
          type="button"
          onClick={() => {
            setWizardOpen(true)
            setStep(1)
          }}
          className="inline-flex shrink-0 items-center gap-1.5 rounded-xl border border-border px-3.5 py-2 text-sm font-medium text-foreground transition-colors hover:bg-muted"
        >
          <RotateCcw className="h-4 w-4" />
          Rebuild
        </button>
      </header>

      {stops.length === 0 ? (
        <EmptyState
          icon={WandSparkles}
          title="Your day is empty"
          description="Run the builder or add places and events from Explore to start your timeline."
          action={
            <button
              type="button"
              onClick={() => {
                setWizardOpen(true)
                setStep(1)
              }}
              className="rounded-full bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground"
            >
              Open the builder
            </button>
          }
        />
      ) : (
        <>
          <ol className="relative space-y-4 pl-6">
            <span aria-hidden className="absolute left-[7px] top-2 bottom-2 w-px bg-border" />
            {stops.map((stop) => (
              <li key={`${stop.item.type}-${stop.item.id}`} className="animate-rise relative">
                <span
                  aria-hidden
                  className="absolute -left-6 top-1.5 flex h-3.5 w-3.5 items-center justify-center rounded-full border-2 border-primary bg-background"
                />
                <div className="rounded-2xl border border-border bg-card/70 p-4">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <div className="flex items-center gap-2 text-xs font-medium text-primary">
                        <Clock className="h-3.5 w-3.5" />
                        {formatClock(stop.startMinute)} · {formatDuration(stop.durationMinute)}
                      </div>
                      <h3 className="mt-1 font-semibold text-foreground">{stop.name}</h3>
                      <p className="mt-0.5 text-xs text-muted-foreground text-pretty">{stop.why}</p>
                    </div>
                    <div className="flex flex-col items-end gap-2">
                      <span className="text-sm font-semibold text-accent">{money(stop.cost)}</span>
                      <button
                        type="button"
                        onClick={() => removeFromMyDay(stop.item.type, stop.item.id)}
                        aria-label={`Remove ${stop.name}`}
                        className="text-muted-foreground transition-colors hover:text-destructive"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </div>

                  {stop.cost > 0 && <GirlMath cost={stop.cost} />}
                </div>

                {stop.travelToNextMinute > 0 && (
                  <div className="flex items-center gap-1.5 py-2 pl-1 text-xs text-muted-foreground">
                    <Route className="h-3.5 w-3.5" />
                    {formatDuration(stop.travelToNextMinute)} to next stop
                  </div>
                )}
              </li>
            ))}
          </ol>

          <div className="flex flex-col gap-3 sm:flex-row">
            <button
              type="button"
              onClick={() => onNavigate("explore")}
              className="inline-flex flex-1 items-center justify-center gap-1.5 rounded-xl border border-border px-4 py-3 text-sm font-semibold text-foreground transition-colors hover:bg-muted"
            >
              <Plus className="h-4 w-4" />
              Add more stops
            </button>
            <button
              type="button"
              onClick={handleSave}
              className={cn(
                "inline-flex flex-1 items-center justify-center gap-1.5 rounded-xl px-4 py-3 text-sm font-semibold transition-colors",
                saved ? "bg-accent/20 text-accent" : "bg-primary text-primary-foreground",
              )}
            >
              {saved ? <Check className="h-4 w-4" /> : <CalendarPlus className="h-4 w-4" />}
              {saved ? "Saved to your passport" : "Save this day"}
            </button>
          </div>

          <button
            type="button"
            onClick={() => {
              clearMyDay()
              setWizardOpen(true)
              setStep(1)
            }}
            className="mx-auto block text-sm font-medium text-muted-foreground transition-colors hover:text-destructive"
          >
            Clear this day
          </button>
        </>
      )}
    </div>
  )
}

function Stepper({ step }: { step: number }) {
  return (
    <div className="flex items-center gap-2">
      {[1, 2, 3, 4].map((n) => (
        <div
          key={n}
          className={cn(
            "h-1.5 flex-1 rounded-full transition-colors",
            n <= step ? "bg-primary" : "bg-muted",
          )}
        />
      ))}
    </div>
  )
}

function Step({
  title,
  icon: Icon,
  hint,
  children,
}: {
  title: string
  icon: React.ComponentType<{ className?: string }>
  hint?: string
  children: React.ReactNode
}) {
  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary/15 text-primary">
          <Icon className="h-5 w-5" />
        </span>
        <div>
          <h2 className="font-bold text-foreground">{title}</h2>
          {hint && <p className="text-xs text-muted-foreground">{hint}</p>}
        </div>
      </div>
      {children}
    </div>
  )
}

function Option({ active, onClick, label }: { active: boolean; onClick: () => void; label: string }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "rounded-xl border px-4 py-3.5 text-sm font-semibold transition-colors",
        active
          ? "border-primary bg-primary/15 text-foreground"
          : "border-border bg-card text-muted-foreground hover:text-foreground",
      )}
    >
      {label}
    </button>
  )
}
