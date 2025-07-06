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
} from "@heroicons/react/24/outline";
import Badge from "@/components/tail-admin/ui/badge/Badge";

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
      onClick: () => console.log(`Открыть детали ${service.id}`),
      type: "item" as const 
    },
  ];

  return (
    <BaseCard
      title={getShortName(service)}
      className={className}
      dropdownItems={dropdownItems}
    >
      <div className="space-y-4">
        {/* Иконка и название */}
        <div className="flex items-center gap-3">
          <div className="flex items-center justify-center w-12 h-12 bg-gray-100 rounded-xl dark:bg-gray-800">
            <ServiceIcon className="w-6 h-6 text-gray-600 dark:text-gray-400" />
          </div>
          <div className="flex-1">
            <h4 className="font-semibold text-gray-800 dark:text-white/90">
              {getShortName(service)}
            </h4>
          </div>
          <div className="flex items-center gap-2">
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

        {/* Ссылка "Подробнее" */}
        <div className="pt-2">
          <a 
            className="flex items-center gap-1 mt-5 text-sm font-medium text-brand-500 hover:text-brand-600 cursor-pointer" 
            onClick={() => console.log(`Открыть детали ${service.id}`)}
          >
            Подробнее
            <svg 
              className="fill-current" 
              width="16" 
              height="16" 
              viewBox="0 0 16 16" 
              fill="none" 
              xmlns="http://www.w3.org/2000/svg"
            >
              <path 
                fillRule="evenodd" 
                clipRule="evenodd" 
                d="M14.0855 7.99888C14.0858 8.19107 14.0126 8.38334 13.8661 8.53001L9.86873 12.5301C9.57594 12.8231 9.10107 12.8233 8.80807 12.5305C8.51508 12.2377 8.51491 11.7629 8.8077 11.4699L11.5279 8.74772L2.66797 8.74772C2.25375 8.74772 1.91797 8.41194 1.91797 7.99772C1.91797 7.58351 2.25375 7.24772 2.66797 7.24772L11.5235 7.24772L8.80772 4.53016C8.51492 4.23718 8.51507 3.7623 8.80805 3.4695C9.10104 3.1767 9.57591 3.17685 9.86871 3.46984L13.8311 7.43478C13.9871 7.57222 14.0855 7.77348 14.0855 7.99772C14.0855 7.99811 14.0855 7.9985 14.0855 7.99888Z" 
                fill=""
              />
            </svg>
          </a>
        </div>
      </div>
    </BaseCard>
  );
} 