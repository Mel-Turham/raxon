"use client"

import { Autocomplete as AutocompletePrimitive } from "@base-ui/react/autocomplete"
import { Search01Icon } from "@hugeicons/core-free-icons"
import { HugeiconsIcon } from "@hugeicons/react"
import type * as React from "react"

import { cn } from "@/shared/lib/utils"

type CommandBaseProps<Item> = Omit<
  AutocompletePrimitive.Root.Props<Item>,
  "inline" | "open" | "items" | "filteredItems"
>

type CommandItemGroup<Item> = { value: string; items: readonly Item[] }

type CommandFlatProps<Item> = CommandBaseProps<Item> & {
  items?: readonly Item[]
}

type CommandGroupedProps<Item> = CommandBaseProps<Item> & {
  items: readonly CommandItemGroup<Item>[]
}

function Command<Item>(props: CommandFlatProps<Item>): React.JSX.Element
function Command<Item>(props: CommandGroupedProps<Item>): React.JSX.Element
function Command<Item>(
  props: CommandFlatProps<Item> | CommandGroupedProps<Item>
) {
  return (
    <AutocompletePrimitive.Root
      autoHighlight="always"
      data-slot="command"
      inline
      keepHighlight
      open
      {...(props as CommandFlatProps<Item>)}
    />
  )
}

type CommandInputProps = AutocompletePrimitive.Input.Props & {
  leading?: React.ReactNode
  trailing?: React.ReactNode
}

function CommandInput({
  className,
  leading,
  trailing,
  ...props
}: CommandInputProps) {
  return (
    <div
      data-slot="command-input-wrapper"
      className="flex h-12 shrink-0 items-center gap-2.5 border-b border-foreground/10 px-4"
    >
      {leading ?? (
        <HugeiconsIcon
          aria-hidden
          className="shrink-0 text-muted-foreground"
          icon={Search01Icon}
          size={15}
        />
      )}
      <AutocompletePrimitive.Input
        data-slot="command-input"
        className={cn(
          "h-full min-w-0 flex-1 bg-transparent text-sm outline-none placeholder:text-muted-foreground",
          className
        )}
        {...props}
      />
      {trailing}
    </div>
  )
}

function CommandList({
  className,
  ...props
}: AutocompletePrimitive.List.Props) {
  return (
    <AutocompletePrimitive.List
      data-slot="command-list"
      className={cn(
        "max-h-[min(360px,50dvh)] overflow-y-auto p-1.5 empty:p-0",
        className
      )}
      {...props}
    />
  )
}

function CommandEmpty({
  className,
  ...props
}: AutocompletePrimitive.Empty.Props) {
  return (
    <AutocompletePrimitive.Empty
      data-slot="command-empty"
      className={cn(
        "py-10 text-center text-xs text-muted-foreground empty:hidden empty:py-0",
        className
      )}
      {...props}
    />
  )
}

function CommandGroupLabel({
  className,
  ...props
}: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="command-group-label"
      className={cn(
        "px-2.5 pt-2 pb-1.5 text-[11px] font-medium tracking-[1px] text-muted-foreground/80 uppercase",
        className
      )}
      {...props}
    />
  )
}

function CommandGroup({
  className,
  ...props
}: AutocompletePrimitive.Group.Props) {
  return (
    <AutocompletePrimitive.Group
      data-slot="command-group"
      className={cn("flex flex-col", className)}
      {...props}
    />
  )
}

function CommandGroupHeading({
  className,
  ...props
}: AutocompletePrimitive.GroupLabel.Props) {
  return (
    <AutocompletePrimitive.GroupLabel
      data-slot="command-group-heading"
      className={cn(
        "px-2.5 pt-2 pb-1.5 text-[11px] font-medium tracking-[1px] text-muted-foreground/80 uppercase",
        className
      )}
      {...props}
    />
  )
}

const CommandCollection = AutocompletePrimitive.Collection

function CommandItem({
  className,
  ...props
}: AutocompletePrimitive.Item.Props) {
  return (
    <AutocompletePrimitive.Item
      data-slot="command-item"
      className={cn(
        "relative flex min-h-16 cursor-pointer items-center gap-3 px-3 py-3 text-sm text-foreground/80 transition-colors duration-150 outline-none select-none data-highlighted:bg-foreground/6 data-highlighted:text-foreground data-disabled:pointer-events-none data-disabled:opacity-50",
        className
      )}
      {...props}
    />
  )
}

export {
  Command,
  CommandCollection,
  CommandEmpty,
  CommandGroup,
  CommandGroupHeading,
  CommandGroupLabel,
  CommandInput,
  CommandItem,
  CommandList,
}
