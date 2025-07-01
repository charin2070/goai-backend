// Скрипт для тестирования API endpoints
// Запуск: npx ts-node scripts/test-api.ts

const API_BASE = 'http://localhost:3000/api';

// Функция для выполнения HTTP запросов
async function makeRequest(url: string, options: RequestInit = {}) {
  try {
    const response = await fetch(url, {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      ...options,
    });
    
    const data = await response.json();
    return { status: response.status, data };
  } catch (error) {
    console.error('Ошибка запроса:', error);
    return { status: 500, data: { error: 'Network error' } };
  }
}

async function testAPI() {
  console.log('🚀 Начинаем тестирование API endpoints...\n');

  // 1. Тест GET /api/issues (получение всех задач)
  console.log('1️⃣ Тестируем GET /api/issues');
  const getAllResult = await makeRequest(`${API_BASE}/issues`);
  console.log(`   Статус: ${getAllResult.status}`);
  console.log(`   Данные:`, getAllResult.data);
  console.log('');

  // 2. Тест POST /api/issues (создание новой задачи)
  console.log('2️⃣ Тестируем POST /api/issues');
  const testIssue = {
    summary: 'Тестовая задача из API',
    description: 'Это тестовая задача, созданная через API для проверки функциональности',
    priority: 'High',
    status: 'Open',
    type: 'Bug',
    assignee: 'test-user'
  };
  
  const createResult = await makeRequest(`${API_BASE}/issues`, {
    method: 'POST',
    body: JSON.stringify(testIssue),
  });
  console.log(`   Статус: ${createResult.status}`);
  console.log(`   Данные:`, createResult.data);
  
  const createdIssueId = createResult.data?.data?.id;
  console.log('');

  if (createdIssueId) {
    // 3. Тест GET /api/issues/[id] (получение конкретной задачи)
    console.log('3️⃣ Тестируем GET /api/issues/[id]');
    const getOneResult = await makeRequest(`${API_BASE}/issues/${createdIssueId}`);
    console.log(`   Статус: ${getOneResult.status}`);
    console.log(`   Данные:`, getOneResult.data);
    console.log('');

    // 4. Тест PUT /api/issues/[id] (обновление задачи)
    console.log('4️⃣ Тестируем PUT /api/issues/[id]');
    const updateData = {
      summary: 'ОБНОВЛЕННАЯ тестовая задача',
      status: 'In Progress',
      priority: 'Medium'
    };
    
    const updateResult = await makeRequest(`${API_BASE}/issues/${createdIssueId}`, {
      method: 'PUT',
      body: JSON.stringify(updateData),
    });
    console.log(`   Статус: ${updateResult.status}`);
    console.log(`   Данные:`, updateResult.data);
    console.log('');

    // 5. Тест DELETE /api/issues/[id] (удаление задачи)
    console.log('5️⃣ Тестируем DELETE /api/issues/[id]');
    const deleteResult = await makeRequest(`${API_BASE}/issues/${createdIssueId}`, {
      method: 'DELETE',
    });
    console.log(`   Статус: ${deleteResult.status}`);
    console.log(`   Данные:`, deleteResult.data);
    console.log('');
  }

  // 6. Тест ошибки 404 (несуществующий ID)
  console.log('6️⃣ Тестируем ошибку 404 (несуществующий ID)');
  const notFoundResult = await makeRequest(`${API_BASE}/issues/99999`);
  console.log(`   Статус: ${notFoundResult.status}`);
  console.log(`   Данные:`, notFoundResult.data);
  console.log('');

  // 7. Тест ошибки валидации (POST без обязательного поля)
  console.log('7️⃣ Тестируем ошибку валидации (POST без summary)');
  const invalidIssue = {
    description: 'Задача без summary - должна вызвать ошибку',
    priority: 'Low'
  };
  
  const validationErrorResult = await makeRequest(`${API_BASE}/issues`, {
    method: 'POST',
    body: JSON.stringify(invalidIssue),
  });
  console.log(`   Статус: ${validationErrorResult.status}`);
  console.log(`   Данные:`, validationErrorResult.data);
  console.log('');

  console.log('✅ Тестирование API завершено!');
}

// Проверяем, что сервер запущен, и запускаем тесты
async function checkServerAndRunTests() {
  try {
    const healthCheck = await fetch('http://localhost:3000/api/uptime');
    if (healthCheck.ok) {
      await testAPI();
    } else {
      console.log('❌ Сервер не отвечает. Убедитесь, что запущен npm run dev');
    }
  } catch (error) {
    console.log('❌ Сервер не запущен. Запустите npm run dev в другом терминале');
  }
}

checkServerAndRunTests(); 