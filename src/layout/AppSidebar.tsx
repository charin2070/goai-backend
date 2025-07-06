"use client";
import React, { useEffect, useRef, useState, useCallback } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useSidebar } from "../context/SidebarContext";
import {
  Cog6ToothIcon,
  PresentationChartLineIcon,
  HomeIcon,
  CircleStackIcon,
  CpuChipIcon,
  ChartBarIcon,
  DocumentTextIcon,
} from "@heroicons/react/24/outline";
import { ChevronDownIcon } from "@heroicons/react/20/solid";

type NavItem = {
  name: string;
  icon: React.ReactNode;
  path?: string;
  subItems?: { name: string; path: string; pro?: boolean; new?: boolean }[];
};

const navItems: NavItem[] = [
  {
    icon: <HomeIcon className="w-5 h-5" />,
    name: "Dashboard",
    path: "/dashboard",
  },
  {
    icon: <CpuChipIcon className="w-5 h-5" />,
    name: "Services",
    subItems: [
      { name: "Service Monitor", path: "/services", pro: false },
      { name: "Storage", path: "/services/storage", pro: false },
    ],
  },
  {
    icon: <PresentationChartLineIcon className="w-5 h-5" />,
    name: "Project Management",
    path: "/project-management",
  },
  {
    icon: <DocumentTextIcon className="w-5 h-5" />,
    name: "Data Analysis",
    path: "/data/issue",
  },
];

const othersItems: NavItem[] = [
  {
    icon: <Cog6ToothIcon className="w-5 h-5" />,
    name: "Settings",
    path: "/settings",
  },
  {
    icon: <ChartBarIcon className="w-5 h-5" />,
    name: "Analytics",
    subItems: [
      { name: "Reports", path: "/analytics/reports", pro: true },
      { name: "Metrics", path: "/analytics/metrics", pro: true },
    ],
  },
];

