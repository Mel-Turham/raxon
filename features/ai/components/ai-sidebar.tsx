"use client"

import {
  Archive02Icon,
  Clock01Icon,
  Delete02Icon,
  Folder01Icon,
  FolderAddIcon,
  MoreHorizontalIcon,
  PencilEdit02Icon,
  PinIcon,
  PinOffIcon,
  PlugSocketIcon,
  PlusSignIcon,
  Search01Icon,
  Tick02Icon,
  Upload04Icon,
} from "@hugeicons/core-free-icons"
import { HugeiconsIcon } from "@hugeicons/react"
import { AnimatePresence, motion } from "motion/react"
import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import {
  type ReactNode,
  useEffect,
  useEffectEvent,
  useState,
  useSyncExternalStore,
} from "react"

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarInput,
  SidebarMenu,
  SidebarMenuAction,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarSeparator,
  SidebarTrigger,
  useSidebar,
} from "@/components/ui/sidebar"
import { Kbd, KbdGroup } from "@/components/ui/kbd"
import { toast } from "@/components/ui/toast"
import { RaxonLogo } from "@/shared/components/atoms/raxon-logo"
import { cn } from "@/shared/lib/utils"
import { AI_INTEGRATIONS_PATH, AI_STRATEGIES } from "../constants"
import { SOFT_TRANSITION } from "@/shared/lib/motion"
import type { AiConversation, AiPlan } from "../types"
import { ChatSearchDialog } from "./chat-search-dialog"
import { UpgradeCard, UserRow, useUpgradeDismissed } from "./sidebar-account"

const ITEM = "h-9 gap-3 px-2.5 text-sm"
const MENU = "w-56 rounded-xl p-1.5"
const MENU_ITEM = "gap-2.5 rounded-lg px-2.5 py-2 text-sm"

const subscribe = () => () => {}
const isMac = () => /mac/i.test(navigator.platform)

const comingSoon = (feature: string) =>
  toast.success(`${feature} is coming soon`, {
    description: "This part of Raxon AI is still being designed.",
  })

export type ConversationPatch = Partial<
  Pick<AiConversation, "title" | "pinned" | "archived" | "strategy">
>

type ChatRowProps = {
  conversation: AiConversation
  isActive: boolean
  onOpen: () => void
  onUpdate: (patch: ConversationPatch) => void
  onDelete: () => void
  onShare: () => void
}

function ChatRow({
  conversation,
  isActive,
  onOpen,
  onUpdate,
  onDelete,
  onShare,
}: ChatRowProps) {
  const [draft, setDraft] = useState<string | null>(null)
  const { pinned, archived, strategy } = conversation

  const saveRename = () => {
    const title = draft?.trim()
    if (title && title !== conversation.title) onUpdate({ title })
    setDraft(null)
  }

  if (draft !== null) {
    return (
      <SidebarMenuItem>
        <SidebarInput
          aria-label="Rename chat"
          autoFocus
          className="h-9 text-sm"
          onBlur={saveRename}
          onChange={(event) => setDraft(event.target.value)}
          onFocus={(event) => event.currentTarget.select()}
          onKeyDown={(event) => {
            if (event.key === "Enter") saveRename()
            if (event.key === "Escape") setDraft(null)
          }}
          value={draft}
        />
      </SidebarMenuItem>
    )
  }

  return (
    <SidebarMenuItem>
      <SidebarMenuButton
        className="h-9 px-2.5 text-sm text-sidebar-foreground/80 group-has-data-[sidebar=menu-action]/menu-item:pr-14"
        isActive={isActive}
        onClick={onOpen}
      >
        <span>{conversation.title}</span>
      </SidebarMenuButton>

      <SidebarMenuAction
        aria-label={pinned ? "Unpin chat" : "Pin chat"}
        className={cn(
          "top-2 right-7 size-5 rounded-md text-muted-foreground hover:text-foreground",
          pinned && "text-primary hover:text-primary md:opacity-100"
        )}
        onClick={() => onUpdate({ pinned: !pinned })}
        showOnHover={!pinned}
      >
        <HugeiconsIcon icon={PinIcon} />
      </SidebarMenuAction>

      <DropdownMenu>
        <DropdownMenuTrigger
          render={
            <SidebarMenuAction
              aria-label="Chat options"
              className="top-2 size-5 rounded-md text-muted-foreground hover:text-foreground"
              showOnHover
            />
          }
        >
          <HugeiconsIcon icon={MoreHorizontalIcon} />
        </DropdownMenuTrigger>
        <DropdownMenuContent align="start" className={MENU} side="right">
          <DropdownMenuItem
            className={MENU_ITEM}
            onClick={() => setDraft(conversation.title)}
          >
            <HugeiconsIcon icon={PencilEdit02Icon} />
            Rename
          </DropdownMenuItem>
          <DropdownMenuItem
            className={MENU_ITEM}
            onClick={() => onUpdate({ pinned: !pinned })}
          >
            <HugeiconsIcon icon={pinned ? PinOffIcon : PinIcon} />
            {pinned ? "Unpin" : "Pin"}
          </DropdownMenuItem>
          <DropdownMenuSeparator className="my-1.5" />
          <DropdownMenuItem className={MENU_ITEM} onClick={onShare}>
            <HugeiconsIcon icon={Upload04Icon} />
            Share
          </DropdownMenuItem>
          <DropdownMenuSeparator className="my-1.5" />
          <DropdownMenuItem
            className={MENU_ITEM}
            onClick={() => onUpdate({ archived: !archived, pinned: false })}
          >
            <HugeiconsIcon icon={Archive02Icon} />
            {archived ? "Unarchive" : "Archive"}
          </DropdownMenuItem>
          <DropdownMenuItem
            className={cn(
              MENU_ITEM,
              "text-destructive focus:bg-destructive/10 focus:text-destructive"
            )}
            onClick={onDelete}
          >
            <HugeiconsIcon className="text-destructive!" icon={Delete02Icon} />
            Delete
          </DropdownMenuItem>
          <DropdownMenuSeparator className="my-1.5" />
          <DropdownMenuSub>
            <DropdownMenuSubTrigger className={MENU_ITEM}>
              <HugeiconsIcon icon={Folder01Icon} />
              Move to strategy
            </DropdownMenuSubTrigger>
            <DropdownMenuSubContent className={MENU}>
              {AI_STRATEGIES.map((name) => (
                <DropdownMenuItem
                  className={MENU_ITEM}
                  key={name}
                  onClick={() =>
                    onUpdate({ strategy: strategy === name ? null : name })
                  }
                >
                  <HugeiconsIcon icon={Folder01Icon} />
                  <span className="flex-1">{name}</span>
                  {strategy === name && (
                    <HugeiconsIcon className="text-primary" icon={Tick02Icon} />
                  )}
                </DropdownMenuItem>
              ))}
              <DropdownMenuSeparator className="my-1.5" />
              <DropdownMenuItem
                className={MENU_ITEM}
                onClick={() => comingSoon("New strategies")}
              >
                <HugeiconsIcon icon={FolderAddIcon} />
                New strategy…
              </DropdownMenuItem>
            </DropdownMenuSubContent>
          </DropdownMenuSub>
        </DropdownMenuContent>
      </DropdownMenu>
    </SidebarMenuItem>
  )
}

