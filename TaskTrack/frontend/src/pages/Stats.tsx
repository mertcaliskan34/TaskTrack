import React, { useState, useEffect, useCallback } from 'react';
import {
  Box,
  Typography,
  Grid,
  Paper,
  Card,
  CardContent,
  CircularProgress,
  LinearProgress,
  Chip,
  Alert
} from '@mui/material';
import {
  TrendingUp as TrendingUpIcon,
  Assignment as AssignmentIcon,
  School as SchoolIcon,
  Today as TodayIcon,
  CheckCircle as CheckCircleIcon,
  Schedule as ScheduleIcon,
  PlayCircle as PlayCircleIcon,
  BarChart as BarChartIcon
} from '@mui/icons-material';
import { taskService } from '../services/api';
import { useAuth } from '../components/AuthContext';

interface Task {
  _id: string;
  title: string;
  description: string;
  due_date: string;
  task_type: 'assignment' | 'exam' | 'daily';
  status: 'pending' | 'in_progress' | 'completed';
  created_at: string;
  updated_at: string;
}

interface TaskStats {
  total: number;
  completed: number;
  inProgress: number;
  pending: number;
  byType: {
    assignment: number;
    exam: number;
    daily: number;
  };
  completionRate: number;
  thisWeekCompleted: number;
  thisMonthCompleted: number;
}

