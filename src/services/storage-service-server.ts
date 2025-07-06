import { IStorageProvider } from "./storage/storage-provider";

/**
 * Серверные утилиты для StorageService.
 * Содержат код, который использует Node.js модули и может работать только на сервере.
 */
export class StorageServiceServer {
    private provider: IStorageProvider;

    constructor(provider: IStorageProvider) {
        this.provider = provider;
    }

    /**
     * Экспортирует данные из хранилища в файл на сервере.
     * @param storeName Имя хранилища.
     * @param fileName Имя файла (e.g., 'users.json').
     */
    async exportToFile(storeName: string, fileName: string): Promise<void> {
        const jsonString = await this.provider.exportStore(storeName);
        
        // Динамический импорт модулей Node.js только там, где они нужны.
        const fs = await import('fs');
        const path = await import('path');
        
        const exportDir = path.resolve(process.cwd(), 'exports');
        if (!fs.existsSync(exportDir)) {
            fs.mkdirSync(exportDir);
        }
        const filePath = path.join(exportDir, fileName);
        fs.writeFileSync(filePath, jsonString, 'utf-8');
        console.log(`Данные успешно экспортированы в ${filePath}`);
    }

    /**
     * Импортирует данные из файла. Работает только на сервере.
     * @param storeName Имя хранилища.
     * @param filePath Путь к файлу.
     */
    async importFromFile(storeName: string, filePath: string): Promise<void> {
        // Динамический импорт модулей Node.js только там, где они нужны.
        const fs = await import('fs');
        const path = await import('path');
        
        const absolutePath = path.resolve(process.cwd(), filePath);
        if (!fs.existsSync(absolutePath)) {
            throw new Error(`Файл не найден: ${absolutePath}`);
        }
        const jsonString = fs.readFileSync(absolutePath, 'utf-8');
        await this.provider.importStore(storeName, jsonString);
        console.log(`Данные из ${filePath} успешно импортированы в ${storeName}.`);
    }
}

let storageServicePromise: Promise<StorageServiceServer> | null = null;

const createStorageServiceServer = async (): Promise<StorageServiceServer> => {
    // Проверяем, не находимся ли мы в неподдерживаемой среде Edge
    if (process.env.NEXT_RUNTIME === 'edge') {
        throw new Error("StorageService with PostgresProvider is not supported in the Edge Runtime.");
    }
    
    // Если мы в Node.js, используем асинхронный import()
    const { PostgresProvider } = await import("./storage/postgres-provider.js");
    const provider = new PostgresProvider(process.env.POSTGRES_URL || '');
    return new StorageServiceServer(provider);
};

/**
 * Асинхронно получает единственный экземпляр StorageServiceServer.
 * Создает его при первом вызове, затем возвращает существующий.
 */
export const getStorageServiceServer = (): Promise<StorageServiceServer> => {
    if (!storageServicePromise) {
        storageServicePromise = createStorageServiceServer();
    }
    return storageServicePromise;
}; 