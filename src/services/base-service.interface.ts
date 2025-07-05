/**
 * ������� ��������� ��� ���� �������� � ���������� GoAI
 * ������������ ������������� ��������� � ������������� ���������
 */

// ������� �������
export type ServiceStatus = 
  | 'STOPPED'      // ������ ����������
  | 'STARTING'     // ������ �����������
  | 'RUNNING'      // ������ ��������
  | 'STOPPING'     // ������ ���������������
  | 'ERROR'        // ������ � ��������� ������
  | 'READY'        // ������ ����� � ������
  | 'CONNECTING'   // ����������� � ������� ��������
  | 'DISCONNECTED' // �������� �� ������� ��������

// ������ ��������� �������� �������
export type HealthStatus = 'HEALTHY' | 'UNHEALTHY' | 'DEGRADED' | 'UNKNOWN'

// ���������� � ��������� ��������
export interface HealthInfo {
  status: HealthStatus
  message: string
  timestamp: Date
  details?: Record<string, any>
}

// ������� �������
export interface ServiceMetrics {
  uptime: number
  requestCount: number
  errorCount: number
  averageResponseTime: number
  memoryUsage?: number
  customMetrics?: Record<string, number>
}

// ���������� � �������
export interface ServiceInfo {
  name: string
  version: string
  description: string
  author: string
  dependencies: string[]
  configuration: Record<string, any>
  capabilities: string[]
}

// ������������ �������
export interface ServiceConfig {
  enabled: boolean
  autoStart: boolean
  retryAttempts: number
  retryDelay: number
  timeout: number
  [key: string]: any
}

/**
 * ������� ��������� ��� ���� �������� GoAI
 */
export interface BaseService {
  // === ������������ ������ ===
  start(): Promise<void>
  stop(): Promise<void>
  restart(): Promise<void>
  health(): Promise<HealthInfo>
  getStatus(): ServiceStatus
  
  // === �������������� ����������� ������ ===
  initialize(config?: ServiceConfig): Promise<void>
  destroy(): Promise<void>
  isReady(): boolean
  getInfo(): ServiceInfo
  getMetrics(): ServiceMetrics
  validateConfig(config: ServiceConfig): Promise<boolean>
  connect(): Promise<void>
  disconnect(): Promise<void>
  
  // === ������� � ����������� ===
  on(event: string, callback: (data: any) => void): void
  off(event: string, callback: (data: any) => void): void
  emit(event: string, data?: any): void
}

/**
 * ����������� ������� ��������
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
