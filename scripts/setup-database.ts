import postgres from 'postgres';
import fs from 'fs';
import path from 'path';

async function setupDatabase() {
  const connectionString = process.env.POSTGRES_URL || 'postgresql://goai_user:GggodbStrong0@194.54.158.82:5432/goai_db';
  
  console.log('🔧 Настройка базы данных...');
  console.log('🌐 Подключение к:', connectionString.replace(/\/\/.*@/, '//***@'));
  
  try {
    const client = postgres(connectionString);
    
    // Создание ENUM типа
    console.log('📝 Создаем ENUM тип status...');
    try {
      await client`CREATE TYPE status AS ENUM ('active', 'inactive', 'archived')`;
      console.log('✅ ENUM тип status создан');
    } catch (error) {
      if (error.message.includes('already exists')) {
        console.log('⚠️ ENUM тип status уже существует');
      } else {
        throw error;
      }
    }
    
    // Создание таблицы products
    console.log('📝 Создаем таблицу products...');
    try {
      await client`
        CREATE TABLE IF NOT EXISTS products (
          id SERIAL PRIMARY KEY,
          image_url TEXT NOT NULL,
          name TEXT NOT NULL,
          status status NOT NULL,
          price NUMERIC(10, 2) NOT NULL,
          stock INTEGER NOT NULL,
          available_at TIMESTAMP NOT NULL
        )
      `;
      console.log('✅ Таблица products создана');
    } catch (error) {
      console.log('⚠️ Ошибка создания таблицы:', error.message);
      throw error;
    }
    
    // Создание индексов
    console.log('📝 Создаем индексы...');
    try {
      await client`CREATE INDEX IF NOT EXISTS idx_products_name ON products(name)`;
      await client`CREATE INDEX IF NOT EXISTS idx_products_status ON products(status)`;
      await client`CREATE INDEX IF NOT EXISTS idx_products_price ON products(price)`;
      console.log('✅ Индексы созданы');
    } catch (error) {
      console.log('⚠️ Ошибка создания индексов:', error.message);
    }
    
    // Добавление комментариев
    console.log('📝 Добавляем комментарии...');
    try {
      await client`COMMENT ON TABLE products IS 'Таблица продуктов для GoAI-Backend'`;
      await client`COMMENT ON COLUMN products.id IS 'Уникальный идентификатор продукта'`;
      await client`COMMENT ON COLUMN products.image_url IS 'URL изображения продукта'`;
      await client`COMMENT ON COLUMN products.name IS 'Название продукта'`;
      await client`COMMENT ON COLUMN products.status IS 'Статус продукта (active, inactive, archived)'`;
      await client`COMMENT ON COLUMN products.price IS 'Цена продукта с точностью до 2 знаков после запятой'`;
      await client`COMMENT ON COLUMN products.stock IS 'Количество товара на складе'`;
      await client`COMMENT ON COLUMN products.available_at IS 'Дата и время доступности товара'`;
      console.log('✅ Комментарии добавлены');
    } catch (error) {
      console.log('⚠️ Ошибка добавления комментариев:', error.message);
    }
    
    // Проверка структуры таблицы
    console.log('🔍 Проверяем структуру таблицы...');
    const tableInfo = await client`
      SELECT column_name, data_type, is_nullable, column_default
      FROM information_schema.columns
      WHERE table_name = 'products'
      ORDER BY ordinal_position
    `;
    
    console.log('📊 Структура таблицы products:');
    tableInfo.forEach((col, index) => {
      console.log(`   ${index + 1}. ${col.column_name} (${col.data_type}) ${col.is_nullable === 'NO' ? 'NOT NULL' : 'NULL'}`);
    });
    
    await client.end();
    
    console.log('\n🎉 База данных настроена успешно!');
    return true;
    
  } catch (error) {
    console.error('❌ Ошибка настройки базы данных:', error);
    return false;
  }
}

setupDatabase().then(success => {
  console.log('\n' + '='.repeat(50));
  console.log(`🔧 Настройка базы данных: ${success ? '✅ ЗАВЕРШЕНА' : '❌ ОШИБКА'}`);
  console.log('='.repeat(50));
  process.exit(success ? 0 : 1);
}).catch(error => {
  console.error('❌ Критическая ошибка:', error);
  process.exit(1);
}); 