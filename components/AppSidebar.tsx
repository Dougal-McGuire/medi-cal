"use client"

import Link from 'next/link'
import { useRouter } from 'next/router'
import { Home, PersonStanding } from 'lucide-react'
import { MdMonitorWeight } from 'react-icons/md'
import NephrologyIcon from '@/components/icons/NephrologyIcon'
import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarTrigger
} from '@/components/ui/sidebar'
import { STRINGS } from '@/resources/strings'

export function AppSidebar() {
  const router = useRouter()
  
  const navigation = [
    {
      title: STRINGS.NAV_HOME,
      url: '/',
      icon: Home,
      isActive: router.pathname === '/'
    },
    {
      title: STRINGS.NAV_BMI_CALCULATOR,
      url: '/calculators/bmi',
      icon: MdMonitorWeight,
      isActive: router.pathname === '/calculators/bmi'
    },
    {
      title: 'BSA Calculator',
      url: '/calculators/bsa',
      icon: PersonStanding,
      isActive: router.pathname === '/calculators/bsa'
    },
    {
      title: 'Creatinine Calculator',
      url: '/calculators/creatinine',
      icon: NephrologyIcon,
      isActive: router.pathname === '/calculators/creatinine'
    }
  ]

  return (
    <Sidebar>
      <SidebarHeader>
        <div className="flex items-center justify-between px-3 py-2">
          <h1 className="text-lg font-semibold text-primary">
            {STRINGS.APP_NAME}
          </h1>
          <SidebarTrigger />
        </div>
      </SidebarHeader>
      <SidebarContent>
        <SidebarMenu>
          {navigation.map((item) => (
            <SidebarMenuItem key={item.url}>
              <SidebarMenuButton asChild isActive={item.isActive}>
                <Link href={item.url} className="flex items-center gap-3">
                  <item.icon className="h-4 w-4" />
                  <span>{item.title}</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </SidebarContent>
    </Sidebar>
  )
}