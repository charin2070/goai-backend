import postgres from 'postgres';

async function checkDatabase() {
  const connectionString = process.env.POSTGRES_URL || 'postgresql://goai_user:GggodbStrong0@194.54.158.82:5432/goai_db';
  
  console.log('🔍 Проверка подключения к базе данных...');
  console.log('🌐 Сервер:', connectionString.replace(/\/\/.*@/, '//***@'));
  
  try {
    const client = postgres(connectionString);
    
    // Проверка подключения
    console.log('📡 Проверяем подключение...');
    const result = await client`SELECT 1 as test`;
    console.log('✅ Подключение к базе данных успешно!');
    
    // Проверка существования таблицы products
    console.log('🔍 Проверяем таблицу products...');
    const tableCheck = await client`
      SELECT EXISTS (
        SELECT FROM information_schema.tables 
        WHERE table_schema = 'public' 
        AND table_name = 'products'
      );
    `;
    
    const tableExists = tableCheck[0].exists;
    console.log(`📊 Таблица products: ${tableExists ? '✅ Существует' : '❌ Не найдена'}`);
    
    let recordCount = 0;
    if (tableExists) {
      // Проверка данных в таблице
      console.log('📝 Проверяем данные в таблице products...');
      const countResult = await client`SELECT COUNT(*) as count FROM products`;
      recordCount = parseInt(countResult[0].count);
      console.log(`📈 Записей в таблице products: ${recordCount}`);
    }
    
    // Проверка ENUM типа
    console.log('🏷️ Проверяем ENUM тип status...');
    const enumCheck = await client`
      SELECT EXISTS (
        SELECT FROM pg_type 
        WHERE typname = 'status'
      );
    `;
    
    const enumExists = enumCheck[0].exists;
    console.log(`🔖 ENUM тип status: ${enumExists ? '✅ Существует' : '❌ Не найден'}`);
    
    await client.end();
    
    return {
      connected: true,
      tableExists,
      enumExists,
      recordCount
    };
    
  } catch (error) {
    console.error('❌ Ошибка подключения к БД:', error);
    return {
      connected: false,
      error: error.message
    };
  }
}

checkDatabase().then(result => {
  console.log('\n📋 РЕЗУЛЬТАТ ПРОВЕРКИ:');
  console.log('='.repeat(30));
  console.log(`Подключение: ${result.connected ? '✅ Успешно' : '❌ Ошибка'}`);
  if (result.connected) {
    console.log(`Таблица products: ${result.tableExists ? '✅ Существует' : '❌ Не найдена'}`);
    console.log(`ENUM status: ${result.enumExists ? '✅ Существует' : '❌ Не найден'}`);
    if (result.tableExists) {
      console.log(`Записей в БД: ${result.recordCount}`);
    }
  } else {
    console.log(`Ошибка: ${result.error}`);
  }
  console.log('='.repeat(30));
  process.exit(result.connected ? 0 : 1);
}).catch(error => {
  console.error('❌ Критическая ошибка:', error);
  process.exit(1);
}); 