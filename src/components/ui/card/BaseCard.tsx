"use client";

import { ReactNode, useState } from "react";
import { MoreDotIcon } from "@/components/icons";
import { Dropdown } from "@/components/tail-admin/ui/dropdown/Dropdown";
import { DropdownItem } from "@/components/tail-admin/ui/dropdown/DropdownItem";

export interface BaseCardProps {
  title: string;
  description?: string;
  children: ReactNode;
  className?: string;
  showDropdown?: boolean;
  dropdownItems?: Array<{
    label: string;
    onClick?: () => void;
    type?: 'item' | 'separator';
    variant?: 'default' | 'danger';
  }>;
}

export default function BaseCard({
  title,
  description,
  children,
  className = "",
  showDropdown = true,
  dropdownItems = []
}: BaseCardProps) {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  const closeDropdown = () => {
    setIsDropdownOpen(false);
  };

  const defaultDropdownItems = [
    { label: "Обновить", onClick: () => console.log("Обновить"), type: "item" as const },
    { label: "", type: "separator" as const },
    { label: "Перезагрузить", onClick: () => console.log("Перезагрузить"), type: "item" as const },
    { label: "Остановить", onClick: () => console.log("Остановить"), type: "item" as const, variant: "danger" as const },
    { label: "Запустить", onClick: () => console.log("Запустить"), type: "item" as const },
    { label: "", type: "separator" as const },
    { label: "Подробнее", onClick: () => console.log("Подробнее"), type: "item" as const },
  ];

  const menuItems = dropdownItems.length > 0 ? dropdownItems : defaultDropdownItems;

  return (
    <div className={`rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03] sm:p-6 ${className}`}>
      <div className="flex justify-between items-start">
        <div className="flex-1">
          <h3 className="text-lg font-semibold text-gray-800 dark:text-white/90">
            {title}
          </h3>
          {description && (
            <p className="mt-1 text-gray-500 text-theme-sm dark:text-gray-400">
              {description}
            </p>
          )}
        </div>

        {showDropdown && (
          <div className="relative inline-block ml-4">
            <button
              onClick={toggleDropdown}
              className="dropdown-toggle p-1 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
              aria-label="Дополнительные действия"
            >
              <MoreDotIcon className="text-gray-400 hover:text-gray-700 dark:hover:text-gray-300" />
            </button>
            <Dropdown
              isOpen={isDropdownOpen}
              onClose={closeDropdown}
              className="w-40 p-2"
            >
              {menuItems.map((item, index) => (
                item.type === 'separator' ? (
                  <div key={index} className="h-px bg-gray-200 dark:bg-gray-700 my-1" />
                ) : (
                  <DropdownItem
                    key={index}
                    onItemClick={() => {
                      item.onClick?.();
                      closeDropdown();
                    }}
                    className={`flex w-full font-normal text-left rounded-lg ${
                      item.variant === 'danger'
                        ? 'text-error-600 hover:bg-error-50 hover:text-error-700 dark:text-error-400 dark:hover:bg-error-900/10 dark:hover:text-error-300'
                        : 'text-gray-500 hover:bg-gray-100 hover:text-gray-700 dark:text-gray-400 dark:hover:bg-white/5 dark:hover:text-gray-300'
                    }`}
                  >
                    {item.label}
                  </DropdownItem>
                )
              ))}
            </Dropdown>
          </div>
        )}
      </div>

      <div className="mt-4">
        {children}
      </div>
    </div>
  );
} 