const AppSidebar: React.FC = () => {
  const { isExpanded, isMobileOpen, isHovered, setIsHovered } = useSidebar();
  const pathname = usePathname();
  const [openSubmenu, setOpenSubmenu] = useState<{
    type: "main" | "others";
    index: number;
  } | null>(null);
  const [subMenuHeight, setSubMenuHeight] = useState<{ [key: string]: number }>({});
  const subMenuRefs = useRef<{ [key: string]: HTMLDivElement | null }>({});

  const isActive = (path: string) => {
    return pathname === path || pathname.startsWith(path + "/");
  };

  const handleSubmenuToggle = (index: number, menuType: "main" | "others") => {
    if (openSubmenu?.type === menuType && openSubmenu?.index === index) {
      setOpenSubmenu(null);
    } else {
      setOpenSubmenu({ type: menuType, index });
    }
  };

  useEffect(() => {
    Object.keys(subMenuRefs.current).forEach((key) => {
      const element = subMenuRefs.current[key];
      if (element) {
        setSubMenuHeight((prev) => ({
          ...prev,
          [key]: element.scrollHeight,
        }));
      }
    });
  }, []);

  const renderMenuItems = (
    navItems: NavItem[],
    menuType: "main" | "others"
  ) => (
    <ul className="flex flex-col gap-4">
      {navItems.map((nav, index) => (
        <li key={nav.name}>
          {nav.subItems ? (
            <button
              onClick={() => handleSubmenuToggle(index, menuType)}
              className={`menu-item group  ${
                openSubmenu?.type === menuType && openSubmenu?.index === index
                  ? "menu-item-active"
                  : "menu-item-inactive"
              } cursor-pointer ${
                !isExpanded && !isHovered
                  ? "lg:justify-center"
                  : "lg:justify-start"
              }`}
            >
              <span
                className={` ${
                  openSubmenu?.type === menuType && openSubmenu?.index === index
                    ? "menu-item-icon-active"
                    : "menu-item-icon-inactive"
                }`}
              >
                {nav.icon}
              </span>
              {(isExpanded || isHovered || isMobileOpen) && (
                <span className={`menu-item-text`}>{nav.name}</span>
              )}
              {(isExpanded || isHovered || isMobileOpen) && (
                <ChevronDownIcon
                  className={`ml-auto w-5 h-5 transition-transform duration-200  ${
                    openSubmenu?.type === menuType &&
                    openSubmenu?.index === index
                      ? "rotate-180 text-brand-500"
                      : ""
                  }`}
                />
              )}
            </button>
          ) : (
            nav.path && (
              <Link
                href={nav.path}
                className={`menu-item group ${
                  isActive(nav.path) ? "menu-item-active" : "menu-item-inactive"
                }`}
              >
                <span
                  className={`${
                    isActive(nav.path)
                      ? "menu-item-icon-active"
                      : "menu-item-icon-inactive"
                  }`}
                >
                  {nav.icon}
                </span>
                {(isExpanded || isHovered || isMobileOpen) && (
                  <span className={`menu-item-text`}>{nav.name}</span>
                )}
              </Link>
            )
          )}
          {nav.subItems && (isExpanded || isHovered || isMobileOpen) && (
            <div
              ref={(el) => {
                subMenuRefs.current[`${menuType}-${index}`] = el;
              }}
              className="overflow-hidden transition-all duration-300"
              style={{
                height:
                  openSubmenu?.type === menuType && openSubmenu?.index === index
                    ? `${subMenuHeight[`${menuType}-${index}`]}px`
                    : "0px",
              }}
            >
              <ul className="mt-2 space-y-1 ml-9">
                {nav.subItems.map((subItem) => (
                  <li key={subItem.name}>
                    <Link
                      href={subItem.path}
                      className={`menu-dropdown-item ${
                        isActive(subItem.path)
                          ? "menu-dropdown-item-active"
                          : "menu-dropdown-item-inactive"
                      }`}
                    >
                      {subItem.name}
                      <span className="flex items-center gap-1 ml-auto">
                        {subItem.new && (
                          <span
                            className={`ml-auto ${
                              isActive(subItem.path)
                                ? "menu-dropdown-badge-active"
                                : "menu-dropdown-badge-inactive"
                            } menu-dropdown-badge `}
                          >
                            New
                          </span>
                        )}
                        {subItem.pro && (
                          <span
                            className={`ml-auto ${
                              isActive(subItem.path)
                                ? "menu-dropdown-badge-active"
                                : "menu-dropdown-badge-inactive"
                            } menu-dropdown-badge `}
                          >
                            Pro
                          </span>
                        )}
                      </span>
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </li>
      ))}
    </ul>
  );

  return (
    <aside
      className={`fixed top-0 left-0 z-[99999] h-screen bg-white border-r border-gray-200 transition-all duration-300 ease-in-out dark:border-gray-800 dark:bg-gray-900 ${
        isMobileOpen ? "translate-x-0" : "-translate-x-full"
      } lg:translate-x-0 ${
        isExpanded || isHovered ? "lg:w-[290px]" : "lg:w-[90px]"
      }`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="flex flex-col h-full">
        {/* Logo Section */}
        <div className="flex items-center gap-3 px-6 py-5 border-b border-gray-200 dark:border-gray-800">
          <div className="flex items-center gap-3">
            <Image
              width={32}
              height={32}
              src="/images/logo.svg"
              alt="GoAI"
              className="w-8 h-8"
            />
            {(isExpanded || isHovered || isMobileOpen) && (
              <span className="text-xl font-bold text-gray-900 dark:text-white">
                GoAI
              </span>
            )}
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-6 py-6 overflow-y-auto">
          <div className="space-y-8">
            {/* Main Menu */}
            <div>
              {(isExpanded || isHovered || isMobileOpen) && (
                <h3 className="mb-4 text-xs font-semibold text-gray-400 uppercase tracking-wider">
                  Main Menu
                </h3>
              )}
              {renderMenuItems(navItems, "main")}
            </div>

            {/* Others */}
            <div>
              {(isExpanded || isHovered || isMobileOpen) && (
                <h3 className="mb-4 text-xs font-semibold text-gray-400 uppercase tracking-wider">
                  Others
                </h3>
              )}
              {renderMenuItems(othersItems, "others")}
            </div>
          </div>
        </nav>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-gray-200 dark:border-gray-800">
          {(isExpanded || isHovered || isMobileOpen) && (
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-brand-500 flex items-center justify-center">
                <span className="text-white text-sm font-medium">D</span>
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-700 dark:text-gray-300 truncate">
                  Developer
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
                  charin2070@gmail.com
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </aside>
  );
};

export default AppSidebar; 