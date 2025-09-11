"use client"

import React from 'react'
import { Button } from '@/components/ui/button'
import { Menu } from 'lucide-react'
import { cn } from '@/lib/utils'

const SidebarContext = React.createContext<{
  isOpen: boolean
  setIsOpen: (open: boolean) => void
}>({
  isOpen: false,
  setIsOpen: () => {}
})

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
      <Menu className="h-4 w-4" />
    </Button>
  )
}