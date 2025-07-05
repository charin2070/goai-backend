# StorageService - Руководство по использованию

## 📋 Содержание
- [Обзор](#обзор)
- [Архитектура](#архитектура)
- [Установка и настройка](#установка-и-настройка)
- [API Reference](#api-reference)
- [Примеры использования](#примеры-использования)
- [Безопасность](#безопасность)
- [Troubleshooting](#troubleshooting)
- [Best Practices](#best-practices)
- [Roadmap](#roadmap)

---

## 🎯 Обзор

**StorageService** - это основной сервисный класс для взаимодействия с PostgreSQL базой данных в экосистеме GoAI. Он предоставляет высокоуровневый API для управления подключениями и выполнения операций с данными.

### Ключевые возможности
- ✅ **Управление подключениями** - автоматическое подключение к PostgreSQL
- ✅ **Мониторинг статуса** - отслеживание состояния соединения с БД
- ✅ **Безопасные запросы** - защита от SQL-инъекций
- ✅ **Drizzle ORM интеграция** - современный TypeScript ORM
- ✅ **Высокоуровневый API** - упрощенные методы для CRUD операций

### Расположение
```
src/services/storage-service.ts
```

---

## 🏗️ Архитектура

### Технический стек
- **PostgreSQL Client**: `pg` v8.16.3
- **ORM**: Drizzle ORM v0.31.4  
- **TypeScript**: Полная типизация
- **Connection Pooling**: Встроенный в `pg`

### Схема архитектуры
```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Next.js App   │ -> │  StorageService │ -> │   PostgreSQL    │
│   (API Routes)  │    │   (src/services) │    │ (194.54.158.82) │
└─────────────────┘    └─────────────────┘    └─────────────────┘
```

### Состояния подключения
```typescript
type DbStatus = 'CONNECTED' | 'CONNECTING' | 'DISCONNECTED';
```

---

## ⚙️ Установка и настройка

### 1. Зависимости
Убедитесь, что установлены необходимые пакеты:
```bash
pnpm add pg @types/pg drizzle-orm
```

### 2. Переменные окружения
Создайте `.env` файл с параметрами подключения:
```bash
# Database Configuration
POSTGRES_URL=postgresql://goai_user:GggodbStrong0@194.54.158.82:5432/goai_db
POSTGRES_SSL=false  # Опционально для SSL соединений
```

### 3. Импорт сервиса
```typescript
import { storageService } from '@/src/services/storage-service';
```

---

## 📚 API Reference

### Типы

#### `DbStatus`
```typescript
type DbStatus = 'CONNECTED' | 'CONNECTING' | 'DISCONNECTED';
```

### Класс `StorageService`

#### `constructor(connectionString: string)`
Создает новый экземпляр StorageService.

**Параметры:**
- `connectionString` - PostgreSQL connection string

**Пример:**
```typescript
const service = new StorageService(process.env.POSTGRES_URL);
```

#### `async connectToDb(): Promise<void>`
Устанавливает соединение с базой данных PostgreSQL.

**Возвращает:** `Promise<void>`

**Исключения:**
- Выбрасывает ошибку при неудачном подключении

**Пример:**
```typescript
try {
  await storageService.connectToDb();
  console.log('✅ Database connected successfully');
} catch (error) {
  console.error('❌ Connection failed:', error);
}
```

#### `getStatus(): DbStatus`
Возвращает текущий статус подключения к базе данных.

**Возвращает:** `DbStatus`

**Пример:**
```typescript
const status = storageService.getStatus();
if (status === 'CONNECTED') {
  // Можно выполнять запросы
}
```

#### `async getTableNames(): Promise<string[]>`
Получает список всех таблиц в базе данных.

**Возвращает:** `Promise<string[]>` - массив имен таблиц

**Исключения:**
- Выбрасывает ошибку если БД не подключена

**Пример:**
```typescript
try {
  const tables = await storageService.getTableNames();
  console.log('📋 Available tables:', tables);
  // Выведет: ['products', 'users', 'orders']
} catch (error) {
  console.error('❌ Failed to get tables:', error);
}
```

#### `async sqlQuery(dbName: string, tableName: string, sqlQuery: string): Promise<any>`
Выполняет произвольный SQL-запрос к указанной таблице.

**Параметры:**
- `dbName` - имя базы данных (для совместимости)
- `tableName` - имя таблицы для замены в запросе
- `sqlQuery` - SQL-запрос с плейсхолдером `{tableName}`

**Возвращает:** `Promise<any>` - результат запроса

**Безопасность:** Автоматическое экранирование имени таблицы

**Пример:**
```typescript
try {
  const result = await storageService.sqlQuery(
    'goai_db',
    'products', 
    'SELECT * FROM {tableName} WHERE status = $1'
  );
  console.log('📊 Query result:', result);
} catch (error) {
  console.error('❌ Query failed:', error);
}
```

#### `async setObject(dataKey: string, dataObject: Record<string, any>): Promise<any>`
Добавляет новый объект данных в указанную таблицу.

**Параметры:**
- `dataKey` - имя таблицы
- `dataObject` - объект с данными для вставки

**Возвращает:** `Promise<any>` - вставленная запись

**Безопасность:** Автоматическое экранирование и параметризированные запросы

**Пример:**
```typescript
try {
  const newProduct = await storageService.setObject('products', {
    name: 'iPhone 15',
    price: 999.99,
    status: 'active',
    stock: 100,
    available_at: new Date(),
    image_url: 'https://example.com/iphone15.jpg'
  });
  console.log('✅ Product created:', newProduct);
} catch (error) {
  console.error('❌ Insert failed:', error);
}
```

### Экземпляр `storageService`
Готовый к использованию экземпляр сервиса:
```typescript
export const storageService = new StorageService(process.env.POSTGRES_URL || '');
```

---

## 🚀 Примеры использования

### 1. Подключение в API Route
```typescript
// app/api/database/route.ts
import { storageService } from '@/src/services/storage-service';
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    // Проверяем статус подключения
    if (storageService.getStatus() !== 'CONNECTED') {
      await storageService.connectToDb();
    }
    
    const tables = await storageService.getTableNames();
    
    return NextResponse.json({
      status: 'success',
      data: { tables },
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    return NextResponse.json(
      { status: 'error', message: error.message },
      { status: 500 }
    );
  }
}
```

### 2. Создание продукта
```typescript
// app/api/products/route.ts
import { storageService } from '@/src/services/storage-service';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const productData = await request.json();
    
    // Валидация данных
    if (!productData.name || !productData.price) {
      return NextResponse.json(
        { error: 'Name and price are required' },
        { status: 400 }
      );
    }
    
    // Обеспечиваем подключение
    if (storageService.getStatus() !== 'CONNECTED') {
      await storageService.connectToDb();
    }
    
    // Создаем продукт
    const newProduct = await storageService.setObject('products', {
      ...productData,
      available_at: new Date(),
      status: 'active'
    });
    
    return NextResponse.json({
      status: 'success',
      data: newProduct
    });
  } catch (error) {
    console.error('Product creation failed:', error);
    return NextResponse.json(
      { error: 'Failed to create product' },
      { status: 500 }
    );
  }
}
```

### 3. Server Component с загрузкой данных
```typescript
// app/dashboard/products/page.tsx
import { storageService } from '@/src/services/storage-service';

async function getProducts() {
  try {
    if (storageService.getStatus() !== 'CONNECTED') {
      await storageService.connectToDb();
    }
    
    return await storageService.sqlQuery(
      'goai_db',
      'products',
      'SELECT * FROM {tableName} ORDER BY available_at DESC'
    );
  } catch (error) {
    console.error('Failed to load products:', error);
    return [];
  }
}

export default async function ProductsPage() {
  const products = await getProducts();
  
  return (
    <div>
      <h1>Продукты ({products.length})</h1>
      {products.map(product => (
        <div key={product.id}>
          {product.name} - ${product.price}
        </div>
      ))}
    </div>
  );
}
```

---

## 🔒 Безопасность

### SQL Injection Protection
StorageService автоматически защищает от SQL-инъекций:

1. **Экранирование имен таблиц:**
```typescript
const safeTableName = tableName.replace(/[^a-zA-Z0-9_]/g, '');
```

2. **Параметризированные запросы:**
```typescript
const placeholders = values.map((_, index) => `$${index + 1}`).join(', ');
```

### Рекомендации по безопасности
- ✅ **Всегда используйте параметризированные запросы**
- ✅ **Валидируйте входные данные перед отправкой в БД**
- ✅ **Используйте HTTPS для production**
- ✅ **Ограничивайте права пользователя БД**

---

## 🛠️ Troubleshooting

### Частые проблемы и решения

#### 1. "Database is not connected"
**Проблема:** Попытка выполнить запрос без подключения

**Решение:**
```typescript
if (storageService.getStatus() !== 'CONNECTED') {
  await storageService.connectToDb();
}
```

#### 2. "Cannot find module 'pg'"
**Проблема:** Отсутствуют зависимости

**Решение:**
```bash
pnpm add pg @types/pg
```

#### 3. SSL Certificate issues
**Проблема:** Ошибки SSL сертификата

**Решение:**
```typescript
// В .env
POSTGRES_SSL=false
```

---

## 📋 Best Practices

### 1. Управление подключениями
```typescript
// ✅ Хорошо - проверка перед запросом
async function safeQuery() {
  if (storageService.getStatus() !== 'CONNECTED') {
    await storageService.connectToDb();
  }
  return await storageService.getTableNames();
}
```

### 2. Обработка ошибок
```typescript
try {
  const result = await storageService.setObject('products', data);
  return { success: true, data: result };
} catch (error) {
  console.error('Database operation failed:', error);
  return { 
    success: false, 
    error: 'Failed to save product'
  };
}
```

---

## 🗺️ Roadmap

### Запланированные улучшения

#### v2.0 - Enhanced Features
- [ ] **Connection Pooling** - расширенные настройки пула соединений
- [ ] **Query Builder** - типизированный конструктор запросов
- [ ] **Transactions Support** - поддержка транзакций
- [ ] **Caching Layer** - кэширование результатов запросов

#### v2.1 - Monitoring & Performance
- [ ] **Health Checks** - эндпоинты проверки состояния БД
- [ ] **Performance Metrics** - сбор метрик производительности
- [ ] **Connection Monitoring** - мониторинг активных соединений

---

*Последнее обновление: Июль 2024*  
*Автор: GoAI Development Team*
