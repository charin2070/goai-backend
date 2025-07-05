import postgres from 'postgres';

async function seedDatabase() {
  const connectionString = process.env.POSTGRES_URL || 'postgresql://goai_user:GggodbStrong0@194.54.158.82:5432/goai_db';
  
  console.log('🌱 Заполнение базы данных тестовыми данными...');
  
  try {
    const client = postgres(connectionString);
    
    // Проверяем количество существующих записей
    const existingCount = await client`SELECT COUNT(*) as count FROM products`;
    const count = parseInt(existingCount[0].count);
    
    if (count > 0) {
      console.log(`⚠️ В таблице уже есть ${count} записей. Очищаем...`);
      await client`DELETE FROM products`;
      console.log('✅ Таблица очищена');
    }
    
    console.log('📝 Добавляем тестовые продукты...');
    
    const testProducts = [
      {
        image_url: 'https://uwja77bygk2kgfqe.public.blob.vercel-storage.com/smartphone-gaPvyZW6aww0IhD3dOpaU6gBGILtcJ.webp',
        name: 'Smartphone X Pro',
        status: 'active',
        price: '999.00',
        stock: 150,
        available_at: new Date()
      },
      {
        image_url: 'https://uwja77bygk2kgfqe.public.blob.vercel-storage.com/earbuds-3rew4JGdIK81KNlR8Edr8NBBhFTOtX.webp',
        name: 'Wireless Earbuds Ultra',
        status: 'active',
        price: '199.00',
        stock: 300,
        available_at: new Date()
      },
      {
        image_url: 'https://uwja77bygk2kgfqe.public.blob.vercel-storage.com/laptop-9bgUhjY491hkxiMDeSgqb9R5I3lHNL.webp',
        name: 'Gaming Laptop Pro',
        status: 'active',
        price: '1299.00',
        stock: 75,
        available_at: new Date()
      },
      {
        image_url: 'https://uwja77bygk2kgfqe.public.blob.vercel-storage.com/watch-S2VeARK6sEM9QFg4yNQNjHFaHc3sXv.webp',
        name: 'Smartwatch Elite',
        status: 'inactive',
        price: '249.00',
        stock: 250,
        available_at: new Date()
      },
      {
        image_url: 'https://uwja77bygk2kgfqe.public.blob.vercel-storage.com/speaker-4Zk0Ctx5AvxnwNNTFWVK4Gtpru4YEf.webp',
        name: 'Bluetooth Speaker Max',
        status: 'archived',
        price: '99.00',
        stock: 400,
        available_at: new Date()
      }
    ];
    
    for (const product of testProducts) {
      await client`
        INSERT INTO products (image_url, name, status, price, stock, available_at)
        VALUES (${product.image_url}, ${product.name}, ${product.status}, ${product.price}, ${product.stock}, ${product.available_at})
      `;
      console.log(`✅ Добавлен: ${product.name} [${product.status}]`);
    }
    
    // Проверяем результат
    const finalCount = await client`SELECT COUNT(*) as count FROM products`;
    const newCount = parseInt(finalCount[0].count);
    
    console.log(`🎉 Успешно добавлено ${newCount} продуктов!`);
    
    await client.end();
    return true;
    
  } catch (error) {
    console.error('❌ Ошибка заполнения БД:', error);
    return false;
  }
}

seedDatabase().then(success => {
  console.log('\n' + '='.repeat(50));
  console.log(`🌱 Заполнение БД: ${success ? '✅ ЗАВЕРШЕНО' : '❌ ОШИБКА'}`);
  console.log('='.repeat(50));
  process.exit(success ? 0 : 1);
}).catch(error => {
  console.error('❌ Критическая ошибка:', error);
  process.exit(1);
}); 