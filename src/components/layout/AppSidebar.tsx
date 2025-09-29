'use client'

import {
  SidebarHeader,
  SidebarContent,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarFooter,
} from '@/components/ui/sidebar'
import { Logo } from '@/components/ui/logo'
import { Separator } from '@/components/ui/separator'
import { Archive, BarChart, BookOpen, Cog, LayoutDashboard, HelpCircle, Shield } from 'lucide-react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useAuth } from '@/hooks/useAuth'

const menuItems = [
  { href: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/quiz', label: 'Quiz', icon: BookOpen },
  { href: '/archive', label: 'Archive', icon: Archive },
  { href: '/progress', label: 'Progress', icon: BarChart },
]

const bottomMenuItems = [
  { href: '/about', label: 'About', icon: HelpCircle },
]

export function AppSidebar() {
  const pathname = usePathname()
  const { user } = useAuth()
  const isAdmin = user?.profile?.isAdmin ?? false

  return (
    <>
      <SidebarHeader>
        <Logo />
      </SidebarHeader>
      <Separator />
      <SidebarContent>
        <SidebarMenu>
          {menuItems.map(item => (
            <SidebarMenuItem key={item.href}>
              <Link href={item.href} passHref>
                <SidebarMenuButton isActive={pathname === item.href} tooltip={item.label}>
                  <item.icon />
                  <span>{item.label}</span>
                </SidebarMenuButton>
              </Link>
            </SidebarMenuItem>
          ))}
          {isAdmin && (
             <SidebarMenuItem>
              <Link href="/admin" passHref>
                <SidebarMenuButton isActive={pathname === '/admin'} tooltip="Admin Panel">
                  <Shield />
                  <span>Admin Panel</span>
                </SidebarMenuButton>
              </Link>
            </SidebarMenuItem>
          )}
        </SidebarMenu>
      </SidebarContent>
      <Separator />
      <SidebarFooter>
         <SidebarMenu>
            {bottomMenuItems.map(item => (
              <SidebarMenuItem key={item.href}>
                <Link href={item.href} passHref>
                  <SidebarMenuButton isActive={pathname === item.href} tooltip={item.label}>
                    <item.icon />
                    <span>{item.label}</span>
                  </SidebarMenuButton>
                </Link>
              </SidebarMenuItem>
            ))}
         </SidebarMenu>
      </SidebarFooter>
    </>
  )
}
