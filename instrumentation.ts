/**
 * Файл для выполнения кода при старте сервера Next.js.
 * @see https://nextjs.org/docs/app/building-your-application/optimizing/instrumentation
 */

import { storageService } from './src/services/storage-service';

export async function register() {
  console.log('Попытка инициализации StorageService...');
  try {
    await storageService.initialize();
    console.log('✅ StorageService успешно инициализирован.');
    // Здесь можно будет добавлять инициализацию других сервисов
  } catch (error) {
    console.error('🔴 Ошибка при инициализации StorageService:', error);
  }
} 