#!/usr/bin/env tsx

import fs from 'fs';
import path from 'path';

interface Task {
  id: string;
  name: string;
  status: 'pending' | 'in_progress' | 'completed' | 'cancelled';
  progress: number;
  description: string;
}

interface Milestone {
  id: string;
  name: string;
  description: string;
  phase: string;
  progress: number;
  priority: string;
  estimatedDays: number;
  status: string;
  tasks: Task[];
  blockers?: string[];
  acceptance_criteria: string[];
  dependencies?: string[];
}

interface ProjectData {
  project: {
    name: string;
    version: string;
    startDate: string;
    targetDate: string;
    currentPhase: string;
    overallProgress: number;
  };
  milestones: Milestone[];
  metrics: {
    completion_percentage: number;
    estimated_completion_date: string;
    days_remaining: number;
  };
  risks: Array<{
    id: string;
    description: string;
    probability: string;
    impact: string;
    mitigation: string;
  }>;
  next_actions: string[];
}

class ProjectAnalyzer {
  private projectRoot: string;
  private roadmapPath: string;
  private projectData: ProjectData;

  constructor() {
    this.projectRoot = process.cwd();
    this.roadmapPath = path.join(this.projectRoot, 'project-roadmap.json');
    this.projectData = this.loadRoadmap();
  }

  private loadRoadmap(): ProjectData {
    try {
      const data = fs.readFileSync(this.roadmapPath, 'utf-8');
      return JSON.parse(data);
    } catch (error) {
      console.error('Ошибка чтения roadmap:', error);
      return this.getDefaultProjectData();
    }
  }

  private getDefaultProjectData(): ProjectData {
    return {
      project: {
        name: "GoAI-Backend",
        version: "1.0.0",
        startDate: "2025-01-01",
        targetDate: "2025-06-01",
        currentPhase: "Foundation",
        overallProgress: 0
      },
      milestones: [],
      metrics: {
        completion_percentage: 0,
        estimated_completion_date: "2025-06-01",
        days_remaining: 180
      },
      risks: [],
      next_actions: []
    };
  }

  public async analyzeProject(): Promise<void> {
    console.log('🔍 Начинаю анализ проекта GoAI-Backend...\n');

    // Анализируем различные аспекты проекта
    await this.analyzeDatabaseConnection();
    await this.analyzeAPIEndpoints();
    await this.analyzeUIComponents();
    await this.analyzeAuthentication();
    await this.analyzeFileStructure();
    
    // Обновляем прогресс
    this.updateMilestoneProgress();
    this.calculateOverallProgress();
    this.updateNextActions();
    
    // Сохраняем результаты
    this.saveRoadmap();
    
    console.log('✅ Анализ завершен. Roadmap обновлен.\n');
    this.printSummary();
  }

  private async analyzeDatabaseConnection(): Promise<void> {
    console.log('📊 Анализирую подключение к базе данных...');
    
    const dbFilePath = path.join(this.projectRoot, 'lib', 'db.ts');
    const dbFileExists = fs.existsSync(dbFilePath);
    
    if (dbFileExists) {
      const dbContent = fs.readFileSync(dbFilePath, 'utf-8');
      const hasPostgresConfig = dbContent.includes('postgres') && dbContent.includes('194.54.158.82');
      const hasProductsSchema = dbContent.includes('products') && dbContent.includes('status');
      
      // Обновляем задачи Foundation milestone
      const foundationMilestone = this.findMilestone('foundation');
      if (foundationMilestone) {
        this.updateTask(foundationMilestone, 'db_connection', {
          status: hasPostgresConfig ? 'completed' : 'in_progress',
          progress: hasPostgresConfig ? 100 : 60
        });
        
        this.updateTask(foundationMilestone, 'db_schema', {
          status: hasProductsSchema ? 'completed' : 'in_progress',
          progress: hasProductsSchema ? 100 : 70
        });
      }
    }
  }

