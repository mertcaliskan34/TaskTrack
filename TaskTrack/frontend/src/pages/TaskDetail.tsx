import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Box, Typography, Paper, Chip, Button, CircularProgress, Grid } from '@mui/material';
import { format, parseISO } from 'date-fns';
import { tr } from 'date-fns/locale';
import axios from 'axios';
import { Task, taskService } from '../services/api';
import TaskForm from '../components/TaskForm';

// Define a proper type for task update data
interface TaskUpdateData {
  title: string;
  description?: string;
  due_date?: string;
  task_type: 'assignment' | 'exam' | 'daily';
  status?: 'pending' | 'in_progress' | 'completed';
}

// Error response type
interface ErrorResponse {
  message: string;
  status?: string;
}

const TaskDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [task, setTask] = useState<Task | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [editOpen, setEditOpen] = useState(false);

  useEffect(() => {
    if (!id) return;
    
    const fetchTask = async () => {
      try {
        setLoading(true);
        const response = await taskService.getTaskById(id);
        setTask(response.task);
        setError(null);
      } catch (err) {
        let errorMessage = 'Görev yüklenirken bir hata oluştu';
        
        if (axios.isAxiosError(err) && err.response) {
          const errorData = err.response.data as ErrorResponse;
          errorMessage = errorData.message || errorMessage;
        }
        
        setError(errorMessage);
        console.error('Görev yükleme hatası:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchTask();
  }, [id]);

  const handleEditTask = () => {
    setEditOpen(true);
  };

  const handleTaskUpdate = async (taskData: TaskUpdateData) => {
    if (!task) return;
    
    try {
      await taskService.updateTask(task.task_id.toString(), taskData);
      // Güncel görevi yeniden yükle
      const response = await taskService.getTaskById(id!);
      setTask(response.task);
      setEditOpen(false);
    } catch (err) {
      let errorMessage = 'Görev güncellenirken bir hata oluştu';
      
      if (axios.isAxiosError(err) && err.response) {
        const errorData = err.response.data as ErrorResponse;
        errorMessage = errorData.message || errorMessage;
        console.error('Görev güncelleme hatası:', errorMessage);
      } else {
        console.error('Görev güncelleme hatası:', err);
      }
      
      // Here you might want to display the error to the user
      // For example, by setting an error state that's shown in the form
    }
  };

  const handleBack = () => {
    navigate('/dashboard');
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (error || !task) {
    return (
      <Box sx={{ mt: 4 }}>
        <Typography color="error">{error || 'Görev bulunamadı'}</Typography>
        <Button onClick={handleBack} sx={{ mt: 2 }}>
          Görevlerime Dön
        </Button>
      </Box>
    );
  }

  const getTaskTypeText = (type: string) => {
    switch (type) {
      case 'assignment': return 'Ödev';
      case 'exam': return 'Sınav';
      case 'daily': return 'Günlük';
      default: return 'Ödev';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'pending': return 'Bekliyor';
      case 'in_progress': return 'Devam Ediyor';
      case 'completed': return 'Tamamlandı';
      default: return 'Bekliyor';
    }
  };

  const getStatusColor = (status: string): 'warning' | 'info' | 'success' | 'default' => {
    switch (status) {
      case 'pending': return 'warning';
      case 'in_progress': return 'info';
      case 'completed': return 'success';
      default: return 'default';
    }
  };

  return (
    <>
      <Button onClick={handleBack} sx={{ mb: 3 }}>
        Görevlerime Dön
      </Button>
      
      <Paper sx={{ p: 3 }}>
        <Grid container spacing={2}>
          <Grid component="div" sx={{ mb: 2, gridColumn: 'span 12' }}>
            <Typography variant="h4">{task.title}</Typography>
          </Grid>
          
          <Grid component="div" sx={{ gridColumn: { xs: 'span 12', md: 'span 6' } }}>
            <Box sx={{ display: 'flex', gap: 1, mb: 2 }}>
              <Chip 
                label={getTaskTypeText(task.task_type)} 
                color="primary" 
                variant="outlined" 
              />
              <Chip 
                label={getStatusText(task.status)} 
                color={getStatusColor(task.status)}
              />
            </Box>
            
            {task.description && (
              <Box sx={{ mb: 3 }}>
                <Typography variant="subtitle1" fontWeight="bold">Açıklama</Typography>
                <Typography variant="body1">{task.description}</Typography>
              </Box>
            )}
            
            {task.due_date && (
              <Box sx={{ mb: 3 }}>
                <Typography variant="subtitle1" fontWeight="bold">Teslim Tarihi</Typography>
                <Typography variant="body1">
                  {format(parseISO(task.due_date), 'd MMMM yyyy', { locale: tr })}
                </Typography>
              </Box>
            )}
            
            <Box sx={{ mb: 3 }}>
              <Typography variant="subtitle1" fontWeight="bold">Oluşturulma Tarihi</Typography>
              <Typography variant="body1">
                {format(parseISO(task.created_at), 'd MMMM yyyy, HH:mm', { locale: tr })}
              </Typography>
            </Box>
            
            {task.updated_at && task.updated_at !== task.created_at && (
              <Box sx={{ mb: 3 }}>
                <Typography variant="subtitle1" fontWeight="bold">Son Güncelleme</Typography>
                <Typography variant="body1">
                  {format(parseISO(task.updated_at), 'd MMMM yyyy, HH:mm', { locale: tr })}
                </Typography>
              </Box>
            )}
          </Grid>
          
          <Grid component="div" sx={{ 
            gridColumn: { xs: 'span 12', md: 'span 6' },
            display: 'flex', 
            justifyContent: 'center', 
            alignItems: 'center' 
          }}>
            <Button 
              variant="contained" 
              color="primary" 
              onClick={handleEditTask}
              sx={{ mx: 1 }}
            >
              Görevi Düzenle
            </Button>
          </Grid>
        </Grid>
      </Paper>
      
      {/* Edit Form */}
      <TaskForm
        open={editOpen}
        onClose={() => setEditOpen(false)}
        onSubmit={handleTaskUpdate}
        initialData={task}
        mode="edit"
      />
    </>
  );
};

export default TaskDetail; 