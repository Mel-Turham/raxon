"use client"

import { Notification03Icon } from "@hugeicons/core-free-icons"
import { HugeiconsIcon } from "@hugeicons/react"
import { type ReactElement, useMemo, useState, useTransition } from "react"
import { Button } from "@/components/ui/button"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { markAllNotificationsRead } from "@/features/notifications/actions"
import {
  NOTIFICATION_PREVIEW_COUNT,
  NOTIFICATION_TABS,
  type NotificationTab,
} from "@/features/notifications/constants"
import type { AppNotification } from "@/features/notifications/types"
import { HintTooltip } from "@/shared/components/molecules/hint-tooltip"
import { cn } from "@/shared/lib/utils"

import { NotificationItem } from "./notification-item"

const TAB_MATCH: Record<NotificationTab, (item: AppNotification) => boolean> = {
  All: (item) => !item.archived,
  Unread: (item) => !item.archived && !item.read,
  Archive: (item) => item.archived,
}

const EMPTY_MESSAGE: Record<NotificationTab, string> = {
  All: "You're all caught up.",
  Unread: "No unread notifications.",
  Archive: "Nothing archived yet.",
}

type BellButtonProps = {
  unread: number
  className: string
}

export const BellButton = ({
  unread,
  className,
  ...props
}: BellButtonProps) => (
  <button
    type="button"
    aria-label={unread ? `Notifications, ${unread} new` : "Notifications"}
    className={className}
    {...props}
  >
    <span className="relative">
      <HugeiconsIcon icon={Notification03Icon} size={17} />
      {unread > 0 && (
        <span className="absolute -top-0.5 -right-0.5 size-1.5 rounded-full bg-primary ring-2 ring-card" />
      )}
    </span>
  </button>
)

type NotificationsPopoverProps = {
  initialNotifications: AppNotification[]

  triggerClassName: string
}

export const NotificationsPopover = ({
  initialNotifications,
  triggerClassName,
}: NotificationsPopoverProps) => {
  const [notifications, setNotifications] = useState(initialNotifications)
  const [tab, setTab] = useState<NotificationTab>("All")
  const [showAll, setShowAll] = useState(false)
  const [isMarking, startMarking] = useTransition()

  const counts = useMemo(
    () =>
      Object.fromEntries(
        NOTIFICATION_TABS.map((name) => [
          name,
          notifications.filter(TAB_MATCH[name]).length,
        ])
      ) as Record<NotificationTab, number>,
    [notifications]
  )
  const visible = notifications.filter(TAB_MATCH[tab])
  const shown = showAll ? visible : visible.slice(0, NOTIFICATION_PREVIEW_COUNT)

  const update = (next: AppNotification) =>
    setNotifications((list) =>
      list.map((item) => (item.id === next.id ? next : item))
    )
  const archive = (id: string) =>
    setNotifications((list) =>
      list.map((item) =>
        item.id === id ? { ...item, archived: true, read: true } : item
      )
    )
  const markAllRead = () =>
    startMarking(async () => {
      const result = await markAllNotificationsRead()
      if (result.ok) {
        setNotifications((list) =>
          list.map((item) => ({ ...item, read: true }))
        )
      }
    })

  const bell: ReactElement = (
    <PopoverTrigger
      render={
        <BellButton className={triggerClassName} unread={counts.Unread} />
      }
    />
  )

  return (
    <Popover>
      <HintTooltip
        label={
          counts.Unread
            ? `Notifications · ${counts.Unread} new`
            : "Notifications"
        }
      >
        {bell}
      </HintTooltip>

      <PopoverContent
        align="end"
        sideOffset={10}
        className="w-[min(25rem,calc(100vw-1.5rem))] gap-0 p-0 text-sm"
      >
        <div className="flex items-center justify-between px-4 pt-4 pb-3">
          <h2 className="text-base font-semibold text-foreground">
            Notifications
          </h2>
          <button
            type="button"
            disabled={isMarking || counts.Unread === 0}
            onClick={markAllRead}
            className="text-xs text-primary transition-opacity hover:opacity-80 disabled:pointer-events-none disabled:opacity-40"
          >
            Mark all as read
          </button>
        </div>

        <Tabs
          value={tab}
          onValueChange={(next) => {
            setTab(next as NotificationTab)
            setShowAll(false)
          }}
          className="gap-0"
        >
          <TabsList
            variant="line"
            className="w-full gap-0 border-b border-border p-0 group-data-horizontal/tabs:h-10"
          >
            {NOTIFICATION_TABS.map((name) => (
              <TabsTrigger
                key={name}
                value={name}
                className="group/tab h-full gap-2 text-xs after:bg-primary group-data-horizontal/tabs:after:bottom-0"
              >
                {name}
                <span
                  className={cn(
                    "min-w-5 rounded-(--card-radius) px-1.5 text-[10px] leading-4 tabular-nums",
                    tab === name
                      ? "bg-primary text-primary-foreground"
                      : "bg-muted text-muted-foreground"
                  )}
                >
                  {counts[name]}
                </span>
              </TabsTrigger>
            ))}
          </TabsList>
        </Tabs>

        {shown.length === 0 ? (
          <p className="px-4 py-10 text-center text-sm text-muted-foreground">
            {EMPTY_MESSAGE[tab]}
          </p>
        ) : (
          <ul className="max-h-[min(70vh,560px)] overflow-y-auto">
            {shown.map((notification) => (
              <NotificationItem
                key={notification.id}
                notification={notification}
                onArchive={archive}
                onChange={update}
              />
            ))}
          </ul>
        )}

        {visible.length > NOTIFICATION_PREVIEW_COUNT && (
          <div className="border-t border-border p-3">
            <Button
              className="h-10 w-full text-sm"
              onClick={() => setShowAll((value) => !value)}
            >
              {showAll
                ? "Show less"
                : `View all notifications (${visible.length})`}
            </Button>
          </div>
        )}
      </PopoverContent>
    </Popover>
  )
}
