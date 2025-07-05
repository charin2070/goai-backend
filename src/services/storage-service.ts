import { IStorageProvider } from "./storage/storage-provider";
import { PostgresProvider } from "./storage/postgres-provider";
import { IndexedDbProvider } from "./storage/indexeddb-provider";
import { LocalStorageProvider } from "./storage/localstorage-provider";

// Node.js-специфичные импорты для файловых операций.
// Используем require для условной загрузки, чтобы избежать ошибок в браузере.
let fs: typeof import('fs');
let path: typeof import('path');
if (typeof window === 'undefined') {
    fs = require('fs');
    path = require('path');
}


/**
 * StorageService - это класс-фасад, который предоставляет единый API
 * для взаимодействия с различными хранилищами данных.
 * Он делегирует все операции выбранному "провайдеру" (стратегии).
 *
 * Также он берет на себя специфичную для окружения логику,
 * такую как работа с файловой системой на сервере.
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

    // --- Методы для работы с файлами ---

    /**
     * Экспортирует данные из хранилища в файл.
     * В браузере инициирует скачивание. На сервере сохраняет на диск.
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
            // --- Логика для сервера (Node.js) ---
            // Предполагаем, что сохраняем в директорию 'exports' в корне проекта.
            const exportDir = path.resolve(process.cwd(), 'exports');
            if (!fs.existsSync(exportDir)) {
                fs.mkdirSync(exportDir);
            }
            const filePath = path.join(exportDir, fileName);
            fs.writeFileSync(filePath, jsonString, 'utf-8');
            console.log(`Данные успешно экспортированы в ${filePath}`);
        }
    }

    /**
     * Импортирует данные из файла. Работает только на сервере.
     * @param storeName Имя хранилища.
     * @param filePath Путь к файлу.
     */
    async importFromFile(storeName: string, filePath: string): Promise<void> {
         if (typeof window !== 'undefined') {
            console.warn('Импорт из файла поддерживается только на стороне сервера.');
            return;
        }
        
        const absolutePath = path.resolve(process.cwd(), filePath);
        if (!fs.existsSync(absolutePath)) {
            throw new Error(`Файл не найден: ${absolutePath}`);
        }
        const jsonString = fs.readFileSync(absolutePath, 'utf-8');
        await this.importStore(storeName, jsonString);
        console.log(`Данные из ${filePath} успешно импортированы в ${storeName}.`);
    }
}

/**
 * Фабрика для создания экземпляра StorageService.
 * Автоматически выбирает наилучший доступный провайдер в зависимости от среды.
 */
const createStorageService = (): StorageService => {
    let provider: IStorageProvider;

    // Выполняется на сервере
    if (typeof window === 'undefined') {
        provider = new PostgresProvider(process.env.POSTGRES_URL || '');
    } 
    // Выполняется в браузере
    else {
        // Предпочитаем IndexedDB, если он доступен
        if (window.indexedDB) {
            provider = new IndexedDbProvider('goai-app-db');
        } 
        // В крайнем случае используем localStorage
        else {
            provider = new LocalStorageProvider();
        }
    }
    
    return new StorageService(provider);
};

/**
 * Глобальный, готовый к использованию экземпляр сервиса.
 * Его необходимо инициализировать один раз при старте приложения.
 * Например, в главном файле вашего приложения (layout.tsx или _app.tsx).
 *
 * Пример использования:
 * import { storageService } from '@/services/storage-service';
 *
 * useEffect(() => {
 *   storageService.initialize();
 * }, []);
 */
export const storageService = createStorageService(); 