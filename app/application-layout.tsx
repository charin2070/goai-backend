'use client'

import './globals.css'
import { SidebarProvider } from '../src/context/SidebarContext'
import { ThemeProvider } from '../src/context/ThemeContext'
import { useSidebar } from '../src/context/SidebarContext'
import AppHeader from '../src/layout/AppHeader'
import AppSidebar from '../src/layout/AppSidebar'
import Backdrop from '../src/layout/Backdrop'
import { Outfit } from 'next/font/google'

const outfit = Outfit({
  subsets: ["latin"],
})

function AdminLayoutContent({ children }: { children: React.ReactNode }) {
  const { isExpanded, isHovered, isMobileOpen } = useSidebar()

  // Dynamic class for main content margin based on sidebar state
  const mainContentMargin = isMobileOpen
    ? "ml-0"
    : isExpanded || isHovered
    ? "lg:ml-[290px]"
    : "lg:ml-[90px]"

  return (
    <div className="min-h-screen xl:flex">
      {/* Sidebar and Backdrop */}
      <AppSidebar />
      <Backdrop />
      {/* Main Content Area */}
      <div
        className={`flex-1 transition-all duration-300 ease-in-out ${mainContentMargin}`}
      >
        {/* Header */}
        <AppHeader />
        {/* Page Content */}
        <div className="p-4 mx-auto max-w-7xl md:p-6">
          {children}
        </div>
      </div>
    </div>
  )
}

export function ApplicationLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className={`${outfit.className} dark:bg-gray-900`}>
        <ThemeProvider>
          <SidebarProvider>
            <AdminLayoutContent>
              {children}
            </AdminLayoutContent>
          </SidebarProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}
