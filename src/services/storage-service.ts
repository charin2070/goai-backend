import { IStorageProvider } from "./storage/storage-provider";
// PostgresProvider будет импортирован динамически
// import { PostgresProvider } from "./storage/postgres-provider";
import { IndexedDbProvider } from "./storage/indexeddb-provider";
import { LocalStorageProvider } from "./storage/localstorage-provider";

/**
 * StorageService - это класс-фасад, который предоставляет единый API
 * для взаимодействия с различными хранилищами данных.
 * Он делегирует все операции выбранному "провайдеру" (стратегии).
 */
export class StorageService implements IStorageProvider {
    private provider: IStorageProvider;

    constructor(provider: IStorageProvider) {
        this.provider = provider;
    }

    // --- Делегирование основных CRUD-операций провайдеру ---

    initialize(): Promise<void> {
        return this.provider.initialize();
    }

    create<T extends { id?: any }>(storeName: string, data: Omit<T, 'id'>): Promise<T> {
        return this.provider.create(storeName, data);
    }

    read<T>(storeName: string, id: any): Promise<T | null> {
        return this.provider.read(storeName, id);
    }

    update<T extends { id: any }>(storeName: string, id: any, data: Partial<Omit<T, 'id'>>): Promise<T> {
        return this.provider.update(storeName, id, data);
    }

    delete(storeName: string, id: any): Promise<boolean> {
        return this.provider.delete(storeName, id);
    }

    list<T>(storeName: string, query?: any): Promise<T[]> {
        return this.provider.list(storeName, query);
    }
    
    // --- Делегирование операций импорта/экспорта данных ---

    exportStore(storeName: string): Promise<string> {
        return this.provider.exportStore(storeName);
    }

    importStore(storeName: string, data: string): Promise<void> {
        return this.provider.importStore(storeName, data);
    }

    // --- Методы для работы с файлами (только для браузера) ---

    /**
     * Экспортирует данные из хранилища в файл.
     * В браузере инициирует скачивание.
     * @param storeName Имя хранилища.
     * @param fileName Имя файла (e.g., 'users.json').
     */
    async exportToFile(storeName: string, fileName: string): Promise<void> {
        const jsonString = await this.exportStore(storeName);

        if (typeof window !== 'undefined') {
            // --- Логика для браузера ---
            const blob = new Blob([jsonString], { type: 'application/json' });
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = fileName;
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            URL.revokeObjectURL(url);
        } else {
            console.warn('Экспорт файлов на сервере доступен только через server-storage-service.ts');
        }
    }
}

let storageServicePromise: Promise<StorageService> | null = null;

const createStorageService = async (): Promise<StorageService> => {
    if (typeof window !== 'undefined') {
        // --- Логика для БРАУЗЕРА ---
        let provider: IStorageProvider;
        if (window.indexedDB) {
            provider = new IndexedDbProvider('goai-app-db');
        } else {
            provider = new LocalStorageProvider();
        }
        return new StorageService(provider);
    } else {
        // --- Логика для СЕРВЕРА ---
        // Используем отдельный серверный модуль
        const { createServerStorageService } = await import("./server-storage-service.js");
        return createServerStorageService();
    }
};

/**
 * Асинхронно получает единственный экземпляр StorageService.
 * Создает его при первом вызове, затем возвращает существующий.
 */
export const getStorageService = (): Promise<StorageService> => {
    if (!storageServicePromise) {
        storageServicePromise = createStorageService();
    }
    return storageServicePromise;
}; 