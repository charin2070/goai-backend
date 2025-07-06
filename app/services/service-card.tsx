'use client';

import { ServiceInfo } from '../api/services/route';
import {
  ServerIcon,
  ChartBarSquareIcon,
  Cog6ToothIcon,
  CloudIcon,
  LinkIcon,
  CheckCircleIcon,
  ExclamationTriangleIcon,
  ClockIcon,
} from '@heroicons/react/24/outline';
import { ChevronRightIcon } from '@heroicons/react/20/solid';

interface ServiceCardProps {
  service: ServiceInfo;
  onManage?: (serviceId: string, action: string) => void;
}

const statuses = {
  running: 'text-green-400 bg-green-400/10',
  stopped: 'text-gray-400 bg-gray-400/10',
  error: 'text-rose-400 bg-rose-400/10',
  unknown: 'text-yellow-400 bg-yellow-400/10',
};

const healthStatuses = {
  healthy: 'text-green-400 bg-green-400/10 ring-green-400/20',
  unhealthy: 'text-rose-400 bg-rose-400/10 ring-rose-400/20',
  degraded: 'text-yellow-400 bg-yellow-400/10 ring-yellow-400/20',
  unknown: 'text-gray-400 bg-gray-400/10 ring-gray-400/20',
};

function classNames(...classes: string[]) {
  return classes.filter(Boolean).join(' ');
}

export default function ServiceCard({ service, onManage }: ServiceCardProps) {
  const getTypeIcon = (type: ServiceInfo['type']) => {
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
        return ServerIcon;
    }
  };

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

  const TypeIcon = getTypeIcon(service.type);

  return (
    <div className="relative overflow-hidden rounded-lg bg-white/5 px-4 py-5 shadow ring-1 ring-white/10 hover:bg-white/10 transition-colors duration-200">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-x-3">
          <div className="flex-shrink-0">
            <TypeIcon className="h-6 w-6 text-gray-400" />
          </div>
          <div className="min-w-0 flex-1">
            <h3 className="text-sm font-semibold text-white truncate">{service.name}</h3>
            <p className="text-xs text-gray-400 truncate">{service.description}</p>
          </div>
        </div>
        <div className="flex items-center gap-x-2">
          <div className={classNames(statuses[service.status], 'flex-none rounded-full p-1')}>
            <div className="h-2 w-2 rounded-full bg-current" />
          </div>
        </div>
      </div>

      {/* Status and Health */}
      <div className="flex items-center justify-between mb-4">
        <div>
          <dt className="text-xs font-medium text-gray-400">Состояние</dt>
          <dd className={classNames(
            healthStatuses[service.health],
            'mt-1 inline-flex items-center rounded-md px-2 py-1 text-xs font-medium ring-1 ring-inset'
          )}>
            {service.health === 'healthy' && (
              <>
                <CheckCircleIcon className="h-3 w-3 mr-1" />
                Здоров
              </>
            )}
            {service.health === 'unhealthy' && (
              <>
                <ExclamationTriangleIcon className="h-3 w-3 mr-1" />
                Неисправен
              </>
            )}
            {service.health === 'degraded' && (
              <>
                <ExclamationTriangleIcon className="h-3 w-3 mr-1" />
                Ухудшен
              </>
            )}
            {service.health === 'unknown' && (
              <>
                <ClockIcon className="h-3 w-3 mr-1" />
                Неизвестно
              </>
            )}
          </dd>
        </div>
        <div className="text-right">
          <dt className="text-xs font-medium text-gray-400">Версия</dt>
          <dd className="text-sm text-white font-mono">{service.version}</dd>
        </div>
      </div>

      {/* Metrics */}
      {service.metrics && (
        <div className="mb-4">
          <dt className="text-xs font-medium text-gray-400 mb-2">Метрики</dt>
          <div className="grid grid-cols-2 gap-4">
            {service.metrics.requestCount !== undefined && (
              <div>
                <dt className="text-xs text-gray-500">Запросы</dt>
                <dd className="text-sm font-medium text-white">{service.metrics.requestCount}</dd>
              </div>
            )}
            {service.metrics.errorCount !== undefined && (
              <div>
                <dt className="text-xs text-gray-500">Ошибки</dt>
                <dd className="text-sm font-medium text-rose-400">{service.metrics.errorCount}</dd>
              </div>
            )}
            {service.metrics.averageResponseTime !== undefined && (
              <div>
                <dt className="text-xs text-gray-500">Отклик (мс)</dt>
                <dd className="text-sm font-medium text-white">{service.metrics.averageResponseTime}</dd>
              </div>
            )}
            {service.uptime && (
              <div>
                <dt className="text-xs text-gray-500">Время работы</dt>
                <dd className="text-sm font-medium text-white">{formatUptime(service.uptime)}</dd>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Configuration Preview */}
      {service.configuration && (
        <div className="mb-4">
          <dt className="text-xs font-medium text-gray-400 mb-2">Конфигурация</dt>
          <div className="space-y-1">
            {Object.entries(service.configuration).slice(0, 3).map(([key, value]) => (
              <div key={key} className="flex justify-between text-xs">
                <span className="text-gray-500 capitalize">{key.replace(/_/g, ' ')}</span>
                <span className="text-gray-300 font-mono">
                  {typeof value === 'boolean' ? (value ? '✓' : '✗') : String(value).length > 20 ? String(value).substring(0, 20) + '...' : String(value)}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Actions */}
      {onManage && (
        <div className="flex items-center justify-between pt-4 border-t border-white/10">
          <div className="flex space-x-2">
            <button
              onClick={() => onManage(service.id, 'refresh')}
              className="rounded-md bg-white/10 px-2.5 py-1.5 text-xs font-semibold text-white shadow-sm hover:bg-white/20 transition-colors"
            >
              Обновить
            </button>
            {service.status === 'running' ? (
              <button
                onClick={() => onManage(service.id, 'stop')}
                className="rounded-md bg-rose-600/20 px-2.5 py-1.5 text-xs font-semibold text-rose-400 shadow-sm hover:bg-rose-600/30 transition-colors"
              >
                Остановить
              </button>
            ) : (
              <button
                onClick={() => onManage(service.id, 'start')}
                className="rounded-md bg-green-600/20 px-2.5 py-1.5 text-xs font-semibold text-green-400 shadow-sm hover:bg-green-600/30 transition-colors"
              >
                Запустить
              </button>
            )}
          </div>
          <div className="text-xs text-gray-500">
            {new Date(service.lastHealthCheck).toLocaleTimeString('ru')}
          </div>
        </div>
      )}
    </div>
  );
}
