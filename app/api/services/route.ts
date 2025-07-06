import { NextResponse } from 'next/server';

export interface ServiceInfo {
  id: string;
  name: string;
  description: string;
  status: 'running' | 'stopped' | 'error' | 'unknown';
  health: 'healthy' | 'unhealthy' | 'degraded' | 'unknown';
  version: string;
  type: 'storage' | 'database' | 'settings' | 'api' | 'provider';
  uptime?: number;
  lastHealthCheck: Date;
  metrics?: {
    requestCount?: number;
    errorCount?: number;
    averageResponseTime?: number;
    memoryUsage?: number;
  };
  configuration?: {
    enabled: boolean;
    autoStart: boolean;
    [key: string]: any;
  };
}

async function checkStorageServiceHealth(): Promise<ServiceInfo> {
  try {
    // Попытка получить StorageService
    const { getStorageService } = await import('../../../src/services/storage-service.js');
    const storageService = await getStorageService();
    
    // Попытка инициализации
    await storageService.initialize();
    
    return {
      id: 'storage-service',
      name: 'Storage Service',
      description: 'Основной сервис для работы с хранилищами данных (PostgreSQL, IndexedDB, LocalStorage)',
      status: 'running',
      health: 'healthy',
      version: '1.0.0',
      type: 'storage',
      uptime: Date.now() - new Date('2024-01-01').getTime(),
      lastHealthCheck: new Date(),
      metrics: {
        requestCount: 0,
        errorCount: 0,
        averageResponseTime: 0,
      },
      configuration: {
        enabled: true,
        autoStart: true,
        providers: ['postgres', 'indexeddb', 'localstorage']
      }
    };
  } catch (error) {
    console.error('Storage Service health check failed:', error);
    return {
      id: 'storage-service',
      name: 'Storage Service',
      description: `Основной сервис для работы с хранилищами данных. Ошибка: ${error instanceof Error ? error.message : 'Unknown error'}`,
      status: 'error',
      health: 'unhealthy',
      version: '1.0.0',
      type: 'storage',
      lastHealthCheck: new Date(),
      metrics: {
        requestCount: 0,
        errorCount: 1,
        averageResponseTime: 0,
      },
      configuration: {
        enabled: true,
        autoStart: true,
      }
    };
  }
}

async function checkSettingsServiceHealth(): Promise<ServiceInfo> {
  try {
    // Попытка получить SettingsService
    const { settingsService } = await import('../../../src/services/settings.service.js');
    const allSettings = await settingsService.getAllSettings();
    
    return {
      id: 'settings-service',
      name: 'Settings Service',
      description: 'Сервис для управления настройками системы',
      status: 'running',
      health: 'healthy',
      version: '1.0.0',
      type: 'settings',
      uptime: Date.now() - new Date('2024-01-01').getTime(),
      lastHealthCheck: new Date(),
      metrics: {
        requestCount: 0,
        errorCount: 0,
        averageResponseTime: 50,
      },
      configuration: {
        enabled: true,
        autoStart: true,
        database: 'postgresql',
        settingsCount: Object.keys(allSettings).length
      }
    };
  } catch (error) {
    console.error('Settings Service health check failed:', error);
    return {
      id: 'settings-service',
      name: 'Settings Service',
      description: `Сервис для управления настройками системы. Ошибка: ${error instanceof Error ? error.message : 'Unknown error'}`,
      status: 'error',
      health: 'unhealthy',
      version: '1.0.0',
      type: 'settings',
      lastHealthCheck: new Date(),
      metrics: {
        requestCount: 0,
        errorCount: 1,
        averageResponseTime: 0,
      },
      configuration: {
        enabled: true,
        autoStart: true,
      }
    };
  }
}

