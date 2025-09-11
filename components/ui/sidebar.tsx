"use client"

import React from "react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

const SidebarContext = React.createContext<{
  isOpen: boolean
  setIsOpen: (open: boolean) => void
}>({
  isOpen: false,
  setIsOpen: () => {}
})

export function SidebarProvider({ 
  children, 
  defaultOpen = false 
}: {
  children: React.ReactNode
  defaultOpen?: boolean
}) {
  const [isOpen, setIsOpen] = React.useState(defaultOpen)

  return (
    <SidebarContext.Provider value={{ isOpen, setIsOpen }}>
      {children}
    </SidebarContext.Provider>
  )
}

export function Sidebar({
  children,
  side = "left",
  className
}: {
  children?: React.ReactNode
  side?: "left" | "right"
  className?: string
}) {
  const { isOpen } = React.useContext(SidebarContext)

  return (
    <>
      {/* Desktop Sidebar */}
      <div
        className={cn(
          "hidden lg:flex lg:flex-col lg:fixed lg:inset-y-0",
          side === "left" ? "lg:left-0" : "lg:right-0",
          "w-64 bg-background border-r border-border",
          className
        )}
      >
        {children}
      </div>

      {/* Mobile Sidebar */}
      {isOpen && (
        <>
          <div 
            className="fixed inset-0 z-40 bg-black/50 lg:hidden" 
            onClick={() => React.useContext(SidebarContext).setIsOpen(false)}
          />
          <div
            className={cn(
              "fixed inset-y-0 z-50 w-64 bg-background border-r border-border lg:hidden",
              side === "left" ? "left-0" : "right-0",
              className
            )}
          >
            {children}
          </div>
        </>
      )}
    </>
  )
}

export function SidebarContent({
  children,
  className
}: {
  children?: React.ReactNode
  className?: string
}) {
  return (
    <div className={cn("flex flex-col flex-1 min-h-0", className)}>
      {children}
    </div>
  )
}

export function SidebarHeader({
  children,
  className
}: {
  children?: React.ReactNode
  className?: string
}) {
  return (
    <div className={cn("flex items-center px-6 py-4 border-b border-border", className)}>
      {children}
    </div>
  )
}

export function SidebarMenu({
  children,
  className
}: {
  children?: React.ReactNode
  className?: string
}) {
  return (
    <nav className={cn("flex-1 px-3 py-4 space-y-1", className)}>
      {children}
    </nav>
  )
}

export function SidebarMenuItem({
  children,
  className
}: {
  children?: React.ReactNode
  className?: string
}) {
  return (
    <div className={cn("", className)}>
      {children}
    </div>
  )
}

export function SidebarMenuButton({
  children,
  isActive,
  onClick,
  className,
  asChild = false
}: {
  children?: React.ReactNode
  isActive?: boolean
  onClick?: () => void
  className?: string
  asChild?: boolean
}) {
  const Component = asChild ? React.Fragment : Button

  const buttonProps = asChild ? {} : {
    variant: isActive ? "secondary" : "ghost",
    className: cn(
      "w-full justify-start px-3 py-2 text-left font-normal",
      isActive && "bg-muted",
      className
    ),
    onClick
  }

  return (
    <Component {...buttonProps}>
      {children}
    </Component>
  )
}

export function SidebarTrigger({
  className
}: {
  className?: string
}) {
  const { isOpen, setIsOpen } = React.useContext(SidebarContext)

  return (
    <Button
      variant="ghost"
      size="sm"
      onClick={() => setIsOpen(!isOpen)}
      className={cn("lg:hidden", className)}
    >
      <svg
        className="h-4 w-4"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M4 6h16M4 12h16M4 18h16"
        />
      </svg>
    </Button>
  )
}