type AiSidebarProps = {
  conversations: AiConversation[]
  plan: AiPlan
  userAvatar: ReactNode
  activeId: string | null
  onNewChat: () => void
  onOpen: (conversation: AiConversation) => void
  onUpdate: (id: string, patch: ConversationPatch) => void
  onDelete: (id: string) => void
  onShare: (id: string) => void
}

export function AiSidebar({
  conversations,
  plan,
  userAvatar,
  activeId,
  onNewChat,
  onOpen,
  onUpdate,
  onDelete,
  onShare,
}: AiSidebarProps) {
  const router = useRouter()
  const pathname = usePathname()
  const { setOpenMobile } = useSidebar()
  const [isSearchOpen, setIsSearchOpen] = useState(false)
  const [showArchive, setShowArchive] = useState(false)
  const [upgradeDismissed, setUpgradeDismissed] = useUpgradeDismissed()

  const matches = conversations.filter(
    (conversation) => conversation.archived === showArchive
  )
  const groups = showArchive
    ? [{ label: "Archived chats", icon: Archive02Icon, items: matches }]
    : [
        {
          label: "Pinned",
          icon: PinIcon,
          items: matches.filter((conversation) => conversation.pinned),
        },
        {
          label: "Recent chats",
          icon: Clock01Icon,
          items: matches.filter((conversation) => !conversation.pinned),
        },
      ]

  const renderRow = (conversation: AiConversation) => (
    <ChatRow
      conversation={conversation}
      isActive={conversation.id === activeId}
      key={conversation.id}
      onDelete={() => onDelete(conversation.id)}
      onOpen={() => onOpen(conversation)}
      onShare={() => onShare(conversation.id)}
      onUpdate={(patch) => onUpdate(conversation.id, patch)}
    />
  )

  const mod = useSyncExternalStore(subscribe, isMac, () => false) ? "⌘" : "Ctrl"

  useEffect(() => {
    setOpenMobile(false)
  }, [pathname, activeId, setOpenMobile])

  const startNewChat = () => {
    setShowArchive(false)
    onNewChat()
  }

  const toggleSearch = () => setIsSearchOpen((current) => !current)

  const onShortcut = useEffectEvent((event: KeyboardEvent) => {
    if (!(event.metaKey || event.ctrlKey)) return
    const key = event.key.toLowerCase()
    if (event.shiftKey && key === "o") {
      event.preventDefault()
      startNewChat()
    } else if (event.shiftKey && key === "s") {
      event.preventDefault()
      comingSoon("Strategies")
    } else if (event.shiftKey && key === "e") {
      event.preventDefault()
      setShowArchive((current) => !current)
    } else if (event.shiftKey && key === "g") {
      event.preventDefault()
      router.push(AI_INTEGRATIONS_PATH)
    } else if (!event.shiftKey && key === "k") {
      event.preventDefault()
      toggleSearch()
    }
  })

  useEffect(() => {
    const onKey = (event: KeyboardEvent) => onShortcut(event)
    window.addEventListener("keydown", onKey)
    return () => window.removeEventListener("keydown", onKey)
  }, [])

  const nav: {
    label: string
    icon: typeof PlusSignIcon
    onClick?: () => void
    href?: string
    isActive?: boolean
    shortcut?: string[]
  }[] = [
    {
      label: "New chat",
      icon: PlusSignIcon,
      onClick: startNewChat,
      shortcut: [mod, "⇧", "O"],
    },
    {
      label: "Search",
      icon: Search01Icon,
      isActive: isSearchOpen,
      onClick: toggleSearch,
      shortcut: [mod, "K"],
    },
    {
      label: "Strategies",
      icon: Folder01Icon,
      onClick: () => comingSoon("Strategies"),
      shortcut: [mod, "⇧", "S"],
    },
    {
      label: "Archive",
      icon: Archive02Icon,
      isActive: showArchive,
      onClick: () => setShowArchive((current) => !current),
      shortcut: [mod, "⇧", "E"],
    },
    {
      label: "Integrations",
      icon: PlugSocketIcon,
      href: AI_INTEGRATIONS_PATH,
      isActive: pathname.startsWith(AI_INTEGRATIONS_PATH),
      shortcut: [mod, "⇧", "G"],
    },
  ]

  return (
    <Sidebar collapsible="icon">
      <SidebarHeader className="h-14 flex-row items-center justify-between px-3 group-data-[collapsible=icon]:px-2">
        <RaxonLogo
          aria-label="Back to dashboard"
          className="flex min-w-0 items-center gap-2.5 group-data-[collapsible=icon]:hidden [&>span:first-child]:size-7 [&>span:last-child]:text-base"
          href="/dashboard"
          label="Raxon AI"
        />
        <SidebarTrigger className="text-sidebar-foreground/70" />
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup className="px-2">
          <SidebarMenu>
            {nav.map(({ label, icon, isActive, onClick, href, shortcut }) => (
              <SidebarMenuItem key={label}>
                <SidebarMenuButton
                  className={ITEM}
                  isActive={isActive}
                  onClick={onClick}
                  render={href ? <Link href={href} /> : undefined}
                  tooltip={label}
                >
                  <HugeiconsIcon icon={icon} />
                  <span className="flex-1">{label}</span>
                  {shortcut && (
                    <KbdGroup className="group-data-[collapsible=icon]:hidden">
                      {shortcut.map((key) => (
                        <Kbd key={key}>{key}</Kbd>
                      ))}
                    </KbdGroup>
                  )}
                </SidebarMenuButton>
              </SidebarMenuItem>
            ))}
          </SidebarMenu>
        </SidebarGroup>

        <SidebarSeparator className="mx-3" />

        {groups.map(
          ({ label, icon, items }) =>
            items.length > 0 && (
              <SidebarGroup
                className="px-2 group-data-[collapsible=icon]:hidden"
                key={label}
              >
                <SidebarGroupLabel className="h-9 gap-2 px-2.5 text-[11px] font-medium tracking-[1px] uppercase">
                  <HugeiconsIcon icon={icon} size={13} />
                  {label}
                </SidebarGroupLabel>
                <SidebarMenu>{items.map(renderRow)}</SidebarMenu>
              </SidebarGroup>
            )
        )}
      </SidebarContent>

      <SidebarFooter className="gap-2 p-2 group-data-[collapsible=icon]:items-center">
        <AnimatePresence initial={false}>
          {!upgradeDismissed && (
            <motion.div
              animate={{ height: "auto", opacity: 1 }}
              className="overflow-hidden group-data-[collapsible=icon]:hidden"
              exit={{ height: 0, opacity: 0 }}
              initial={{ height: 0, opacity: 0 }}
              transition={SOFT_TRANSITION}
            >
              <UpgradeCard
                onDismiss={() => setUpgradeDismissed(true)}
                plan={plan}
              />
            </motion.div>
          )}
        </AnimatePresence>
        <UserRow
          avatar={userAvatar}
          onUpgrade={() => {
            setUpgradeDismissed(false)
            toast.success("Raxon AI Pro is coming soon", {
              description: "The upgrade offer is back in your sidebar.",
            })
          }}
          plan={plan}
        />
      </SidebarFooter>
      <ChatSearchDialog
        conversations={conversations}
        onOpen={onOpen}
        onOpenChange={setIsSearchOpen}
        open={isSearchOpen}
      />
    </Sidebar>
  )
}
