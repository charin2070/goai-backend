'use client';

import { useEffect, useState } from 'react';
import { 
  CheckCircleIcon, 
  ClockIcon, 
  ExclamationTriangleIcon,
  ChartBarIcon,
  CalendarDaysIcon,
  CodeBracketIcon,
  ShieldCheckIcon,
  DocumentTextIcon,
  ChevronRightIcon,
  PlayIcon,
  XMarkIcon,
  CpuChipIcon,
  LightBulbIcon,
  RocketLaunchIcon,
  BugAntIcon
} from '@heroicons/react/24/outline';

interface ProjectManagement {
  project: {
    name: string;
    description: string;
    version: string;
    lastUpdated: string;
    overallProgress: number;
  };
  milestones: Array<{
    id: string;
    name: string;
    progress: number;
    status: string;
    priority: string;
    dueDate: string;
    tasks: Array<{
      id: string;
      name: string;
      status: string;
      progress: number;
      description: string;
      blockers?: string[];
    }>;
  }>;
  criticalTasks: Array<{
    id: string;
    name: string;
    priority: string;
    description: string;
    estimatedTime: string;
    blockedBy: string[];
    blocking: string[];
  }>;
  codeQuality: {
    coverage: number;
    maintainability: number;
    performance: number;
    security: number;
    documentation: number;
  };
  recommendations: Array<{
    category: string;
    priority: string;
    title: string;
    description: string;
    actions: string[];
  }>;
  nextSteps: Array<{
    step: number;
    title: string;
    description: string;
    estimatedTime: string;
    priority: string;
  }>;
  analytics: {
    totalTasks: number;
    completedTasks: number;
    inProgressTasks: number;
    blockedTasks: number;
    estimatedProjectCompletion: string;
    riskFactors: string[];
  };
  aiAssistant: {
    lastAnalysis: string;
    sessionContext: {
      currentFocus: string;
      recentProgress: string[];
      knownIssues: string[];
      developerSkillLevel: string;
    };
    nextSessionPlan: {
      priority: string;
      immediateActions: string[];
      subsequentActions: string[];
      learningObjectives: string[];
    };
    codebaseInsights: {
      strengths: string[];
      weaknesses: string[];
      technicalDebtAreas: string[];
    };
  };
}