  private async analyzeAPIEndpoints(): Promise<void> {
    console.log('🔌 Анализирую API endpoints...');
    
    const apiDir = path.join(this.projectRoot, 'app', 'api');
    
    if (fs.existsSync(apiDir)) {
      const apiRoutes = this.getApiRoutes(apiDir);
      
      const foundationMilestone = this.findMilestone('foundation');
      if (foundationMilestone) {
        const hasProductsApi = apiRoutes.includes('products');
        const hasSeedApi = apiRoutes.includes('seed');
        
        this.updateTask(foundationMilestone, 'api_endpoints', {
          status: (hasProductsApi && hasSeedApi) ? 'completed' : 'in_progress',
          progress: (hasProductsApi && hasSeedApi) ? 100 : 50
        });
      }
    }
  }

  private getApiRoutes(dir: string): string[] {
    const routes: string[] = [];
    
    const readDir = (currentDir: string) => {
      const items = fs.readdirSync(currentDir);
      
      for (const item of items) {
        const itemPath = path.join(currentDir, item);
        const stat = fs.statSync(itemPath);
        
        if (stat.isDirectory() && !item.startsWith('[')) {
          routes.push(item);
          readDir(itemPath);
        }
      }
    };
    
    readDir(dir);
    return routes;
  }

  private async analyzeUIComponents(): Promise<void> {
    console.log('🎨 Анализирую UI компоненты...');
    
    const uiPaths = [
      path.join(this.projectRoot, 'app', '(dashboard)'),
      path.join(this.projectRoot, 'src', 'components'),
      path.join(this.projectRoot, 'app', 'ui')
    ];
    
    let hasModernUI = false;
    
    for (const uiPath of uiPaths) {
      if (fs.existsSync(uiPath)) {
        const files = this.getAllFiles(uiPath, ['.tsx', '.jsx']);
        const hasCatalyst = files.some(file => 
          fs.readFileSync(file, 'utf-8').includes('catalyst') ||
          fs.readFileSync(file, 'utf-8').includes('Catalyst')
        );
        
        if (hasCatalyst || files.length > 5) {
          hasModernUI = true;
          break;
        }
      }
    }
    
    const foundationMilestone = this.findMilestone('foundation');
    if (foundationMilestone) {
      this.updateTask(foundationMilestone, 'basic_ui', {
        status: hasModernUI ? 'completed' : 'in_progress',
        progress: hasModernUI ? 100 : 60
      });
    }
  }

  private async analyzeAuthentication(): Promise<void> {
    console.log('🔐 Анализирую систему аутентификации...');
    
    const authFilePath = path.join(this.projectRoot, 'lib', 'auth.ts');
    const authRoutes = path.join(this.projectRoot, 'app', 'api', 'auth');
    
    const authMilestone = this.findMilestone('authentication');
    if (authMilestone) {
      const hasAuthConfig = fs.existsSync(authFilePath);
      const hasAuthRoutes = fs.existsSync(authRoutes);
      
      this.updateTask(authMilestone, 'nextauth_setup', {
        status: (hasAuthConfig && hasAuthRoutes) ? 'in_progress' : 'pending',
        progress: hasAuthConfig ? 40 : 0
      });
    }
  }

  private async analyzeFileStructure(): Promise<void> {
    console.log('📁 Анализирую структуру файлов...');
    
    const requiredDirectories = [
      'app/api',
      'lib',
      'src/components',
      'documentation'
    ];
    
    const missingDirectories = requiredDirectories.filter(dir => 
      !fs.existsSync(path.join(this.projectRoot, dir))
    );
    
    if (missingDirectories.length === 0) {
      console.log('✅ Все необходимые директории присутствуют');
    } else {
      console.log('⚠️  Отсутствующие директории:', missingDirectories);
    }
  }

  private getAllFiles(dir: string, extensions: string[]): string[] {
    const files: string[] = [];
    
    if (!fs.existsSync(dir)) return files;
    
    const items = fs.readdirSync(dir);
    
    for (const item of items) {
      const itemPath = path.join(dir, item);
      const stat = fs.statSync(itemPath);
      
      if (stat.isDirectory()) {
        files.push(...this.getAllFiles(itemPath, extensions));
      } else if (extensions.some(ext => item.endsWith(ext))) {
        files.push(itemPath);
      }
    }
    
    return files;
  }

