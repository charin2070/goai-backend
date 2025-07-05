import postgres from 'postgres';

async function fixProductsTable() {
  const connectionString = process.env.POSTGRES_URL || 'postgresql://goai_user:GggodbStrong0@194.54.158.82:5432/goai_db';
  
  console.log('🔧 Исправление структуры таблицы products...');
  console.log('🌐 Подключение к:', connectionString.replace(/\/\/.*@/, '//***@'));
  
  try {
    const client = postgres(connectionString);
    
    // Проверяем существование столбца status
    console.log('🔍 Проверяем существование столбца status...');
    const columnExists = await client`
      SELECT EXISTS (
        SELECT FROM information_schema.columns 
        WHERE table_name = 'products' 
        AND column_name = 'status'
      );
    `;
    
    if (!columnExists[0].exists) {
      console.log('📝 Добавляем столбец status...');
      await client`ALTER TABLE products ADD COLUMN status status NOT NULL DEFAULT 'active'`;
      console.log('✅ Столбец status добавлен');
    } else {
      console.log('⚠️ Столбец status уже существует');
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
    
    // Проверка финальной структуры таблицы
    console.log('🔍 Проверяем финальную структуру таблицы...');
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
    
    console.log('\n🎉 Структура таблицы исправлена!');
    return true;
    
  } catch (error) {
    console.error('❌ Ошибка исправления таблицы:', error);
    return false;
  }
}

fixProductsTable().then(success => {
  console.log('\n' + '='.repeat(50));
  console.log(`🔧 Исправление таблицы: ${success ? '✅ ЗАВЕРШЕНА' : '❌ ОШИБКА'}`);
  console.log('='.repeat(50));
  process.exit(success ? 0 : 1);
}).catch(error => {
  console.error('❌ Критическая ошибка:', error);
  process.exit(1);
}); 