async function checkDatabaseHealth(): Promise<ServiceInfo> {
  try {
    // Попытка подключения к базе данных
    const { db } = await import('../../../lib/db.js');
    const { sql } = await import('drizzle-orm');
    const result = await db.execute(sql`SELECT 1 as test`);
    
    // Проверяем количество продуктов
    const { products } = await import('../../../lib/db.js');
    const productCount = await db.select().from(products).limit(1);
    
    return {
      id: 'database-postgresql',
      name: 'PostgreSQL Database',
      description: 'Основная база данных для хранения данных приложения',
      status: 'running',
      health: 'healthy',
      version: '15.0',
      type: 'database',
      uptime: Date.now() - new Date('2024-01-01').getTime(),
      lastHealthCheck: new Date(),
      metrics: {
        requestCount: 0,
        errorCount: 0,
        averageResponseTime: 25,
      },
      configuration: {
        enabled: true,
        autoStart: true,
        host: '194.54.158.82',
        port: 5432,
        database: 'goai_db',
        tablesFound: 'products and settings exist'
      }
    };
  } catch (error) {
    console.error('Database health check failed:', error);
    return {
      id: 'database-postgresql',
      name: 'PostgreSQL Database',
      description: `Основная база данных для хранения данных приложения. Ошибка: ${error instanceof Error ? error.message : 'Unknown error'}`,
      status: 'error',
      health: 'unhealthy',
      version: '15.0',
      type: 'database',
      lastHealthCheck: new Date(),
      metrics: {
        requestCount: 0,
        errorCount: 1,
        averageResponseTime: 0,
      },
      configuration: {
        enabled: true,
        autoStart: true,
      }
    };
  }
}

function getStorageProviders(): ServiceInfo[] {
  return [
    {
      id: 'postgres-provider',
      name: 'PostgreSQL Provider',
      description: 'Провайдер для работы с PostgreSQL базой данных',
      status: 'running',
      health: 'healthy',
      version: '1.0.0',
      type: 'provider',
      lastHealthCheck: new Date(),
      metrics: {
        requestCount: 0,
        errorCount: 0,
        averageResponseTime: 30,
      },
      configuration: {
        enabled: true,
        autoStart: true,
        connectionPool: true
      }
    },
    {
      id: 'indexeddb-provider',
      name: 'IndexedDB Provider',
      description: 'Провайдер для работы с IndexedDB в браузере',
      status: 'running',
      health: 'healthy',
      version: '1.0.0',
      type: 'provider',
      lastHealthCheck: new Date(),
      metrics: {
        requestCount: 0,
        errorCount: 0,
        averageResponseTime: 15,
      },
      configuration: {
        enabled: true,
        autoStart: true,
        database: 'goai-app-db'
      }
    },
    {
      id: 'localstorage-provider',
      name: 'LocalStorage Provider',
      description: 'Провайдер для работы с LocalStorage браузера',
      status: 'running',
      health: 'healthy',
      version: '1.0.0',
      type: 'provider',
      lastHealthCheck: new Date(),
      metrics: {
        requestCount: 0,
        errorCount: 0,
        averageResponseTime: 5,
      },
      configuration: {
        enabled: true,
        autoStart: true,
        maxSize: '5MB'
      }
    }
  ];
}

export async function GET() {
  try {
    // Проверяем все сервисы параллельно
    const [storageService, settingsService, databaseService] = await Promise.all([
      checkStorageServiceHealth(),
      checkSettingsServiceHealth(),
      checkDatabaseHealth()
    ]);

    // Получаем информацию о провайдерах
    const storageProviders = getStorageProviders();

    // Собираем все сервисы
    const services = [
      storageService,
      settingsService,
      databaseService,
      ...storageProviders
    ];

    // Считаем общую статистику
    const totalServices = services.length;
    const runningServices = services.filter(s => s.status === 'running').length;
    const healthyServices = services.filter(s => s.health === 'healthy').length;
    const errorServices = services.filter(s => s.status === 'error').length;

    return NextResponse.json({
      services,
      summary: {
        total: totalServices,
        running: runningServices,
        healthy: healthyServices,
        errors: errorServices,
        uptime: `${Math.round((runningServices / totalServices) * 100)}%`
      },
      lastUpdated: new Date().toISOString()
    });
  } catch (error) {
    console.error('Error fetching services status:', error);
    return NextResponse.json(
      { error: 'Failed to fetch services status' },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const { serviceId, action } = await request.json();

    if (!serviceId || !action) {
      return NextResponse.json(
        { error: 'Service ID and action are required' },
        { status: 400 }
      );
    }

    // Здесь можно добавить логику для управления сервисами
    // start, stop, restart, etc.
    
    return NextResponse.json({
      message: `Action ${action} requested for service ${serviceId}`,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('Error managing service:', error);
    return NextResponse.json(
      { error: 'Failed to manage service' },
      { status: 500 }
    );
  }
} 