# Tailadmin UI System guide

File Structure
Next.js File Structure
📂 File Structure (App Router)
The TailAdmin Next.js file structure is designed to allow the use of the App Router, offering a clear separation between pages, layouts, and other essential resources. By properly organizing your project, you can take full advantage of Next.js’s features, such as SSR, SSG, ISR, and more.

Here’s an overview of the file structure:
📂 public/ — Contains static files such as favicon.ico, fonts, and other assets.

📂 images/ — Contains all image files used in the project.
📂 src/ — Contains the source code of your Next.js app.

📂 app/ — The core directory for Next.js pages and layouts (App Router).

📄 layout.tsx — Root layout component for the entire application.
📄 page.tsx — The main entry point for the homepage.
📂 dashboard/ — Dashboard route.
📄 page.tsx — Dashboard main page.
📂 analytics/ — Analytics subpage.
📄 page.tsx — Analytics dashboard page.
📂 crm/ — CRM subpage.
📄 page.tsx — CRM dashboard page.
📂 ecommerce/ — E-commerce subpage.
📄 page.tsx — E-commerce dashboard page.
📂 marketing/ — Marketing subpage.
📄 page.tsx — Marketing dashboard page.
📂 components/ — Contains reusable components used across the app.

📂 common/ — Contains commonly used reusable components like breadcrumb.
📂 ui/ — Contains UI-specific reusable components like buttons and modals.
📂 contexts/ — Contains React Context providers for managing global state.

📂 SidebarContext/ — Manages sidebar-related state across the application.
📂 ThemeContext/ — Handles theme preferences (dark/light mode).
📂 hooks/ — Contains custom React hooks to reuse logic across components.

📂 utils/ — Contains utility functions for common tasks like formatting dates, API helpers, etc.

📄 next.config.js — Next.js configuration file.

📄 package.json — NPM package configuration and dependencies.

📄 tsconfig.json — TypeScript configuration file.

📄 .eslintrc.js — ESLint configuration for code linting.

📄 .gitignore — Specifies files and folders to be ignored by Git.

This file structure for TailAdmin Next.js provides a clean, modular, and scalable way to manage both the frontend and backend aspects of your project. The use of the App Router allows for better routing management and smoother navigation between different sections of your dashboard.

Layout
The app layout of TailAdmin provides a clean, flexible structure for building responsive admin dashboards using Tailwind CSS. It’s simple to integrate and customize for a variety of use cases.

## Layout Structure
Sidebar A vertical navigation bar that holds links to different sections of your app. It can be customized with icons, text, and collapsible menus for better space management.
Main Content Area The main space where your dashboard’s dynamic content (charts, tables, forms, etc.) will be displayed.
Header The header contains essential navigation elements such as the app’s name, user profile settings, search, and notifications.
Code Example
<div className="min-h-screen xl:flex">
  {/* Sidebar */}
  <aside>...</aside>
  {/* Main Content Area */}
  <div className="flex-1 overflow-x-hidden transition-all duration-300 ease-in-out">
    {/* Header */}
    <header>...</header>
    {/* Page Content */}
    <div className="mx-auto max-w-screen-2xl p-4 md:p-6">...</div>
  </div>
</div>
Explanation
Sidebar: Provides navigation. It can be customized with icons and text.
Main Content Area: Displays app content. Uses flex-1 to take up available space.
Header: Contains app settings, notifications, and other user options.
Customization
Sidebar: Add custom navigation links. Tailwind’s w-64 class ensures the sidebar takes up a fixed width, but you can easily adjust it based on your design requirements.
Main Content: Adjust padding and layout as needed. The overflow-x-hidden ensures that a horizontal scroll doesn’t appear. Tailwind’s transition classes (transition-all duration-300 ease-in-out) provide smooth content transitions.
Header: Customize it with quick access buttons (like search) and user profile options. It’s flexible and allows you to add icons, notifications, or any other features.
The TailAdmin App Layout provides a solid foundation for building responsive and customizable dashboards. Allows you to focus on your app’s functionality while maintaining a clean, professional design.

### Dark Mode Settings
We follow official Tailwind CSS approach while managing dark mode, please follow detailed documentation with examples here: https://tailwindcss.com/docs/dark-mode#toggling-dark-mode-manually

This is how you can add custom styling to your Tailwind CSS project. If you want to learn more and customize other things like font family, opacity, etc, check out the Tailwind CSS documentation.