  private findMilestone(id: string): Milestone | undefined {
    return this.projectData.milestones.find(m => m.id === id);
  }

  private updateTask(milestone: Milestone, taskId: string, updates: Partial<Task>): void {
    const task = milestone.tasks.find(t => t.id === taskId);
    if (task) {
      Object.assign(task, updates);
    }
  }

  private updateMilestoneProgress(): void {
    for (const milestone of this.projectData.milestones) {
      const totalTasks = milestone.tasks.length;
      if (totalTasks === 0) continue;
      
      const totalProgress = milestone.tasks.reduce((sum, task) => sum + task.progress, 0);
      milestone.progress = Math.round(totalProgress / totalTasks);
      
      // Обновляем статус milestone на основе прогресса
      if (milestone.progress === 100) {
        milestone.status = 'completed';
      } else if (milestone.progress > 0) {
        milestone.status = 'in_progress';
      } else {
        milestone.status = 'planned';
      }
    }
  }

  private calculateOverallProgress(): void {
    const totalMilestones = this.projectData.milestones.length;
    if (totalMilestones === 0) return;
    
    const totalProgress = this.projectData.milestones.reduce(
      (sum, milestone) => sum + milestone.progress, 0
    );
    
    this.projectData.project.overallProgress = Math.round(totalProgress / totalMilestones);
    this.projectData.metrics.completion_percentage = this.projectData.project.overallProgress;
  }

  private updateNextActions(): void {
    const nextActions: string[] = [];
    
    // Находим текущие блокеры
    for (const milestone of this.projectData.milestones) {
      if (milestone.status === 'in_progress' && milestone.blockers) {
        nextActions.push(...milestone.blockers);
      }
      
      // Находим следующие задачи для выполнения
      const nextTask = milestone.tasks.find(t => t.status === 'pending');
      if (nextTask && milestone.status === 'in_progress') {
        nextActions.push(`Начать: ${nextTask.name}`);
      }
    }
    
    // Общие рекомендации на основе текущего состояния
    const foundationMilestone = this.findMilestone('foundation');
    if (foundationMilestone && foundationMilestone.progress < 100) {
      nextActions.push('Завершить настройку базовой инфраструктуры');
    }
    
    this.projectData.next_actions = [...new Set(nextActions)].slice(0, 5);
  }

  private saveRoadmap(): void {
    try {
      const jsonData = JSON.stringify(this.projectData, null, 2);
      fs.writeFileSync(this.roadmapPath, jsonData, 'utf-8');
      console.log('💾 Roadmap сохранен в project-roadmap.json');
    } catch (error) {
      console.error('❌ Ошибка сохранения roadmap:', error);
    }
  }

  private printSummary(): void {
    console.log('📊 ИТОГОВЫЙ ОТЧЕТ:');
    console.log('=' .repeat(50));
    console.log(`Общий прогресс: ${this.projectData.project.overallProgress}%`);
    console.log(`Текущая фаза: ${this.projectData.project.currentPhase}`);
    console.log(`Активных milestone'ов: ${this.projectData.milestones.filter(m => m.status === 'in_progress').length}`);
    console.log(`Завершенных milestone'ов: ${this.projectData.milestones.filter(m => m.status === 'completed').length}`);
    
    console.log('\n🎯 СЛЕДУЮЩИЕ ДЕЙСТВИЯ:');
    this.projectData.next_actions.forEach((action, index) => {
      console.log(`${index + 1}. ${action}`);
    });
    
    console.log('\n📈 ПРОГРЕСС ПО MILESTONE\'АМ:');
    this.projectData.milestones.forEach(milestone => {
      const statusEmoji = milestone.status === 'completed' ? '✅' : 
                         milestone.status === 'in_progress' ? '🟡' : '⚪';
      console.log(`${statusEmoji} ${milestone.name}: ${milestone.progress}%`);
    });
  }
}

// Запуск анализатора
async function main() {
  const analyzer = new ProjectAnalyzer();
  await analyzer.analyzeProject();
}

if (require.main === module) {
  main().catch(console.error);
}

export { ProjectAnalyzer };
