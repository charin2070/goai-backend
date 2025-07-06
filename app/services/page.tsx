'use client';

import { useEffect, useState } from 'react';
import {
  ChartBarSquareIcon,
  ServerIcon,
  Cog6ToothIcon,
  ExclamationTriangleIcon,
  CheckCircleIcon,
  ArrowPathIcon,
  CpuChipIcon,
} from '@heroicons/react/24/outline';
import ServiceCard from './ServiceCard';
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

  const handleServiceAction = async (serviceId: string, action: string) => {
    try {
      console.log(`${action} service ${serviceId}`);
      
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
      console.log('Service action result:', result);
      
      // Обновляем данные после действия
      if (action === 'refresh' || action === 'restart') {
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

  // Находим основные сервисы для отображения
  const backendService: ServiceInfo = {
    id: 'backend-service',
    name: 'Backend Service',
    description: 'Основной backend модуль GoAI платформы (Next.js, API Routes)',
    status: 'running',
    health: 'healthy',
    version: '1.0.0',
    type: 'api',
    uptime: Date.now() - new Date('2024-01-01').getTime(),
    lastHealthCheck: new Date(),
    metrics: {
      requestCount: summary?.total || 0,
      errorCount: summary?.errors || 0,
      averageResponseTime: 45,
    },
    configuration: {
      enabled: true,
      autoStart: true,
      framework: 'Next.js 15.3.4',
      runtime: 'Node.js + Edge Runtime',
      port: 3000,
      environment: 'development'
    }
  };

  const storageService = services.find(s => s.id === 'storage-service') || {
    id: 'storage-service',
    name: 'Storage Service',
    description: 'Универсальный сервис для работы с хранилищами данных',
    status: 'running' as const,
    health: 'healthy' as const,
    version: '1.0.0',
    type: 'storage' as const,
    uptime: Date.now() - new Date('2024-01-01').getTime(),
    lastHealthCheck: new Date(),
    metrics: {
      requestCount: 0,
      errorCount: 0,
      averageResponseTime: 20,
    },
    configuration: {
      enabled: true,
      autoStart: true,
      providers: ['PostgreSQL', 'IndexedDB', 'LocalStorage']
    }
  };

  const settingsService = services.find(s => s.id === 'settings-service') || {
    id: 'settings-service',
    name: 'Settings Service',
    description: 'Сервис для управления настройками системы',
    status: 'running' as const,
    health: 'healthy' as const,
    version: '1.0.0',
    type: 'settings' as const,
    uptime: Date.now() - new Date('2024-01-01').getTime(),
    lastHealthCheck: new Date(),
    metrics: {
      requestCount: 0,
      errorCount: 0,
      averageResponseTime: 15,
    },
    configuration: {
      enabled: true,
      autoStart: true,
      database: 'PostgreSQL',
      settingsCount: 5
    }
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Service Monitor</h1>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
            Мониторинг состояния сервисов и компонентов системы GoAI
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

      {/* Общая сводка */}
      {summary && (
        <div className="rounded-2xl border border-gray-200 bg-white p-6 dark:border-gray-800 dark:bg-white/[0.03]">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-semibold text-gray-800 dark:text-white/90">
                Общая сводка
              </h2>
              <p className="mt-1 text-gray-500 text-theme-sm dark:text-gray-400">
                Обзор состояния всех сервисов системы
              </p>
            </div>
            <div className="flex items-center justify-center w-12 h-12 bg-gray-100 rounded-xl dark:bg-gray-800">
              <CpuChipIcon className="text-gray-800 size-6 dark:text-white/90" />
            </div>
          </div>
          
          <div className="mt-6 grid grid-cols-2 gap-4 sm:grid-cols-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-gray-900 dark:text-white">
                {summary.total}
              </div>
              <div className="text-sm text-gray-500 dark:text-gray-400">
                Всего сервисов
              </div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-success-600 dark:text-success-400">
                {summary.running}
              </div>
              <div className="text-sm text-gray-500 dark:text-gray-400">
                Запущено
              </div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-success-600 dark:text-success-400">
                {summary.healthy}
              </div>
              <div className="text-sm text-gray-500 dark:text-gray-400">
                Здоровых
              </div>
            </div>
            <div className="text-center">
              <div className={`text-2xl font-bold ${summary.errors > 0 ? 'text-error-600 dark:text-error-400' : 'text-success-600 dark:text-success-400'}`}>
                {summary.errors}
              </div>
              <div className="text-sm text-gray-500 dark:text-gray-400">
                Ошибок
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Основные сервисы */}
      <div className="space-y-6">
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
          Основные сервисы
        </h2>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
          {/* Backend Service */}
          <ServiceCard
            service={backendService}
            onServiceAction={handleServiceAction}
            className="lg:col-span-1"
          />

          {/* Storage Service */}
          <ServiceCard
            service={storageService}
            onServiceAction={handleServiceAction}
            className="lg:col-span-1"
          />

          {/* Settings Service */}
          <ServiceCard
            service={settingsService}
            onServiceAction={handleServiceAction}
            className="lg:col-span-1"
          />
        </div>
      </div>

      {/* Дополнительные сервисы */}
      {services.length > 0 && (
        <div className="space-y-6">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
            Дополнительные сервисы
          </h2>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {services.filter(s => !['storage-service', 'settings-service'].includes(s.id)).map((service) => (
              <ServiceCard
                key={service.id}
                service={service}
                onServiceAction={handleServiceAction}
                className="lg:col-span-1"
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
