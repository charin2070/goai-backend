'use client';

import { useEffect, useState } from 'react';
import {
  ChartBarSquareIcon,
  ServerIcon,
  Cog6ToothIcon,
  ExclamationTriangleIcon,
  CheckCircleIcon,
  ClockIcon,
  ArrowPathIcon,
} from '@heroicons/react/24/outline';
import { ChevronRightIcon } from '@heroicons/react/20/solid';
import ServiceCard from './service-card';
import { ServiceInfo } from '../api/services/route';

interface ServicesResponse {
  services: ServiceInfo[];
  summary: {
    total: number;
    running: number;
    healthy: number;
    errors: number;
    uptime: string;
  };
  lastUpdated: string;
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

export default function ServicesPage() {
  const [data, setData] = useState<ServicesResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [lastRefresh, setLastRefresh] = useState<Date>(new Date());

  const loadServices = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await fetch('/api/services');
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const servicesData = await response.json();
      setData(servicesData);
      setLastRefresh(new Date());
    } catch (err) {
      console.error('Error loading services:', err);
      setError(err instanceof Error ? err.message : 'Неизвестная ошибка');
    } finally {
      setLoading(false);
    }
  };

  const handleServiceManage = async (serviceId: string, action: string) => {
    try {
      const response = await fetch('/api/services', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ serviceId, action }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      console.log('Service management result:', result);
      
      if (action === 'refresh') {
        await loadServices();
      }
    } catch (err) {
      console.error('Error managing service:', err);
    }
  };

  useEffect(() => {
    loadServices();
    const interval = setInterval(loadServices, 30000);
    return () => clearInterval(interval);
  }, []);

  if (loading && !data) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <ArrowPathIcon className="h-12 w-12 text-indigo-400 animate-spin mx-auto" />
          <p className="mt-4 text-gray-300">Загрузка информации о сервисах...</p>
        </div>
      </div>
    );
  }

  if (error && !data) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <ExclamationTriangleIcon className="h-12 w-12 text-rose-400 mx-auto" />
          <h3 className="mt-4 text-lg font-semibold text-white">Ошибка загрузки</h3>
          <p className="mt-2 text-gray-400">{error}</p>
          <button 
            onClick={loadServices}
            className="mt-4 rounded-md bg-indigo-600 px-3.5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
          >
            Попробовать снова
          </button>
        </div>
      </div>
    );
  }

  const summary = data?.summary;
  const services = data?.services || [];

  // Группировка сервисов по типам
  const servicesByType = services.reduce((acc, service) => {
    const type = service.type;
    if (!acc[type]) {
      acc[type] = [];
    }
    acc[type].push(service);
    return acc;
  }, {} as Record<string, ServiceInfo[]>);

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'storage':
        return ServerIcon;
      case 'database':
        return ChartBarSquareIcon;
      case 'settings':
        return Cog6ToothIcon;
      default:
        return ServerIcon;
    }
  };

  const getTypeDisplayName = (type: string) => {
    const typeNames: Record<string, string> = {
      'storage': 'Хранилище',
      'database': 'База данных',
      'settings': 'Настройки',
      'api': 'API',
      'provider': 'Провайдеры',
    };
    return typeNames[type] || type;
  };

  return (
    <div className="min-h-screen bg-gray-900">
      {/* Header */}
      <div className="sticky top-0 z-40 flex h-16 shrink-0 items-center gap-x-6 border-b border-white/5 bg-gray-900 px-4 shadow-sm sm:px-6 lg:px-8">
        <div className="flex flex-1 gap-x-4 self-stretch lg:gap-x-6">
          <div className="flex items-center gap-x-4">
            <ServerIcon className="h-8 w-8 text-indigo-400" />
            <h1 className="text-base font-semibold text-white">Мониторинг сервисов</h1>
          </div>
          <div className="flex flex-1 justify-end items-center gap-x-4">
            <div className="flex items-center gap-x-2 text-sm text-gray-400">
              <ClockIcon className="h-4 w-4" />
              <span>Обновлено: {lastRefresh.toLocaleTimeString('ru')}</span>
            </div>
            <button
              onClick={loadServices}
              disabled={loading}
              className="rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 disabled:opacity-50"
            >
              <ArrowPathIcon className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
            </button>
          </div>
        </div>
      </div>

      <main className="px-4 py-8 sm:px-6 lg:px-8">
        {/* Summary Statistics */}
        {summary && (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4 mb-8">
            <div className="relative overflow-hidden rounded-lg bg-white/5 px-4 py-5 shadow ring-1 ring-white/10 sm:px-6">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <ChartBarSquareIcon className="h-6 w-6 text-gray-400" />
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-400 truncate">Всего сервисов</dt>
                    <dd className="text-lg font-medium text-white">{summary.total}</dd>
                  </dl>
                </div>
              </div>
            </div>

            <div className="relative overflow-hidden rounded-lg bg-white/5 px-4 py-5 shadow ring-1 ring-white/10 sm:px-6">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <div className="flex-none rounded-full bg-green-400/10 p-1">
                    <div className="h-2 w-2 rounded-full bg-green-400" />
                  </div>
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-400 truncate">Запущено</dt>
                    <dd className="text-lg font-medium text-white">{summary.running}</dd>
                  </dl>
                </div>
              </div>
            </div>

            <div className="relative overflow-hidden rounded-lg bg-white/5 px-4 py-5 shadow ring-1 ring-white/10 sm:px-6">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <CheckCircleIcon className="h-6 w-6 text-green-400" />
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-400 truncate">Здоровы</dt>
                    <dd className="text-lg font-medium text-white">{summary.healthy}</dd>
                  </dl>
                </div>
              </div>
            </div>

            <div className="relative overflow-hidden rounded-lg bg-white/5 px-4 py-5 shadow ring-1 ring-white/10 sm:px-6">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <ExclamationTriangleIcon className="h-6 w-6 text-rose-400" />
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-400 truncate">Ошибки</dt>
                    <dd className="text-lg font-medium text-white">{summary.errors}</dd>
                  </dl>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Services List */}
        <div className="space-y-8">
          {Object.entries(servicesByType).map(([type, typeServices]) => {
            const TypeIcon = getTypeIcon(type);
            return (
              <div key={type}>
                <div className="flex items-center gap-x-3 mb-4">
                  <TypeIcon className="h-6 w-6 text-gray-400" />
                  <h2 className="text-lg font-semibold text-white">{getTypeDisplayName(type)}</h2>
                  <span className="inline-flex items-center rounded-md bg-gray-400/10 px-2 py-1 text-xs font-medium text-gray-400">
                    {typeServices.length}
                  </span>
                </div>
                
                <ul role="list" className="divide-y divide-white/5">
                  {typeServices.map((service) => (
                    <li key={service.id} className="relative flex items-center space-x-4 px-4 py-4 hover:bg-white/5 rounded-lg">
                      <div className="min-w-0 flex-auto">
                        <div className="flex items-center gap-x-3">
                          <div className={classNames(statuses[service.status], 'flex-none rounded-full p-1')}>
                            <div className="h-2 w-2 rounded-full bg-current" />
                          </div>
                          <h3 className="min-w-0 text-sm font-semibold text-white">
                            <span className="truncate">{service.name}</span>
                          </h3>
                          <div className={classNames(
                            healthStatuses[service.health],
                            'flex-none rounded-full px-2 py-1 text-xs font-medium ring-1 ring-inset'
                          )}>
                            {service.health === 'healthy' && 'Здоров'}
                            {service.health === 'unhealthy' && 'Неисправен'}
                            {service.health === 'degraded' && 'Ухудшен'}
                            {service.health === 'unknown' && 'Неизвестно'}
                          </div>
                        </div>
                        <div className="mt-3 flex items-center gap-x-2.5 text-xs text-gray-400">
                          <p className="truncate">{service.description}</p>
                          <svg viewBox="0 0 2 2" className="h-0.5 w-0.5 flex-none fill-gray-300">
                            <circle cx={1} cy={1} r={1} />
                          </svg>
                          <p className="whitespace-nowrap">v{service.version}</p>
                          {service.metrics && (
                            <>
                              <svg viewBox="0 0 2 2" className="h-0.5 w-0.5 flex-none fill-gray-300">
                                <circle cx={1} cy={1} r={1} />
                              </svg>
                              <p className="whitespace-nowrap">
                                {service.metrics.errorCount || 0} ошибок
                              </p>
                            </>
                          )}
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-x-2">
                        <button
                          onClick={() => handleServiceManage(service.id, 'refresh')}
                          className="rounded-md bg-white/10 px-2.5 py-1.5 text-xs font-semibold text-white shadow-sm hover:bg-white/20"
                        >
                          Обновить
                        </button>
                        
                        {service.status === 'running' ? (
                          <button
                            onClick={() => handleServiceManage(service.id, 'stop')}
                            className="rounded-md bg-rose-600/20 px-2.5 py-1.5 text-xs font-semibold text-rose-400 shadow-sm hover:bg-rose-600/30"
                          >
                            Остановить
                          </button>
                        ) : (
                          <button
                            onClick={() => handleServiceManage(service.id, 'start')}
                            className="rounded-md bg-green-600/20 px-2.5 py-1.5 text-xs font-semibold text-green-400 shadow-sm hover:bg-green-600/30"
                          >
                            Запустить
                          </button>
                        )}
                      </div>
                      
                      <ChevronRightIcon className="h-5 w-5 flex-none text-gray-400" />
                    </li>
                  ))}
                </ul>
              </div>
            );
          })}
        </div>

        {/* Auto-refresh notification */}
        <div className="mt-8 text-center">
          <p className="text-sm text-gray-500">
            Автоматическое обновление каждые 30 секунд
          </p>
        </div>
      </main>
    </div>
  );
}
