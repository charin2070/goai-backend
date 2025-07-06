/**
 * Файл для выполнения кода при старте сервера Next.js.
 * @see https://nextjs.org/docs/app/building-your-application/optimizing/instrumentation
 */

export const runtime = 'nodejs'; // Указываем, что этот код должен выполняться только в среде Node.js

import { createServerStorageService } from './src/services/server-storage-service';

export async function register() {
  // Не выполняем инициализацию в среде Edge Runtime
  if (process.env.NEXT_RUNTIME === 'edge') {
    return;
  }
  
  console.log('Попытка получения и инициализации StorageService в среде Node.js...');
  try {
    const storageService = await createServerStorageService();
    await storageService.initialize();
    console.log('✅ StorageService успешно инициализирован.');
    // Здесь можно будет добавлять инициализацию других сервисов
  } catch (error) {
    console.error('🔴 Ошибка при инициализации StorageService:', error);
  }
}