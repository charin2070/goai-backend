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
  CpuChipIcon,
  CloudIcon,
  LinkIcon,
} from '@heroicons/react/24/outline';
import { ChevronRightIcon, PlayIcon, StopIcon } from '@heroicons/react/20/solid';
import Badge from '@/components/tail-admin/ui/badge/Badge';
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
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <ArrowPathIcon className="h-12 w-12 text-brand-500 animate-spin mx-auto" />
          <p className="mt-4 text-gray-500 dark:text-gray-400">Загрузка информации о сервисах...</p>
        </div>
      </div>
    );
  }

  if (error && !data) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <ExclamationTriangleIcon className="h-12 w-12 text-error-500 mx-auto" />
          <h3 className="mt-4 text-lg font-semibold text-gray-800 dark:text-white/90">Ошибка загрузки</h3>
          <p className="mt-2 text-gray-500 dark:text-gray-400">{error}</p>
          <button 
            onClick={loadServices}
            className="mt-4 rounded-xl bg-brand-500 px-4 py-2.5 text-sm font-semibold text-white shadow-theme-sm hover:bg-brand-600 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-600"
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
      case 'api':
        return CloudIcon;
      case 'provider':
        return LinkIcon;
      default:
        return CpuChipIcon;
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

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'running':
        return 'bg-success-500';
      case 'error':
        return 'bg-error-500';
      case 'stopped':
        return 'bg-gray-400';
      default:
        return 'bg-warning-500';
    }
  };

  const getHealthText = (health: string) => {
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

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Service Monitor</h1>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
            Мониторинг состояния сервисов и компонентов системы
          </p>
        </div>
        <div className="flex items-center space-x-4">
          <span className="text-sm text-gray-500 dark:text-gray-400">
            Обновлено: {lastRefresh.toLocaleTimeString('ru')}
          </span>
          <button 
            onClick={loadServices}
            disabled={loading}
            className="inline-flex items-center gap-2 rounded-lg bg-brand-500 px-4 py-2.5 text-sm font-semibold text-white shadow-theme-sm hover:bg-brand-600 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-600 disabled:opacity-50"
          >
            <ArrowPathIcon className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
            Обновить
          </button>
        </div>
      </div>

      {/* Summary Cards */}
      {summary && (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4 md:gap-6">
          {/* <!-- Metric Item Start --> */}
          <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03] md:p-6">
            <div className="flex items-center justify-center w-12 h-12 bg-gray-100 rounded-xl dark:bg-gray-800">
              <CpuChipIcon className="text-gray-800 size-6 dark:text-white/90" />
            </div>

            <div className="flex items-end justify-between mt-5">
              <div>
                <span className="text-sm text-gray-500 dark:text-gray-400">
                  Всего сервисов
                </span>
                <h4 className="mt-2 font-bold text-gray-800 text-title-sm dark:text-white/90">
                  {summary.total}
                </h4>
              </div>
              <Badge color="info">
                <ServerIcon className="size-3" />
                {summary.total > 0 ? 'Активно' : 'Нет данных'}
              </Badge>
            </div>
          </div>
          {/* <!-- Metric Item End --> */}

          {/* <!-- Metric Item Start --> */}
          <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03] md:p-6">
            <div className="flex items-center justify-center w-12 h-12 bg-gray-100 rounded-xl dark:bg-gray-800">
              <CheckCircleIcon className="text-gray-800 size-6 dark:text-white/90" />
            </div>

            <div className="flex items-end justify-between mt-5">
              <div>
                <span className="text-sm text-gray-500 dark:text-gray-400">
                  Запущено
                </span>
                <h4 className="mt-2 font-bold text-gray-800 text-title-sm dark:text-white/90">
                  {summary.running}
                </h4>
              </div>
              <Badge color="success">
                <PlayIcon className="size-3" />
                {Math.round((summary.running / summary.total) * 100)}%
              </Badge>
            </div>
          </div>
          {/* <!-- Metric Item End --> */}

          {/* <!-- Metric Item Start --> */}
          <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03] md:p-6">
            <div className="flex items-center justify-center w-12 h-12 bg-gray-100 rounded-xl dark:bg-gray-800">
              <CheckCircleIcon className="text-gray-800 size-6 dark:text-white/90" />
            </div>

            <div className="flex items-end justify-between mt-5">
              <div>
                <span className="text-sm text-gray-500 dark:text-gray-400">
                  Здоровых
                </span>
                <h4 className="mt-2 font-bold text-gray-800 text-title-sm dark:text-white/90">
                  {summary.healthy}
                </h4>
              </div>
              <Badge color="success">
                <CheckCircleIcon className="size-3" />
                {Math.round((summary.healthy / summary.total) * 100)}%
              </Badge>
            </div>
          </div>
          {/* <!-- Metric Item End --> */}

          {/* <!-- Metric Item Start --> */}
          <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03] md:p-6">
            <div className="flex items-center justify-center w-12 h-12 bg-gray-100 rounded-xl dark:bg-gray-800">
              <ExclamationTriangleIcon className="text-gray-800 size-6 dark:text-white/90" />
            </div>

            <div className="flex items-end justify-between mt-5">
              <div>
                <span className="text-sm text-gray-500 dark:text-gray-400">
                  Ошибок
                </span>
                <h4 className="mt-2 font-bold text-gray-800 text-title-sm dark:text-white/90">
                  {summary.errors}
                </h4>
              </div>
              <Badge color={summary.errors > 0 ? "error" : "success"}>
                {summary.errors > 0 ? (
                  <ExclamationTriangleIcon className="size-3" />
                ) : (
                  <CheckCircleIcon className="size-3" />
                )}
                {summary.errors > 0 ? 'Проблемы' : 'Стабильно'}
              </Badge>
            </div>
          </div>
          {/* <!-- Metric Item End --> */}
        </div>
      )}

      {/* Services by Type */}
      <div className="space-y-6">
        {Object.entries(servicesByType).map(([type, typeServices]) => {
          const Icon = getTypeIcon(type);
          
          return (
            <div key={type} className="overflow-hidden rounded-xl bg-white shadow-theme-sm dark:bg-gray-900 dark:border dark:border-gray-800">
              <div className="border-b border-gray-200 dark:border-gray-800 px-6 py-4">
                <div className="flex items-center">
                  <Icon className="h-6 w-6 text-brand-600 mr-3" />
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                    {getTypeDisplayName(type)}
                  </h3>
                  <span className="ml-2 inline-flex items-center rounded-full bg-brand-100 px-2.5 py-0.5 text-xs font-medium text-brand-800 dark:bg-brand-900/20 dark:text-brand-400">
                    {typeServices.length}
                  </span>
                </div>
              </div>
              
              <div className="divide-y divide-gray-200 dark:divide-gray-800">
                {typeServices.map((service) => (
                  <div key={service.id} className="p-6">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center min-w-0 flex-1">
                        <div className={`flex-shrink-0 h-3 w-3 rounded-full ${getStatusColor(service.status)}`} />
                        <div className="ml-4 min-w-0 flex-1">
                          <div className="flex items-center">
                            <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
                              {service.name}
                            </p>
                            <Badge 
                              color={
                                service.health === 'healthy' ? 'success' :
                                service.health === 'unhealthy' ? 'error' :
                                service.health === 'degraded' ? 'warning' : 'light'
                              }
                              size="sm"
                            >
                              {getHealthText(service.health)}
                            </Badge>
                          </div>
                          <p className="text-sm text-gray-500 dark:text-gray-400 truncate">
                            {service.description}
                          </p>
                          {service.lastHealthCheck && (
                            <p className="text-xs text-gray-400 dark:text-gray-500">
                              Последняя проверка: {new Date(service.lastHealthCheck).toLocaleString('ru')}
                            </p>
                          )}
                        </div>
                      </div>
                      
                      <div className="flex items-center space-x-2 ml-4">
                        {service.status === 'running' ? (
                          <button
                            onClick={() => handleServiceManage(service.id, 'stop')}
                            className="rounded-lg bg-error-500 p-2 text-white hover:bg-error-600 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-error-600"
                          >
                            <StopIcon className="h-4 w-4" />
                          </button>
                        ) : (
                          <button
                            onClick={() => handleServiceManage(service.id, 'start')}
                            className="rounded-lg bg-success-500 p-2 text-white hover:bg-success-600 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-success-600"
                          >
                            <PlayIcon className="h-4 w-4" />
                          </button>
                        )}
                        
                        <button
                          onClick={() => handleServiceManage(service.id, 'refresh')}
                          className="rounded-lg bg-brand-500 p-2 text-white hover:bg-brand-600 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-600"
                        >
                          <ArrowPathIcon className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