const Stats: React.FC = () => {
  useAuth();
  const [, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [stats, setStats] = useState<TaskStats>({
    total: 0,
    completed: 0,
    inProgress: 0,
    pending: 0,
    byType: { assignment: 0, exam: 0, daily: 0 },
    completionRate: 0,
    thisWeekCompleted: 0,
    thisMonthCompleted: 0
  });

  const loadTasks = useCallback(async () => {
    try {
      setLoading(true);
      const response = await taskService.getTasks();
      const taskData = response.tasks || response;
      setTasks(taskData);
      calculateStats(taskData);
      setError(null);
    } catch (error) {
      console.error('İstatistikler yüklenirken hata:', error);
      setError('İstatistikler yüklenirken hata oluştu');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadTasks();
  }, [loadTasks]);

  const calculateStats = (taskData: Task[]) => {
    const now = new Date();
    const oneWeekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
    const oneMonthAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);

    const total = taskData.length;
    const completed = taskData.filter(task => task.status === 'completed').length;
    const inProgress = taskData.filter(task => task.status === 'in_progress').length;
    const pending = taskData.filter(task => task.status === 'pending').length;

    const byType = {
      assignment: taskData.filter(task => task.task_type === 'assignment').length,
      exam: taskData.filter(task => task.task_type === 'exam').length,
      daily: taskData.filter(task => task.task_type === 'daily').length
    };

    const completionRate = total > 0 ? Math.round((completed / total) * 100) : 0;

    const thisWeekCompleted = taskData.filter(task => 
      task.status === 'completed' && 
      new Date(task.updated_at) >= oneWeekAgo
    ).length;

    const thisMonthCompleted = taskData.filter(task => 
      task.status === 'completed' && 
      new Date(task.updated_at) >= oneMonthAgo
    ).length;

    setStats({
      total,
      completed,
      inProgress,
      pending,
      byType,
      completionRate,
      thisWeekCompleted,
      thisMonthCompleted
    });
  };

  const getTaskTypeIcon = (type: string) => {
    switch (type) {
      case 'assignment': return <AssignmentIcon />;
      case 'exam': return <SchoolIcon />;
      case 'daily': return <TodayIcon />;
      default: return <AssignmentIcon />;
    }
  };

  const getTaskTypeColor = (type: string) => {
    switch (type) {
      case 'assignment': return '#2196f3';
      case 'exam': return '#f44336';
      case 'daily': return '#4caf50';
      default: return '#757575';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return '#4caf50';
      case 'in_progress': return '#ff9800';
      case 'pending': return '#757575';
      default: return '#757575';
    }
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '60vh' }}>
        <CircularProgress size={60} />
      </Box>
    );
  }

  return (
    <Box sx={{ 
      width: '100%', 
      display: 'flex', 
      justifyContent: 'center',
      p: { xs: 2, sm: 3, md: 4 }
    }}>
      <Box sx={{ 
        width: '100%', 
        maxWidth: '1400px'
      }}>
      {/* Header */}
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom color="primary" fontWeight="bold">
          İstatistikler
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Görev performansınızı ve ilerlemenizi takip edin
        </Typography>
      </Box>

      {error && (
        <Alert severity="error" sx={{ mb: 4 }}>
          {error}
        </Alert>
      )}

      {/* Overview Cards */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid component="div" sx={{ gridColumn: { xs: 'span 12', sm: 'span 6', md: 'span 3' } }}>
          <Card sx={{ background: 'linear-gradient(135deg, #2196f3 0%, #21cbf3 100%)', color: 'white' }}>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <Box>
                  <Typography variant="h4" fontWeight="bold">
                    {stats.total}
                  </Typography>
                  <Typography variant="body2" sx={{ opacity: 0.9 }}>
                    Toplam Görev
                  </Typography>
                </Box>
                <BarChartIcon sx={{ fontSize: 40, opacity: 0.8 }} />
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid component="div" sx={{ gridColumn: { xs: 'span 12', sm: 'span 6', md: 'span 3' } }}>
          <Card sx={{ background: 'linear-gradient(135deg, #4caf50 0%, #8bc34a 100%)', color: 'white' }}>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <Box>
                  <Typography variant="h4" fontWeight="bold">
                    {stats.completed}
                  </Typography>
                  <Typography variant="body2" sx={{ opacity: 0.9 }}>
                    Tamamlanan
                  </Typography>
                </Box>
                <CheckCircleIcon sx={{ fontSize: 40, opacity: 0.8 }} />
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid component="div" sx={{ gridColumn: { xs: 'span 12', sm: 'span 6', md: 'span 3' } }}>
          <Card sx={{ background: 'linear-gradient(135deg, #ff9800 0%, #ffc107 100%)', color: 'white' }}>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <Box>
                  <Typography variant="h4" fontWeight="bold">
                    {stats.inProgress}
                  </Typography>
                  <Typography variant="body2" sx={{ opacity: 0.9 }}>
                    Devam Eden
                  </Typography>
                </Box>
                <PlayCircleIcon sx={{ fontSize: 40, opacity: 0.8 }} />
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid component="div" sx={{ gridColumn: { xs: 'span 12', sm: 'span 6', md: 'span 3' } }}>
          <Card sx={{ background: 'linear-gradient(135deg, #757575 0%, #9e9e9e 100%)', color: 'white' }}>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <Box>
                  <Typography variant="h4" fontWeight="bold">
                    {stats.pending}
                  </Typography>
                  <Typography variant="body2" sx={{ opacity: 0.9 }}>
                    Bekleyen
                  </Typography>
                </Box>
                <ScheduleIcon sx={{ fontSize: 40, opacity: 0.8 }} />
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      <Grid container spacing={3}>
        {/* Completion Rate */}
        <Grid component="div" sx={{ gridColumn: { xs: 'span 12', md: 'span 6' } }}>
          <Paper elevation={3} sx={{ p: 3, height: 'fit-content' }}>
            <Typography variant="h6" gutterBottom fontWeight="bold">
              Tamamlanma Oranı
            </Typography>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
              <Box sx={{ width: '100%', mr: 2 }}>
                <LinearProgress 
                  variant="determinate" 
                  value={stats.completionRate} 
                  sx={{ 
                    height: 10, 
                    borderRadius: 5,
                    backgroundColor: '#e0e0e0',
                    '& .MuiLinearProgress-bar': {
                      backgroundColor: '#4caf50'
                    }
                  }} 
                />
              </Box>
              <Box sx={{ minWidth: 45 }}>
                <Typography variant="body2" color="text.secondary" fontWeight="bold">
                  {stats.completionRate}%
                </Typography>
              </Box>
            </Box>
            <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
              <strong>{stats.completed}</strong> görev tamamlandı, <strong>{stats.total - stats.completed}</strong> görev kaldı
            </Typography>
          </Paper>
        </Grid>

        {/* Task Types */}
        <Grid component="div" sx={{ gridColumn: { xs: 'span 12', md: 'span 6' } }}>
          <Paper elevation={3} sx={{ p: 3, height: 'fit-content' }}>
            <Typography variant="h6" gutterBottom fontWeight="bold">
              Görev Türleri
            </Typography>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              {Object.entries(stats.byType).map(([type, count]) => (
                <Box key={type} sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                    <Box sx={{ color: getTaskTypeColor(type) }}>
                      {getTaskTypeIcon(type)}
                    </Box>
                    <Typography variant="body1" sx={{ ml: 0.5 }}>
                      {type === 'assignment' ? 'Ödevler' : 
                       type === 'exam' ? 'Sınavlar' : 'Günlük Görevler'}
                    </Typography>
                  </Box>
                  <Chip 
                    label={count} 
                    size="small" 
                    sx={{ 
                      backgroundColor: getTaskTypeColor(type),
                      color: 'white',
                      fontWeight: 'bold',
                      ml: 2
                    }} 
                  />
                </Box>
              ))}
            </Box>
          </Paper>
        </Grid>

        {/* Recent Performance */}
        <Grid component="div" sx={{ gridColumn: { xs: 'span 12', md: 'span 6' } }}>
          <Paper elevation={3} sx={{ p: 3, height: 'fit-content' }}>
            <Typography variant="h6" gutterBottom fontWeight="bold">
              Son Performans
            </Typography>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2.5 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <Typography variant="body1" sx={{ mr: 2 }}>Bu Hafta Tamamlanan</Typography>
                <Chip 
                  label={stats.thisWeekCompleted} 
                  color="primary" 
                  variant="outlined"
                  sx={{ ml: 1 }}
                />
              </Box>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <Typography variant="body1" sx={{ mr: 2 }}>Bu Ay Tamamlanan</Typography>
                <Chip 
                  label={stats.thisMonthCompleted} 
                  color="secondary" 
                  variant="outlined"
                  sx={{ ml: 1 }}
                />
              </Box>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <Typography variant="body1" sx={{ mr: 2 }}>Ortalama Günlük</Typography>
                <Chip 
                  label={Math.round(stats.thisMonthCompleted / 30 * 10) / 10} 
                  color="success" 
                  variant="outlined"
                  sx={{ ml: 1 }}
                />
              </Box>
            </Box>
          </Paper>
        </Grid>

        {/* Status Distribution */}
        <Grid component="div" sx={{ gridColumn: { xs: 'span 12', md: 'span 6' } }}>
          <Paper elevation={3} sx={{ p: 3, height: 'fit-content' }}>
            <Typography variant="h6" gutterBottom fontWeight="bold">
              Durum Dağılımı
            </Typography>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2.5 }}>
              {[
                { status: 'completed', label: 'Tamamlanan', count: stats.completed },
                { status: 'in_progress', label: 'Devam Eden', count: stats.inProgress },
                { status: 'pending', label: 'Bekleyen', count: stats.pending }
              ].map(({ status, label, count }) => (
                <Box key={status} sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <Typography variant="body1" sx={{ mr: 2 }}>{label}</Typography>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                    <LinearProgress 
                      variant="determinate" 
                      value={stats.total > 0 ? (count / stats.total) * 100 : 0}
                      sx={{ 
                        width: 100, 
                        height: 6, 
                        borderRadius: 3,
                        backgroundColor: '#e0e0e0',
                        '& .MuiLinearProgress-bar': {
                          backgroundColor: getStatusColor(status)
                        }
                      }} 
                    />
                    <Typography variant="body2" color="text.secondary" sx={{ minWidth: 30, ml: 0.5 }}>
                      {count}
                    </Typography>
                  </Box>
                </Box>
              ))}
            </Box>
          </Paper>
        </Grid>
      </Grid>

      {/* Motivational Message */}
      {stats.total > 0 && (
        <Paper 
          elevation={3} 
          sx={{ 
            p: 3, 
            mt: 4, 
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            color: 'white',
            textAlign: 'center'
          }}
        >
          <TrendingUpIcon sx={{ fontSize: 48, mb: 2, opacity: 0.8 }} />
          <Typography variant="h6" gutterBottom fontWeight="bold">
            {stats.completionRate >= 80 ? 'Harika İş Çıkarıyorsun!' :
             stats.completionRate >= 60 ? 'İyi Gidiyorsun!' :
             stats.completionRate >= 40 ? 'Devam Et!' :
             'Biraz Daha Çaba Göster!'}
          </Typography>
          <Typography variant="body1" sx={{ opacity: 0.9 }}>
            {stats.completionRate >= 80 ? 'Görevlerinin %' + stats.completionRate + '\'ini tamamladın. Mükemmel bir performans!' :
             stats.completionRate >= 60 ? 'Görevlerinin %' + stats.completionRate + '\'ini tamamladın. Güzel bir ilerleme!' :
             stats.completionRate >= 40 ? 'Görevlerinin %' + stats.completionRate + '\'ini tamamladın. Biraz daha hızlan!' :
             'Görevlerinin sadece %' + stats.completionRate + '\'ini tamamladın. Hadi biraz daha çaba göster!'}
          </Typography>
        </Paper>
      )}
      </Box>
    </Box>
  );
};

export default Stats; 