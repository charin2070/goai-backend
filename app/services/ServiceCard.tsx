"use client";

import { useState } from "react";
import BaseCard from "@/components/ui/card/BaseCard";
import { ServiceInfo } from "../api/services/route";
import {
  ServerIcon,
  ChartBarSquareIcon,
  Cog6ToothIcon,
  CloudIcon,
  LinkIcon,
  CpuChipIcon,
  CheckCircleIcon,
  ExclamationTriangleIcon,
  ClockIcon,
  XCircleIcon,
  ChevronDownIcon,
  EllipsisVerticalIcon,
} from "@heroicons/react/24/outline";
import Badge from "@/components/tail-admin/ui/badge/Badge";
import { Dropdown } from "@/components/tail-admin/ui/dropdown/Dropdown";
import { DropdownItem } from "@/components/tail-admin/ui/dropdown/DropdownItem";

export interface ServiceCardProps {
  service: ServiceInfo;
  onServiceAction?: (serviceId: string, action: string) => void;
  className?: string;
}

export default function ServiceCard({
  service,
  onServiceAction,
  className = ""
}: ServiceCardProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  // Получение иконки для типа сервиса
  const getServiceIcon = (type: ServiceInfo['type']) => {
    switch (type) {
      case 'storage':
        return ServerIcon;
      case 'database':
        return ChartBarSquareIcon;
      case 'settings':
        return Cog6ToothIcon;
      case 'api':
        return CloudIcon;
      case 'provider':
        return LinkIcon;
      default:
        return CpuChipIcon;
    }
  };

  // Получение короткого названия сервиса
  const getShortName = (service: ServiceInfo): string => {
    switch (service.type) {
      case 'api':
        return 'Backend';
      case 'storage':
        return 'Storage';
      case 'settings':
        return 'Settings';
      case 'database':
        return 'Database';
      case 'provider':
        return 'Provider';
      default:
        return service.name.split(' ')[0];
    }
  };

  // Получение описания сервиса
  const getServiceDescription = (service: ServiceInfo): string => {
    switch (service.type) {
      case 'api':
        return 'Менеджер сервисов: запуск, мониторинг, настройка';
      case 'storage':
        return 'Универсальное хранилище данных: PostgreSQL, IndexedDB, LocalStorage';
      case 'settings':
        return 'Система настроек: конфигурация и параметры приложения';
      case 'database':
        return 'База данных: PostgreSQL подключение и управление';
      case 'provider':
        return 'Провайдер данных: интеграция с внешними сервисами';
      default:
        return service.description;
    }
  };

  // Получение цвета статуса
  const getStatusBadgeColor = (status: ServiceInfo['status']) => {
    switch (status) {
      case 'running':
        return 'success';
      case 'stopped':
        return 'light';
      case 'error':
        return 'error';
      default:
        return 'warning';
    }
  };

  // Получение цвета здоровья
  const getHealthBadgeColor = (health: ServiceInfo['health']) => {
    switch (health) {
      case 'healthy':
        return 'success';
      case 'unhealthy':
        return 'error';
      case 'degraded':
        return 'warning';
      default:
        return 'light';
    }
  };

  // Получение текста здоровья
  const getHealthText = (health: ServiceInfo['health']) => {
    switch (health) {
      case 'healthy':
        return 'Здоров';
      case 'unhealthy':
        return 'Неисправен';
      case 'degraded':
        return 'Ухудшен';
      default:
        return 'Неизвестно';
    }
  };

  // Получение иконки статуса
  const getStatusIcon = (status: ServiceInfo['status']) => {
    switch (status) {
      case 'running':
        return CheckCircleIcon;
      case 'stopped':
        return XCircleIcon;
      case 'error':
        return ExclamationTriangleIcon;
      default:
        return ClockIcon;
    }
  };

  // Форматирование времени работы
  const formatUptime = (uptime?: number) => {
    if (!uptime) return 'N/A';
    
    const seconds = Math.floor(uptime / 1000);
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);
    
    if (days > 0) return `${days} дней`;
    if (hours > 0) return `${hours} часов`;
    if (minutes > 0) return `${minutes} минут`;
    return `${seconds} секунд`;
  };

  const ServiceIcon = getServiceIcon(service.type);
  const StatusIcon = getStatusIcon(service.status);

  // Создание элементов dropdown меню
  const dropdownItems = [
    { 
      label: "Обновить", 
      onClick: () => onServiceAction?.(service.id, 'refresh'),
      type: "item" as const 
    },
    { label: "", type: "separator" as const },
    { 
      label: "Перезагрузить", 
      onClick: () => onServiceAction?.(service.id, 'restart'),
      type: "item" as const 
    },
    { 
      label: "Остановить", 
      onClick: () => onServiceAction?.(service.id, 'stop'),
      type: "item" as const,
      variant: "danger" as const
    },
    { 
      label: "Запустить", 
      onClick: () => onServiceAction?.(service.id, 'start'),
      type: "item" as const 
    },
    { label: "", type: "separator" as const },
    { 
      label: "Подробнее", 
      onClick: () => setIsExpanded(!isExpanded),
      type: "item" as const 
    },
  ];

  const toggleDropdown = () => setIsDropdownOpen(!isDropdownOpen);
  const closeDropdown = () => setIsDropdownOpen(false);

  return (
    <BaseCard
      className={className}
      showDropdown={false}
    >
      <div className="flex flex-col h-full">
        {/* Заголовок */}
        <div className="flex items-center gap-3">
          <div className="flex items-center justify-center w-12 h-12 bg-gray-100 rounded-xl dark:bg-gray-800 shrink-0">
            <ServiceIcon className="w-6 h-6 text-gray-600 dark:text-gray-400" />
          </div>
          <div className="flex-1">
            <h4 className="font-semibold text-gray-800 dark:text-white/90">
              {getShortName(service)}
            </h4>
            <div className="flex items-center gap-2 mt-1">
              <Badge 
                color={getStatusBadgeColor(service.status)} 
                size="sm"
              >
                <StatusIcon className="w-3 h-3" />
                {service.status}
              </Badge>
              <Badge 
                color={getHealthBadgeColor(service.health)} 
                size="sm"
              >
                {getHealthText(service.health)}
              </Badge>
            </div>
          </div>
          <div className="relative inline-block">
            <button
              onClick={toggleDropdown}
              className="p-1 rounded-lg dropdown-toggle hover:bg-gray-100 dark:hover:bg-gray-800"
            >
              <EllipsisVerticalIcon className="w-5 h-5 text-gray-400" />
            </button>
            <Dropdown
              isOpen={isDropdownOpen}
              onClose={closeDropdown}
              className="w-40 p-2"
            >
              {dropdownItems.map((item, index) => (
                item.type === 'separator' ? (
                  <div key={index} className="h-px my-1 bg-gray-200 dark:bg-gray-700" />
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
        </div>

        {/* Секция с деталями */}
        
          <div className={`transition-all duration-300 ease-in-out overflow-hidden ${isExpanded ? 'max-h-40' : 'max-h-0'}`}>
            <div className="space-y-2">
              {/* Описание */}
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  {getServiceDescription(service)}
                </p>
              </div>

              {/* Время работы */}
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-500">
                  Stand by: {formatUptime(service.uptime)}
                </p>
              </div>
            </div>
          </div>
        
        
        {/* Футер с кнопкой "Подробнее" */}
        <div className="pt-2 mt-auto">
          <button 
            className="inline-flex items-center gap-2 text-sm font-medium text-gray-500 hover:text-brand-500 dark:text-gray-400 dark:hover:text-brand-500" 
            onClick={() => setIsExpanded(!isExpanded)}
          >
            {isExpanded ? 'Скрыть' : 'Подробнее'}
            <ChevronDownIcon 
              className={`w-4 h-4 transition-transform duration-200 ${isExpanded ? 'transform rotate-180' : ''}`}
            />
          </button>
        </div>
      </div>
    </BaseCard>
  );
} 