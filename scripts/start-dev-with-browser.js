#!/usr/bin/env node

const { spawn, exec } = require('child_process');
const opener = require('opener');

console.log('🚀 Starting GoAI-Backend development server...');

// Завершаем процесс на порту 3000
console.log('⏹️  Killing process on port 3000...');
exec('npx kill-port 3000', (error) => {
  if (error) {
    console.log('ℹ️  No process found on port 3000');
  } else {
    console.log('✅ Process on port 3000 killed');
  }
  
  // Запускаем сервер разработки
  console.log('🔧 Starting Next.js development server...');
  const server = spawn('pnpm', ['run', 'dev:direct'], {
    stdio: 'inherit',
    shell: true
  });

  // Простая задержка и открытие браузера
  console.log('⏳ Waiting 15 seconds for server to be ready...');
  setTimeout(() => {
    console.log('🌐 Opening browser at http://localhost:3000');
    opener('http://localhost:3000');
    console.log('✅ Browser should open now!');
    console.log('📱 Dashboard: http://localhost:3000/project-management');
    console.log('🛑 Press Ctrl+C to stop the server');
  }, 15000);

  // Обрабатываем сигналы для корректного завершения
  process.on('SIGINT', () => {
    console.log('\n🛑 Shutting down development server...');
    server.kill('SIGINT');
    process.exit(0);
  });

  process.on('SIGTERM', () => {
    server.kill('SIGTERM');
    process.exit(0);
  });
}); 