export default function ProjectDashboard() {
  const [data, setData] = useState<ProjectManagement | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadData = async () => {
    try {
      setLoading(true);
      // Читаем данные из project-management.json
      const response = await fetch('/project-management/project-management.json');
      if (!response.ok) {
        throw new Error('Failed to load project management data');
      }
      const projectData = await response.json();
      setData(projectData);
      setError(null);
    } catch (err) {
      console.error('Error loading data:', err);
      setError(err instanceof Error ? err.message : 'Unknown error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const getStatusColor = (status: string) => {
    const colors = {
      'completed': 'bg-green-50 text-green-700 ring-green-200',
      'in_progress': 'bg-blue-50 text-blue-700 ring-blue-200',
      'not_started': 'bg-gray-50 text-gray-700 ring-gray-200',
      'planning': 'bg-purple-50 text-purple-700 ring-purple-200',
      'near_completion': 'bg-emerald-50 text-emerald-700 ring-emerald-200'
    };
    return colors[status as keyof typeof colors] || 'bg-gray-50 text-gray-700 ring-gray-200';
  };

  const getPriorityColor = (priority: string) => {
    const colors = {
      'critical': 'bg-red-50 text-red-700 ring-red-200',
      'high': 'bg-orange-50 text-orange-700 ring-orange-200', 
      'medium': 'bg-yellow-50 text-yellow-700 ring-yellow-200',
      'low': 'bg-green-50 text-green-700 ring-green-200'
    };
    return colors[priority as keyof typeof colors] || 'bg-gray-50 text-gray-700 ring-gray-200';
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Загрузка dashboard...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center max-w-md mx-auto">
          <ExclamationTriangleIcon className="mx-auto h-12 w-12 text-red-500" />
          <h3 className="mt-2 text-sm font-semibold text-gray-900">Ошибка загрузки</h3>
          <p className="mt-1 text-sm text-gray-500">{error}</p>
          <div className="mt-6">
            <button
              onClick={loadData}
              className="inline-flex items-center rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500"
            >
              Попробовать снова
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (!data) return null;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 justify-between items-center">
            <div className="flex items-center">
              <h1 className="text-xl font-semibold text-gray-900">{data.project.name}</h1>
              <span className="ml-3 inline-flex items-center rounded-md bg-indigo-50 px-2 py-1 text-xs font-medium text-indigo-700 ring-1 ring-inset ring-indigo-700/10">
                {data.project.version}
              </span>
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-sm text-gray-500">
                Обновлено: {new Date(data.project.lastUpdated).toLocaleDateString('ru')}
              </span>
              <button
                onClick={loadData}
                className="inline-flex items-center rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500"
              >
                Обновить
              </button>
            </div>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
        {/* Project Overview */}
        <div className="mb-8">
          <h2 className="text-base font-semibold leading-6 text-gray-900 mb-4">Обзор проекта</h2>
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
            <div className="overflow-hidden rounded-lg bg-white px-4 py-5 shadow">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <ChartBarIcon className="h-6 w-6 text-indigo-600" />
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 truncate">Общий прогресс</dt>
                    <dd className="flex items-baseline">
                      <div className="text-2xl font-semibold text-gray-900">{data.project.overallProgress}%</div>
                    </dd>
                  </dl>
                </div>
              </div>
              <div className="mt-3">
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-indigo-600 h-2 rounded-full transition-all duration-300"
                    style={{ width: `${data.project.overallProgress}%` }}
                  ></div>
                </div>
              </div>
            </div>

            <div className="overflow-hidden rounded-lg bg-white px-4 py-5 shadow">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <CheckCircleIcon className="h-6 w-6 text-green-600" />
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 truncate">Завершено</dt>
                    <dd className="text-2xl font-semibold text-gray-900">{data.analytics.completedTasks}</dd>
                  </dl>
                </div>
              </div>
            </div>

            <div className="overflow-hidden rounded-lg bg-white px-4 py-5 shadow">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <PlayIcon className="h-6 w-6 text-blue-600" />
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 truncate">В работе</dt>
                    <dd className="text-2xl font-semibold text-gray-900">{data.analytics.inProgressTasks}</dd>
                  </dl>
                </div>
              </div>
            </div>

            <div className="overflow-hidden rounded-lg bg-white px-4 py-5 shadow">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <XMarkIcon className="h-6 w-6 text-red-600" />
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 truncate">Заблокировано</dt>
                    <dd className="text-2xl font-semibold text-gray-900">{data.analytics.blockedTasks}</dd>
                  </dl>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Critical Tasks */}
        <div className="mb-8">
          <h2 className="text-base font-semibold leading-6 text-gray-900 mb-4">Критические задачи</h2>
          <div className="bg-white shadow overflow-hidden sm:rounded-md">
            <ul className="divide-y divide-gray-200">
              {data.criticalTasks.map((task) => (
                <li key={task.id} className="px-6 py-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <ExclamationTriangleIcon className="h-5 w-5 text-red-500 mr-3" />
                      <div>
                        <p className="text-sm font-medium text-gray-900">{task.name}</p>
                        <p className="text-sm text-gray-500">{task.description}</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-3">
                      <span className={`inline-flex items-center rounded-md px-2 py-1 text-xs font-medium ring-1 ring-inset ${getPriorityColor(task.priority)}`}>
                        {task.priority}
                      </span>
                      <span className="text-sm text-gray-500">{task.estimatedTime}</span>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Milestones */}
          <div>
            <h2 className="text-base font-semibold leading-6 text-gray-900 mb-4">Milestone'ы</h2>
            <div className="space-y-4">
              {data.milestones.map((milestone) => (
                <div key={milestone.id} className="bg-white rounded-lg shadow p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-medium text-gray-900">{milestone.name}</h3>
                    <span className={`inline-flex items-center rounded-md px-2 py-1 text-xs font-medium ring-1 ring-inset ${getStatusColor(milestone.status)}`}>
                      {milestone.status}
                    </span>
                  </div>
                  <div className="mb-4">
                    <div className="flex justify-between text-sm text-gray-600 mb-1">
                      <span>Прогресс</span>
                      <span>{milestone.progress}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-indigo-600 h-2 rounded-full transition-all duration-300"
                        style={{ width: `${milestone.progress}%` }}
                      ></div>
                    </div>
                  </div>
                  <div className="flex justify-between items-center text-sm text-gray-500">
                    <span>Дедлайн: {new Date(milestone.dueDate).toLocaleDateString('ru')}</span>
                    <span className={`inline-flex items-center rounded-md px-2 py-1 text-xs font-medium ring-1 ring-inset ${getPriorityColor(milestone.priority)}`}>
                      {milestone.priority}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Code Quality */}
          <div>
            <h2 className="text-base font-semibold leading-6 text-gray-900 mb-4">Качество кода</h2>
            <div className="bg-white rounded-lg shadow p-6">
              <div className="space-y-4">
                {Object.entries(data.codeQuality).map(([key, value]) => {
                  const icons = {
                    coverage: CodeBracketIcon,
                    maintainability: ShieldCheckIcon,
                    performance: ChartBarIcon,
                    security: ShieldCheckIcon,
                    documentation: DocumentTextIcon
                  };
                  const Icon = icons[key as keyof typeof icons] || CodeBracketIcon;
                  
                  return (
                    <div key={key} className="flex items-center justify-between">
                      <div className="flex items-center">
                        <Icon className="h-5 w-5 text-gray-400 mr-3" />
                        <span className="text-sm font-medium text-gray-900 capitalize">
                          {key === 'coverage' ? 'Покрытие' : 
                           key === 'maintainability' ? 'Поддерживаемость' :
                           key === 'performance' ? 'Производительность' :
                           key === 'security' ? 'Безопасность' : 'Документация'}
                        </span>
                      </div>
                      <div className="flex items-center">
                        <span className="text-sm font-medium text-gray-900 mr-3">{value}%</span>
                        <div className="w-20 bg-gray-200 rounded-full h-2">
                          <div 
                            className={`h-2 rounded-full ${value >= 80 ? 'bg-green-500' : value >= 60 ? 'bg-yellow-500' : 'bg-red-500'}`}
                            style={{ width: `${value}%` }}
                          ></div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>

        {/* Next Steps */}
        <div className="mt-8">
          <h2 className="text-base font-semibold leading-6 text-gray-900 mb-4">Следующие шаги</h2>
          <div className="bg-white shadow overflow-hidden sm:rounded-md">
            <ul className="divide-y divide-gray-200">
              {data.nextSteps.map((step) => (
                <li key={step.step} className="px-6 py-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <div className="flex-shrink-0">
                        <div className="flex h-6 w-6 items-center justify-center rounded-full bg-indigo-600 text-xs font-medium text-white">
                          {step.step}
                        </div>
                      </div>
                      <div className="ml-4">
                        <p className="text-sm font-medium text-gray-900">{step.title}</p>
                        <p className="text-sm text-gray-500">{step.description}</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-3">
                      <span className={`inline-flex items-center rounded-md px-2 py-1 text-xs font-medium ring-1 ring-inset ${getPriorityColor(step.priority)}`}>
                        {step.priority}
                      </span>
                      <span className="text-sm text-gray-500">{step.estimatedTime}</span>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Recommendations */}
        <div className="mt-8">
          <h2 className="text-base font-semibold leading-6 text-gray-900 mb-4">Рекомендации</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {data.recommendations.map((rec, index) => (
              <div key={index} className="bg-white rounded-lg shadow p-6">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-lg font-medium text-gray-900">{rec.title}</h3>
                  <span className={`inline-flex items-center rounded-md px-2 py-1 text-xs font-medium ring-1 ring-inset ${getPriorityColor(rec.priority)}`}>
                    {rec.priority}
                  </span>
                </div>
                <p className="text-sm text-gray-600 mb-4">{rec.description}</p>
                <div className="space-y-2">
                  {rec.actions.map((action, actionIndex) => (
                    <div key={actionIndex} className="flex items-center text-sm text-gray-600">
                      <ChevronRightIcon className="h-4 w-4 text-gray-400 mr-2" />
                      {action}
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* AI Assistant Section */}
        <div className="mt-8">
          <h2 className="text-base font-semibold leading-6 text-gray-900 mb-4 flex items-center">
            <CpuChipIcon className="h-5 w-5 text-indigo-600 mr-2" />
            AI Ассистент - Контекст сессии
          </h2>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Session Context */}
            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="text-lg font-medium text-gray-900 mb-4 flex items-center">
                <CpuChipIcon className="h-5 w-5 text-blue-600 mr-2" />
                Контекст сессии
              </h3>
              <div className="space-y-4">
                <div>
                  <p className="text-sm font-medium text-gray-600">Текущий фокус:</p>
                  <p className="text-sm text-gray-900">{data.aiAssistant.sessionContext.currentFocus}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-600">Уровень разработчика:</p>
                  <p className="text-sm text-gray-900">{data.aiAssistant.sessionContext.developerSkillLevel}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-600">Последний анализ:</p>
                  <p className="text-sm text-gray-900">{new Date(data.aiAssistant.lastAnalysis).toLocaleString('ru')}</p>
                </div>
              </div>
            </div>

            {/* Next Session Plan */}
            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="text-lg font-medium text-gray-900 mb-4 flex items-center">
                <RocketLaunchIcon className="h-5 w-5 text-green-600 mr-2" />
                План следующей сессии
              </h3>
              <div className="space-y-4">
                <div>
                  <p className="text-sm font-medium text-gray-600">Приоритет:</p>
                  <span className={`inline-flex items-center rounded-md px-2 py-1 text-xs font-medium ring-1 ring-inset ${getPriorityColor(data.aiAssistant.nextSessionPlan.priority)}`}>
                    {data.aiAssistant.nextSessionPlan.priority}
                  </span>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-600 mb-2">Немедленные действия:</p>
                  <ul className="space-y-1">
                    {data.aiAssistant.nextSessionPlan.immediateActions.map((action, index) => (
                      <li key={index} className="flex items-center text-sm text-gray-600">
                        <ChevronRightIcon className="h-4 w-4 text-gray-400 mr-2" />
                        {action}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-6 grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Recent Progress */}
            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="text-lg font-medium text-gray-900 mb-4 flex items-center">
                <CheckCircleIcon className="h-5 w-5 text-emerald-600 mr-2" />
                Недавний прогресс
              </h3>
              <ul className="space-y-2">
                {data.aiAssistant.sessionContext.recentProgress.map((progress, index) => (
                  <li key={index} className="flex items-start text-sm text-gray-600">
                    <div className="flex-shrink-0 w-2 h-2 bg-emerald-400 rounded-full mt-2 mr-3"></div>
                    {progress}
                  </li>
                ))}
              </ul>
            </div>

            {/* Known Issues */}
            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="text-lg font-medium text-gray-900 mb-4 flex items-center">
                <BugAntIcon className="h-5 w-5 text-red-600 mr-2" />
                Известные проблемы
              </h3>
              <ul className="space-y-2">
                {data.aiAssistant.sessionContext.knownIssues.map((issue, index) => (
                  <li key={index} className="flex items-start text-sm text-gray-600">
                    <div className="flex-shrink-0 w-2 h-2 bg-red-400 rounded-full mt-2 mr-3"></div>
                    {issue}
                  </li>
                ))}
              </ul>
            </div>

            {/* Learning Objectives */}
            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="text-lg font-medium text-gray-900 mb-4 flex items-center">
                <LightBulbIcon className="h-5 w-5 text-yellow-600 mr-2" />
                Цели обучения
              </h3>
              <ul className="space-y-2">
                {data.aiAssistant.nextSessionPlan.learningObjectives.map((objective, index) => (
                  <li key={index} className="flex items-start text-sm text-gray-600">
                    <div className="flex-shrink-0 w-2 h-2 bg-yellow-400 rounded-full mt-2 mr-3"></div>
                    {objective}
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Codebase Insights */}
          <div className="mt-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Анализ кодовой базы</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-green-50 rounded-lg p-4">
                <h4 className="font-medium text-green-900 mb-3">Сильные стороны</h4>
                <ul className="space-y-1">
                  {data.aiAssistant.codebaseInsights.strengths.map((strength, index) => (
                    <li key={index} className="text-sm text-green-800">• {strength}</li>
                  ))}
                </ul>
              </div>
              <div className="bg-red-50 rounded-lg p-4">
                <h4 className="font-medium text-red-900 mb-3">Слабые места</h4>
                <ul className="space-y-1">
                  {data.aiAssistant.codebaseInsights.weaknesses.map((weakness, index) => (
                    <li key={index} className="text-sm text-red-800">• {weakness}</li>
                  ))}
                </ul>
              </div>
              <div className="bg-yellow-50 rounded-lg p-4">
                <h4 className="font-medium text-yellow-900 mb-3">Технический долг</h4>
                <ul className="space-y-1">
                  {data.aiAssistant.codebaseInsights.technicalDebtAreas.map((debt, index) => (
                    <li key={index} className="text-sm text-yellow-800">• {debt}</li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}