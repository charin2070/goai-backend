/**
 * Базовый интерфейс для всех сервисов в экосистеме GoAI
 * Обеспечивает единообразную структуру и предсказуемое поведение
 */

// Статусы сервиса
export type ServiceStatus = 
  | 'STOPPED'      // Сервис остановлен
  | 'STARTING'     // Сервис запускается
  | 'RUNNING'      // Сервис работает
  | 'STOPPING'     // Сервис останавливается
  | 'ERROR'        // Сервис в состоянии ошибки
  | 'READY'        // Сервис готов к работе
  | 'CONNECTING'   // Подключение к внешним ресурсам
  | 'DISCONNECTED' // Отключен от внешних ресурсов

// Уровни состояния здоровья сервиса
export type HealthStatus = 'HEALTHY' | 'UNHEALTHY' | 'DEGRADED' | 'UNKNOWN'

// Информация о состоянии здоровья
export interface HealthInfo {
  status: HealthStatus
  message: string
  timestamp: Date
  details?: Record<string, any>
}

// Метрики сервиса
export interface ServiceMetrics {
  uptime: number
  requestCount: number
  errorCount: number
  averageResponseTime: number
  memoryUsage?: number
  customMetrics?: Record<string, number>
}

// Информация о сервисе
export interface ServiceInfo {
  name: string
  version: string
  description: string
  author: string
  dependencies: string[]
  configuration: Record<string, any>
  capabilities: string[]
}

// Конфигурация сервиса
export interface ServiceConfig {
  enabled: boolean
  autoStart: boolean
  retryAttempts: number
  retryDelay: number
  timeout: number
  [key: string]: any
}

/**
 * Базовый интерфейс для всех сервисов GoAI
 */
export interface BaseService {
  // === ОБЯЗАТЕЛЬНЫЕ МЕТОДЫ ===
  start(): Promise<void>
  stop(): Promise<void>
  restart(): Promise<void>
  health(): Promise<HealthInfo>
  getStatus(): ServiceStatus
  
  // === ДОПОЛНИТЕЛЬНЫЕ СТАНДАРТНЫЕ МЕТОДЫ ===
  initialize(config?: ServiceConfig): Promise<void>
  destroy(): Promise<void>
  isReady(): boolean
  getInfo(): ServiceInfo
  getMetrics(): ServiceMetrics
  validateConfig(config: ServiceConfig): Promise<boolean>
  connect(): Promise<void>
  disconnect(): Promise<void>
  
  // === СОБЫТИЯ И УВЕДОМЛЕНИЯ ===
  on(event: string, callback: (data: any) => void): void
  off(event: string, callback: (data: any) => void): void
  emit(event: string, data?: any): void
}

/**
 * Стандартные события сервисов
 */
export const ServiceEvents = {
  STARTED: 'service:started',
  STOPPED: 'service:stopped',
  ERROR: 'service:error',
  HEALTH_CHECK: 'service:health_check',
  CONFIG_UPDATED: 'service:config_updated',
  CONNECTED: 'service:connected',
  DISCONNECTED: 'service:disconnected'
} as const
