import React, { useState, useEffect } from 'react';

import {
  Typography,
  Grid,
  Card,
  CardContent,
  Box,
  Chip,
  Button,
  IconButton,
  CircularProgress,
  Paper,
  Tabs,
  Tab,
  Alert
} from '@mui/material';
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Assignment as AssignmentIcon,
  School as SchoolIcon,
  EventNote as EventNoteIcon
} from '@mui/icons-material';
import { format, isToday, isTomorrow, parseISO, isPast } from 'date-fns';
import { tr } from 'date-fns/locale';
import { Task, TaskCreateData, taskService } from '../services/api';
import { useAuth } from '../components/AuthContext';
import TaskForm from '../components/TaskForm';

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function TaskTabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`task-tabpanel-${index}`}
      aria-labelledby={`task-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ py: 3 }}>{children}</Box>}
    </div>
  );
}

// Tab için a11y
function a11yProps(index: number) {
  return {
    id: `task-tab-${index}`,
    'aria-controls': `task-tabpanel-${index}`,
  };
}

const Dashboard: React.FC = () => {
  const { user } = useAuth();
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [formOpen, setFormOpen] = useState(false);
  const [currentTask, setCurrentTask] = useState<Task | undefined>(undefined);
  const [tabValue, setTabValue] = useState(0);

  // Görevleri getir
  const fetchTasks = async () => {
    try {
      setLoading(true);
      const response = await taskService.getTasks();
      setTasks(response.tasks);
      setError(null);
    } catch (err: unknown) {
      setError('Görevler yüklenirken bir hata oluştu');
      console.error('Görev yükleme hatası:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  // Tab değişimi
  const handleTabChange = (_event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  // Görev oluşturma formunu aç
  const handleAddTask = () => {
    setCurrentTask(undefined);
    setFormOpen(true);
  };

  // Görev düzenleme formunu aç
  const handleEditTask = (task: Task) => {
    setCurrentTask(task);
    setFormOpen(true);
  };

  // Görev silme
  const handleDeleteTask = async (taskId: string | number) => {
    if (window.confirm('Bu görevi silmek istediğinize emin misiniz?')) {
      try {
        await taskService.deleteTask(taskId.toString());
        fetchTasks(); // Görevleri yeniden yükle
      } catch (error) {
        console.error('Görev silme hatası:', error);
      }
    }
  };

  // Görev durumunu güncelle
  const handleUpdateTaskStatus = async (taskId: string | number, status: 'pending' | 'in_progress' | 'completed') => {
    try {
      await taskService.updateTaskStatus(taskId.toString(), status);
      fetchTasks(); // Görevleri yeniden yükle
    } catch (error) {
      console.error('Görev durumu güncelleme hatası:', error);
    }
  };

  // Form submit
  const handleFormSubmit = async (taskData: unknown) => {
    try {
      if (currentTask) {
        // Düzenleme
        const taskId = currentTask._id || currentTask.task_id;
        if (taskId) {
          await taskService.updateTask(taskId.toString(), taskData as Partial<TaskCreateData>);
        }
      } else {
        // Yeni
        await taskService.createTask(taskData as TaskCreateData);
      }
      fetchTasks(); // Görevleri yeniden yükle
    } catch (error) {
      console.error('Görev kaydetme hatası:', error);
    }
  };

  // Görev türüne göre icon
  const getTaskTypeIcon = (type: string) => {
    switch (type) {
      case 'assignment':
        return <AssignmentIcon />;
      case 'exam':
        return <SchoolIcon />;
      case 'daily':
        return <EventNoteIcon />;
      default:
        return <AssignmentIcon />;
    }
  };

  // Görev türünü Türkçe olarak göster
  const getTaskTypeText = (type: string) => {
    switch (type) {
      case 'assignment':
        return 'Ödev';
      case 'exam':
        return 'Sınav';
      case 'daily':
        return 'Günlük';
      default:
        return 'Ödev';
    }
  };

  // Görev durumunu Türkçe olarak göster
  const getStatusText = (status: string, isPastDue?: boolean) => {
    if (isPastDue && status !== 'completed') {
      return 'Süresi Geçmiş';
    }
    switch (status) {
      case 'pending':
        return 'Bekliyor';
      case 'in_progress':
        return 'Devam Ediyor';
      case 'completed':
        return 'Tamamlandı';
      default:
        return 'Bekliyor';
    }
  };

  // Görev durumuna göre renk
  const getStatusColor = (status: string, isPastDue?: boolean): 'warning' | 'info' | 'success' | 'error' | 'default' => {
    if (isPastDue && status !== 'completed') {
      return 'error';
    }
    switch (status) {
      case 'pending':
        return 'warning';
      case 'in_progress':
        return 'info';
      case 'completed':
        return 'success';
      default:
        return 'default';
    }
  };

  // Tarih bilgisini formatlama
  const formatDate = (dateString: string | undefined) => {
    if (!dateString) return 'Tarih belirtilmemiş';

    const date = parseISO(dateString);

    if (isToday(date)) {
      return 'Bugün';
    } else if (isTomorrow(date)) {
      return 'Yarın';
    } else {
      return format(date, 'd MMMM yyyy', { locale: tr });
    }
  };

  // Görevleri duruma göre filtreleme
  const pendingTasks = tasks.filter(task => task.status === 'pending');
  const inProgressTasks = tasks.filter(task => task.status === 'in_progress');
  const completedTasks = tasks.filter(task => task.status === 'completed');

  const renderTaskCard = (task: Task) => {
    const isPastDue = task.due_date ? isPast(parseISO(task.due_date)) && task.status !== 'completed' : false;

    return (
      <Grid
        component="div"
        size={4}
        key={task._id || task.task_id}
      >
        <Card
          sx={{
            display: 'flex',
            flexDirection: 'column',
            borderLeft: isPastDue ? '4px solid #f44336' : undefined,
          }}
        >
          <CardContent sx={{ flexGrow: 1 }}>
            <Box sx={{
              display: 'flex',
              justifyContent: 'space-between',
            }}>
              <Chip
                icon={getTaskTypeIcon(task.task_type)}
                label={getTaskTypeText(task.task_type)}
                size="medium"
                color="primary"
                variant="outlined"
              />
              <Chip
                label={getStatusText(task.status, isPastDue)}
                size="medium"
                color={getStatusColor(task.status, isPastDue)}
              />
            </Box>

            <Typography variant="h6" component="h2" gutterBottom>
              {task.title}
            </Typography>

            {task.description && (
              <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                {task.description}
              </Typography>
            )}

            <Typography variant="body2" color={isPastDue ? "error" : "text.secondary"}>
              {task.due_date ? (
                <>Teslim: {formatDate(task.due_date)}</>
              ) : (
                'Teslim tarihi belirtilmemiş'
              )}
            </Typography>
          </CardContent>

          <Box sx={{ display: 'flex', justifyContent: 'space-between', p: 1 }}>
            <Box>
              {task.status !== 'completed' && (
                <IconButton
                  size="small"
                  onClick={() => {
                    const taskId = task._id || task.task_id;
                    if (taskId) handleUpdateTaskStatus(taskId, 'completed');
                  }}
                  color="success"
                  title="Tamamlandı olarak işaretle"
                >
                  <AssignmentIcon />
                </IconButton>
              )}
              {task.status === 'completed' && (
                <IconButton
                  size="small"
                  onClick={() => {
                    const taskId = task._id || task.task_id;
                    if (taskId) handleUpdateTaskStatus(taskId, 'pending');
                  }}
                  color="warning"
                  title="Bekliyor olarak işaretle"
                >
                  <AssignmentIcon />
                </IconButton>
              )}
            </Box>
            <Box>
              <IconButton
                size="small"
                onClick={() => handleEditTask(task)}
                title="Düzenle"
              >
                <EditIcon />
              </IconButton>
              <IconButton
                size="small"
                onClick={() => {
                  const taskId = task._id || task.task_id;
                  if (taskId) handleDeleteTask(taskId);
                }}
                color="error"
                title="Sil"
              >
                <DeleteIcon />
              </IconButton>
            </Box>
          </Box>
        </Card>
      </Grid>
    );
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    // Wrapper
    <Box sx={{
      ml: "2em",
      mt: "2em",
      width: '80vw',
      maxWidth: '1400px',
      flexGrow: 1,
    }}>
      <Box sx={{
        width: '100%',
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        mb: 3
      }}>
        {/* Header Section */}
        <Box sx={{
          p: 2,
          background: 'linear-gradient(135deg, #2196f3 0%, #21cbf3 100%)',
          borderRadius: 2,
          color: 'white',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          width: '100%'
        }}>
          <Box>
            <Typography variant="h4" component="h1" fontWeight="bold" gutterBottom>
              Merhaba, {user?.username}!
            </Typography>
            <Typography variant="body1" sx={{ opacity: 0.9 }}>
              Bugün {new Date().toLocaleDateString('tr-TR', {
                weekday: 'long',
                year: 'numeric',
                month: 'long',
                day: 'numeric'
              })}
            </Typography>
          </Box>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={handleAddTask}
            sx={{
              bgcolor: 'rgba(255,255,255,0.2)',
              '&:hover': { bgcolor: 'rgba(255,255,255,0.3)' },
              backdropFilter: 'blur(10px)',
              border: '1px solid rgba(255,255,255,0.3)'
            }}
          >
            Yeni Görev
          </Button>
        </Box>

        {/* Quick Stats */}
        <Box sx={{ width: '100%', display: 'flex', flexDirection: 'row', justifyContent: 'center' }}>
          <Grid container spacing={3} sx={{ width: '100%', m: 0, justifyContent: 'center' }}>
            <Grid component="div" sx={{ gridColumn: { xs: 'span 12', sm: 'span 4' } }}>
              <Paper sx={{
                p: 2,
                textAlign: 'center',
                bgcolor: '#fff3e0',
                borderRadius: 2,
                boxShadow: 2,
                transition: 'transform 0.2s ease-in-out',
                '&:hover': {
                  transform: 'translateY(-2px)',
                  boxShadow: 4
                }
              }}>
                <Typography variant="h3" color="#ff9800" fontWeight="bold">
                  {pendingTasks.length}
                </Typography>
                <Typography variant="body2" color="text.secondary" fontWeight="medium">
                  Bekleyen Görev
                </Typography>
              </Paper>
            </Grid>
            <Grid component="div" sx={{ gridColumn: { xs: 'span 12', sm: 'span 4', } }}>
              <Paper sx={{
                p: 2,
                textAlign: 'center',
                bgcolor: '#e3f2fd',
                borderRadius: 2,
                boxShadow: 2,
                transition: 'transform 0.2s ease-in-out',
                '&:hover': {
                  transform: 'translateY(-2px)',
                  boxShadow: 4
                }
              }}>
                <Typography variant="h3" color="#2196f3" fontWeight="bold">
                  {inProgressTasks.length}
                </Typography>
                <Typography variant="body2" color="text.secondary" fontWeight="medium">
                  Devam Eden
                </Typography>
              </Paper>
            </Grid>
            <Grid component="div" sx={{ gridColumn: { xs: 'span 12', sm: 'span 4' } }}>
              <Paper sx={{
                p: 2,
                textAlign: 'center',
                bgcolor: '#e8f5e8',
                borderRadius: 2,
                boxShadow: 2,
                transition: 'transform 0.2s ease-in-out',
                '&:hover': {
                  transform: 'translateY(-2px)',
                  boxShadow: 4
                }
              }}>
                <Typography variant="h3" color="#4caf50" fontWeight="bold">
                  {completedTasks.length}
                </Typography>
                <Typography variant="body2" color="text.secondary" fontWeight="medium">
                  Tamamlanan
                </Typography>
              </Paper>
            </Grid>
          </Grid>
        </Box>
      </Box>

      {/* Tabs Section */}
      <Paper elevation={3} sx={{ borderRadius: 2, overflow: 'hidden', width: '100%' }}>
        <Tabs
          value={tabValue}
          onChange={handleTabChange}
          aria-label="görev sekmeleri"
          variant="fullWidth"
          sx={{
            bgcolor: 'primary.main',
            '& .MuiTab-root': {
              color: 'rgba(255,255,255,0.7)',
              fontWeight: 'bold',
              '&.Mui-selected': {
                color: 'white'
              }
            },
            '& .MuiTabs-indicator': {
              backgroundColor: 'white',
              height: 3
            }
          }}
        >
          <Tab label={`Bekleyen (${pendingTasks.length})`} {...a11yProps(0)} />
          <Tab label={`Devam Eden (${inProgressTasks.length})`} {...a11yProps(1)} />
          <Tab label={`Tamamlanan (${completedTasks.length})`} {...a11yProps(2)} />
        </Tabs>
      </Paper>

      {error && (
        <Alert severity="error" sx={{ mb: 4 }}>
          {error}
        </Alert>
      )}

      <TaskTabPanel value={tabValue} index={0}>
        <Grid container spacing={2} sx={{ width: '100%', m: 0 }}>
          {pendingTasks.length > 0 ? (
            pendingTasks.map(renderTaskCard)
          ) : (
            <Grid component="div">
              <Typography variant="body1" color="text.secondary" align="center">
                Bekleyen görev bulunmuyor.
              </Typography>
            </Grid>
          )}
        </Grid>
      </TaskTabPanel>

      <TaskTabPanel value={tabValue} index={1}>
        <Grid container spacing={3} sx={{ width: '100%', m: 0 }}>
          {inProgressTasks.length > 0 ? (
            inProgressTasks.map(renderTaskCard)
          ) : (
            <Grid component="div" sx={{ gridColumn: 'span 12' }}>
              <Typography variant="body1" color="text.secondary" align="center">
                Devam eden görev bulunmuyor.
              </Typography>
            </Grid>
          )}
        </Grid>
      </TaskTabPanel>

      <TaskTabPanel value={tabValue} index={2}>
        <Grid container spacing={3} sx={{ width: '100%', m: 0 }}>
          {completedTasks.length > 0 ? (
            completedTasks.map(renderTaskCard)
          ) : (
            <Grid component="div" sx={{ gridColumn: 'span 12' }}>
              <Typography variant="body1" color="text.secondary" align="center">
                Tamamlanan görev bulunmuyor.
              </Typography>
            </Grid>
          )}
        </Grid>
      </TaskTabPanel>

      <TaskForm
        open={formOpen}
        onClose={() => setFormOpen(false)}
        onSubmit={handleFormSubmit}
        initialData={currentTask}
        mode={currentTask ? 'edit' : 'create'}
      />
    </Box>
  );
};

export default Dashboard; 