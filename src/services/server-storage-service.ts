import { StorageService } from './storage-service';
import { IStorageProvider } from './storage/storage-provider';

/**
 * Расширенный StorageService для серверной среды с поддержкой файловых операций.
 */
export class ServerStorageService extends StorageService {
    /**
     * Экспортирует данные из хранилища в файл на сервере.
     * @param storeName Имя хранилища.
     * @param fileName Имя файла (e.g., 'users.json').
     */
    async exportToFile(storeName: string, fileName: string): Promise<void> {
        // Проверяем среду выполнения
        if (process.env.NEXT_RUNTIME === 'edge') {
            throw new Error("File operations are not supported in Edge Runtime");
        }

        const jsonString = await this.exportStore(storeName);

        // Выполняем файловые операции через eval для избежания статического анализа
        const fileOps = eval(`
            (() => {
                const fs = require('fs');
                const path = require('path');
                return {
                    writeFile: (jsonString, fileName) => {
                        const exportDir = path.resolve(process.cwd(), 'exports');
                        if (!fs.existsSync(exportDir)) {
                            fs.mkdirSync(exportDir);
                        }
                        const filePath = path.join(exportDir, fileName);
                        fs.writeFileSync(filePath, jsonString, 'utf-8');
                        console.log(\`Данные успешно экспортированы в \${filePath}\`);
                    }
                };
            })()
        `);
        
        fileOps.writeFile(jsonString, fileName);
    }

    /**
     * Импортирует данные из файла. Работает только на сервере.
     * @param storeName Имя хранилища.
     * @param filePath Путь к файлу.
     */
    async importFromFile(storeName: string, filePath: string): Promise<void> {
        // Проверяем среду выполнения
        if (process.env.NEXT_RUNTIME === 'edge') {
            throw new Error("File operations are not supported in Edge Runtime");
        }

        // Выполняем файловые операции через eval для избежания статического анализа
        const fileOps = eval(`
            (() => {
                const fs = require('fs');
                const path = require('path');
                return {
                    readFile: (filePath) => {
                        const absolutePath = path.resolve(process.cwd(), filePath);
                        if (!fs.existsSync(absolutePath)) {
                            throw new Error(\`Файл не найден: \${absolutePath}\`);
                        }
                        const jsonString = fs.readFileSync(absolutePath, 'utf-8');
                        console.log(\`Данные из \${filePath} успешно прочитаны.\`);
                        return jsonString;
                    }
                };
            })()
        `);
        
        const jsonString = fileOps.readFile(filePath);
        await this.importStore(storeName, jsonString);
        console.log(`Данные из ${filePath} успешно импортированы в ${storeName}.`);
    }
}

/**
 * Создает StorageService для серверной среды.
 * Этот модуль изолирован от Node.js модулей для предотвращения конфликтов с Edge Runtime.
 */
export const createServerStorageService = async (): Promise<StorageService> => {
    // Проверяем, не находимся ли мы в неподдерживаемой среде Edge
    if (process.env.NEXT_RUNTIME === 'edge') {
        throw new Error("StorageService with PostgresProvider is not supported in the Edge Runtime.");
    }
    
    // Если мы в Node.js, используем асинхронный import()
    const { PostgresProvider } = await import("./storage/postgres-provider.js");
    const provider = new PostgresProvider(process.env.POSTGRES_URL || '');
    return new StorageService(provider);
}; 