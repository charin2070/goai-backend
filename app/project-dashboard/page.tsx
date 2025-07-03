'use client';

import { useEffect, useState } from 'react';

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

export default function ProjectDashboard() {
  const [projectData, setProjectData] = useState<ProjectData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadProjectData = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/roadmap');
      if (!response.ok) {
        throw new Error('Failed to fetch roadmap data');
      }
      const data = await response.json();
      setProjectData(data);
      setError(null);
    } catch (err) {
      console.error('Error loading project data:', err);
      setError(err instanceof Error ? err.message : 'Unknown error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadProjectData();
  }, []);

  const getStatusColor = (status: string) => {
    const colors = {
      'completed': 'bg-green-100 text-green-800',
      'in_progress': 'bg-blue-100 text-blue-800',
      'planned': 'bg-gray-100 text-gray-800',
      'pending': 'bg-yellow-100 text-yellow-800'
    };
    return colors[status as keyof typeof colors] || 'bg-gray-100 text-gray-800';
  };

  const getPriorityColor = (priority: string) => {
    const colors = {
      'critical': 'bg-red-100 text-red-800',
      'high': 'bg-orange-100 text-orange-800',
      'medium': 'bg-yellow-100 text-yellow-800',
      'low': 'bg-green-100 text-green-800'
    };
    return colors[priority as keyof typeof colors] || 'bg-gray-100 text-gray-800';
  };

  const getRiskColor = (impact: string) => {
    const colors = {
      'high': 'border-red-500',
      'medium': 'border-yellow-500', 
      'low': 'border-green-500'
    };
    return colors[impact as keyof typeof colors] || 'border-gray-500';
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Загрузка данных проекта...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="text-red-600 text-xl mb-4">⚠️ Ошибка загрузки</div>
          <p className="text-gray-600 mb-4">{error}</p>
          <button 
            onClick={loadProjectData}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
          >
            Попробовать снова
          </button>
        </div>
      </div>
    );
  }

  if (!projectData) {
    return null;
  }

  const activeTasks = projectData.milestones.reduce((count, milestone) => {
    return count + milestone.tasks.filter(task => 
      task.status === 'in_progress' || task.status === 'pending'
    ).length;
  }, 0);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div className="flex items-center">
              <h1 className="text-2xl font-bold text-gray-900">GoAI-Backend Dashboard</h1>
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-sm text-gray-500">
                Обновлено: {new Date().toLocaleString('ru')}
              </span>
              <button 
                onClick={loadProjectData}
                className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
              >
                🔄 Обновить
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Project Overview Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-gradient-to-r from-blue-500 to-purple-600 text-white p-6 rounded-xl">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="text-2xl">📊</div>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium opacity-90">Общий прогресс</p>
                <p className="text-2xl font-bold">{projectData.project.overallProgress}%</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="text-2xl text-green-600">✅</div>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Активные задачи</p>
                <p className="text-2xl font-bold text-gray-900">{activeTasks}</p>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="text-2xl text-orange-600">📅</div>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Дней до завершения</p>
                <p className="text-2xl font-bold text-gray-900">{projectData.metrics.days_remaining}</p>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="text-2xl text-purple-600">🎯</div>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Milestone'ы</p>
                <p className="text-2xl font-bold text-gray-900">{projectData.milestones.length}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Milestones Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          <div className="space-y-4">
            <h2 className="text-lg font-semibold text-gray-900">Milestone'ы проекта</h2>
            {projectData.milestones.map((milestone) => (
              <div key={milestone.id} className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 hover:shadow-md transition-shadow">
                <div className="flex justify-between items-start mb-4">
                  <h3 className="text-lg font-semibold text-gray-900">{milestone.name}</h3>
                  <div className="flex space-x-2">
                    <span className={`text-xs px-2 py-1 rounded-full font-medium ${getStatusColor(milestone.status)}`}>
                      {milestone.status}
                    </span>
                    <span className={`text-xs px-2 py-1 rounded-full font-medium ${getPriorityColor(milestone.priority)}`}>
                      {milestone.priority}
                    </span>
                  </div>
                </div>
                <p className="text-gray-600 mb-4">{milestone.description}</p>
                <div className="mb-4">
                  <div className="flex justify-between text-sm text-gray-600 mb-1">
                    <span>Прогресс</span>
                    <span>{milestone.progress}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-blue-600 h-2 rounded-full transition-all duration-500" 
                      style={{ width: `${milestone.progress}%` }}
                    ></div>
                  </div>
                </div>
                <div className="text-sm text-gray-500">
                  {milestone.tasks.length} задач
                  {milestone.blockers && milestone.blockers.length > 0 && (
                    <span className="text-red-600 ml-2">• {milestone.blockers.length} блокеров</span>
                  )}
                </div>
              </div>
            ))}
          </div>
          
          {/* Next Actions & Risks */}
          <div className="space-y-6">
            {/* Next Actions */}
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                🎯 Следующие действия
              </h3>
              <ul className="space-y-2">
                {projectData.next_actions.map((action, index) => (
                  <li key={index} className="flex items-center text-gray-700">
                    <span className="text-blue-500 mr-2">→</span>
                    <span>{action}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Risks */}
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                ⚠️ Риски проекта
              </h3>
              <div className="space-y-3">
                {projectData.risks.map((risk) => (
                  <div key={risk.id} className={`p-3 rounded-lg border-l-4 ${getRiskColor(risk.impact)} bg-gray-50`}>
                    <div className="flex justify-between items-start mb-1">
                      <h4 className="font-medium text-gray-900">{risk.description}</h4>
                      <span className="text-xs text-gray-500">{risk.probability}/{risk.impact}</span>
                    </div>
                    <p className="text-sm text-gray-600">{risk.mitigation}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Detailed Tasks */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Детальное планирование задач</h2>
          <div className="space-y-4">
            {projectData.milestones.map((milestone) => (
              <div key={milestone.id} className="border border-gray-200 rounded-lg p-4">
                <h3 className="font-semibold text-gray-900 mb-3">{milestone.name}</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {milestone.tasks.map((task) => (
                    <div key={task.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div className="flex items-center">
                        <div className={`w-3 h-3 rounded-full mr-3 ${
                          task.status === 'completed' ? 'bg-green-500' :
                          task.status === 'in_progress' ? 'bg-blue-500' :
                          task.status === 'pending' ? 'bg-gray-400' : 'bg-red-500'
                        }`}></div>
                        <span className="text-sm font-medium">{task.name}</span>
                      </div>
                      <span className="text-xs text-gray-500">{task.progress}%</span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}