'use client'

import './globals.css'
import { Avatar } from '@/components/avatar'
import { Button } from '@/components/button'
import {
  Dropdown,
  DropdownButton,
  DropdownDivider,
  DropdownItem,
  DropdownLabel,
  DropdownMenu,
} from '@/components/dropdown'
import { Heading, Subheading } from '@/components/heading'
import { Link } from '@/components/link'
import { Navbar, NavbarItem, NavbarSection, NavbarSpacer } from '@/components/navbar'
import {
  Sidebar,
  SidebarBody,
  SidebarFooter,
  SidebarHeader,
  SidebarHeading,
  SidebarItem,
  SidebarLabel,
  SidebarSection,
  SidebarSpacer,
} from '@/components/sidebar'
import { SidebarLayout } from '@/components/sidebar-layout'
import {
  ArrowRightStartOnRectangleIcon,
  ChevronDownIcon,
  ChevronUpIcon,
  Cog8ToothIcon,
  LightBulbIcon,
  PlusIcon,
  ShieldCheckIcon,
  UserCircleIcon,
} from '@heroicons/react/20/solid'
import {
  Cog6ToothIcon,
  PresentationChartLineIcon,
  HomeIcon,
  QuestionMarkCircleIcon,
  CircleStackIcon,
  CpuChipIcon,
} from '@heroicons/react/24/outline'
import { UserIcon } from 'lucide-react'
import { usePathname } from 'next/navigation'

function AccountDropdownMenu({ anchor }: { anchor: 'top start' | 'bottom end' }) {
  return (
    <DropdownMenu className="min-w-64" anchor={anchor}>
      <DropdownItem href="#">
        <UserCircleIcon />
        <DropdownLabel>My account</DropdownLabel>
      </DropdownItem>
      <DropdownDivider />
      <DropdownItem href="#">
        <ShieldCheckIcon />
        <DropdownLabel>Privacy policy</DropdownLabel>
      </DropdownItem>
      <DropdownItem href="#">
        <LightBulbIcon />
        <DropdownLabel>Share feedback</DropdownLabel>
      </DropdownItem>
      <DropdownDivider />
      <DropdownItem href="/login">
        <ArrowRightStartOnRectangleIcon />
        <DropdownLabel>Sign out</DropdownLabel>
      </DropdownItem>
    </DropdownMenu>
  )
}

export function ApplicationLayout({ children }: { children: React.ReactNode }) {
  let pathname = usePathname()

  return (
    <html>
      <body>
    <SidebarLayout
      navbar={
        <Navbar>
          <NavbarSpacer />
          <NavbarSection>
            <Dropdown>
              <DropdownButton as={NavbarItem}>
                <Avatar src="/images/user.svg" square />
              </DropdownButton>
              <AccountDropdownMenu anchor="bottom end" />
            </Dropdown>
          </NavbarSection>
        </Navbar>
      }
      sidebar={
        <Sidebar>
          <SidebarHeader>
            <Dropdown>
              <DropdownButton as={SidebarItem}>
                <Avatar src="/images/logo.svg" />
                <SidebarLabel><strong>GoAI</strong></SidebarLabel>
                <ChevronDownIcon />
              </DropdownButton>
              <DropdownMenu className="min-w-80 lg:min-w-64" anchor="bottom start">
                <DropdownItem href="/settings">
                  <Cog8ToothIcon />
                  <DropdownLabel>Settings</DropdownLabel>
                </DropdownItem>
                <DropdownDivider />
                <DropdownItem href="/services/logs">
                  <Avatar slot="icon" src="/images/logs.svg" />
                  <DropdownLabel>Logs</DropdownLabel>
                </DropdownItem>
              </DropdownMenu>
            </Dropdown>
          </SidebarHeader>

          <SidebarBody>
          <SidebarSection>
              <SidebarHeading>Services</SidebarHeading>
              <SidebarItem href="/services">
                <CpuChipIcon />
                <SidebarLabel>Service Monitor</SidebarLabel>
              </SidebarItem>
              <SidebarItem href="/services/storage">
                <CircleStackIcon />
                <SidebarLabel>Storage</SidebarLabel>
              </SidebarItem>
            </SidebarSection>
          
            <SidebarSection>
              <SidebarHeading>Project</SidebarHeading>
              <SidebarItem href="/project-management">
                <PresentationChartLineIcon />
                <SidebarLabel>Management</SidebarLabel>
              </SidebarItem>
              <SidebarItem href="/project-dashboard">
                <Cog6ToothIcon />
                <SidebarLabel>Settings</SidebarLabel>
              </SidebarItem>
            </SidebarSection>
            </SidebarBody>


            <SidebarSpacer />
          <SidebarFooter className="max-lg:hidden">
            <Dropdown>
              <DropdownButton as={SidebarItem}>
              <UserIcon className="size-6" />
                  
                  <span className="min-w-0">
                    <span className="block truncate text-sm/5 font-medium text-zinc-950 dark:text-white">Developer</span>
                    <span className="block truncate text-xs/5 font-normal text-zinc-500 dark:text-zinc-400">
                      charin2070@gmail.com
                    </span>
                  </span>     
              </DropdownButton>
              <AccountDropdownMenu anchor="top start" />
            </Dropdown>
          </SidebarFooter>
        </Sidebar>
      }
    >
      {children}
    </SidebarLayout>
    </body>
    </html>
  )
}
