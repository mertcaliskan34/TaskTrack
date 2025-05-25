import React, { useState, useEffect, useCallback } from 'react';
import {
  Box,
  Paper,
  Typography,
  Card,
  CardContent,
  Chip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Fab,
  Alert,
  Snackbar,
  Badge,
  useTheme,
  useMediaQuery
} from '@mui/material';
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
} from '@mui/icons-material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { format, startOfMonth, endOfMonth, eachDayOfInterval, isSameDay, isToday } from 'date-fns';
import { taskService } from '../services/api';
import { useAuth } from '../components/AuthContext';
import { useCalendar } from '../context/CalendarContext';

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

interface TaskFormData {
  title: string;
  description: string;
  due_date: Date | null;
  task_type: 'assignment' | 'exam' | 'daily';
  status: 'pending' | 'in_progress' | 'completed';
}

const Calendar: React.FC = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const { user } = useAuth();
  const { currentDate } = useCalendar();
  const [tasks, setTasks] = useState<Task[]>([]);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' as 'success' | 'error' });

  const [formData, setFormData] = useState<TaskFormData>({
    title: '',
    description: '',
    due_date: null,
    task_type: 'daily',
    status: 'pending'
  });

  const showSnackbar = (message: string, severity: 'success' | 'error') => {
    setSnackbar({ open: true, message, severity });
  };

  // Görevleri yükle
  const loadTasks = useCallback(async () => {
    if (!user?.id) return;

    try {
      const response = await taskService.getTasks();
      setTasks(response.tasks || response);
    } catch (error) {
      console.error('Görevler yüklenirken hata:', error);
      showSnackbar('Görevler yüklenirken hata oluştu', 'error');
    }
  }, [user?.id]);

  useEffect(() => {
    if (user) {
      loadTasks();
    }
  }, [user, loadTasks]);

  const handleCloseSnackbar = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  // Takvim günlerini hesapla
  const monthStart = startOfMonth(currentDate);
  const monthEnd = endOfMonth(currentDate);
  const calendarDays = eachDayOfInterval({ start: monthStart, end: monthEnd });


  // Belirli bir gündeki görevleri getir
  const getTasksForDate = (date: Date) => {
    return tasks.filter(task =>
      task.due_date && isSameDay(new Date(task.due_date), date)
    );
  };

  // Görev türü renkleri
  const getTaskTypeColor = (type: string) => {
    switch (type) {
      case 'assignment': return '#2196f3';
      case 'exam': return '#f44336';
      case 'daily': return '#4caf50';
      default: return '#757575';
    }
  };

  // Dialog açma
  const handleOpenDialog = (date?: Date, task?: Task) => {
    if (task) {
      setIsEditMode(true);
      setEditingTask(task);
      setFormData({
        title: task.title,
        description: task.description,
        due_date: task.due_date ? new Date(task.due_date) : null,
        task_type: task.task_type,
        status: task.status
      });
    } else {
      setIsEditMode(false);
      setEditingTask(null);
      setFormData({
        title: '',
        description: '',
        due_date: date || selectedDate || new Date(),
        task_type: 'daily',
        status: 'pending'
      });
    }
    setIsDialogOpen(true);
  };

  // Dialog kapatma
  const handleCloseDialog = () => {
    setIsDialogOpen(false);
    setIsEditMode(false);
    setEditingTask(null);
    setFormData({
      title: '',
      description: '',
      due_date: null,
      task_type: 'daily',
      status: 'pending'
    });
  };

  // Form verisi değişikliği
  const handleFormChange = (field: keyof TaskFormData, value: string | Date | null) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  // Görev kaydetme
  const handleSaveTask = async () => {
    if (!formData.title.trim()) {
      showSnackbar('Görev başlığı gereklidir', 'error');
      return;
    }

    try {
      const taskData = {
        title: formData.title,
        description: formData.description,
        due_date: formData.due_date?.toISOString(),
        task_type: formData.task_type,
        status: formData.status
      };

      if (isEditMode && editingTask) {
        await taskService.updateTask(editingTask._id, taskData);
        showSnackbar('Görev başarıyla güncellendi', 'success');
      } else {
        await taskService.createTask(taskData);
        showSnackbar('Görev başarıyla oluşturuldu', 'success');
      }

      handleCloseDialog();
      loadTasks();
    } catch (error) {
      console.error('Görev kaydedilirken hata:', error);
      showSnackbar('Görev kaydedilirken hata oluştu', 'error');
    }
  };

  // Görev silme
  const handleDeleteTask = async (taskId: string) => {
    if (!window.confirm('Bu görevi silmek istediğinizden emin misiniz?')) {
      return;
    }

    try {
      await taskService.deleteTask(taskId);
      showSnackbar('Görev başarıyla silindi', 'success');
      handleCloseDialog();
      loadTasks();
    } catch (error) {
      console.error('Görev silinirken hata:', error);
      showSnackbar('Görev silinirken hata oluştu', 'error');
    }
  };

  return (
    <section style={{ width: "87.5vw" }}>
      <Box sx={{
        height: 'calc(100vh - 64px)', // Full height minus AppBar
        display: 'flex',
        flexDirection: 'column',
        justifyContent: "center",
        alignContent: "center",
        overflow: 'hidden',
        width: 1,
        maxWidth: 1,
      }}>
        {/* Takvim Başlığı ve Kontroller */}
        {/* <Paper elevation={2} sx={{ p: 2, mb: 1, flexShrink: 0, width: '100%'}}>
          <Box display="flex" justifyContent="space-between" alignItems="center" flexWrap="wrap" gap={2}>
            <Typography variant="h4" component="h1" color="primary">
              Takvim
            </Typography>

            <Box display="flex" alignItems="center" gap={1}>
              <Tooltip title="Bugün">
                <IconButton onClick={handleToday} color="primary">
                  <TodayIcon />
                </IconButton>
              </Tooltip>

              <IconButton onClick={handlePreviousMonth}>
                <ChevronLeft />
              </IconButton>

              <Typography variant="h6" sx={{ minWidth: 200, textAlign: 'center' }}>
                {format(currentDate, 'MMMM yyyy', { locale: tr })}
              </Typography>

              <IconButton onClick={handleNextMonth}>
                <ChevronRight />
              </IconButton>
            </Box>
          </Box>
        </Paper> */}

        {/* Takvim Grid */}
        <Paper elevation={2} sx={{
          p: 2,
          flexGrow: 1,
          display: 'flex',
          flexDirection: 'column',
          overflow: 'auto',
          width: '100%',
          maxWidth: '100%',
          minWidth: 0
        }}>
          {/* Haftanın Günleri */}
          <Box
            display="grid"
            gridTemplateColumns="repeat(7, 1fr)"
            gap={1}
            sx={{
              mb: 2,
              width: '100%',
              minWidth: 0
            }}
          >
            {['Pazartesi', 'Salı', 'Çarşamba', 'Perşembe', 'Cuma', 'Cumartesi', 'Pazar'].map((day) => (
              <Box key={day} sx={{ minWidth: 0 }}>
                <Typography
                  variant="subtitle2"
                  align="center"
                  sx={{
                    fontWeight: 'bold',
                    color: 'primary.main',
                    py: 1
                  }}
                >
                  {day}
                </Typography>
              </Box>
            ))}
          </Box>

          {/* Takvim Günleri */}
          <Box
            display="grid"
            gridTemplateColumns="repeat(7, 1fr)"
            gap={1}
            sx={{
              flexGrow: 1,
              gridTemplateRows: `repeat(${Math.ceil(calendarDays.length / 7)}, 1fr)`,
              minHeight: 0,
              width: '100%',
              maxWidth: '100%',
              minWidth: 0,
              height: '100%'
            }}
          >
            {calendarDays.map((day) => {
              const dayTasks = getTasksForDate(day);
              const isCurrentDay = isToday(day);
              const isSelected = selectedDate && isSameDay(day, selectedDate);

              return (
                <Box key={day.toISOString()} sx={{ minWidth: 0, width: '100%' }}>
                  <Card
                    sx={{
                      height: '100%',
                      minHeight: isMobile ? 100 : 140,
                      maxHeight: isMobile ? 120 : 160,
                      cursor: 'pointer',
                      border: isCurrentDay ? 2 : 1,
                      borderColor: isCurrentDay ? 'primary.main' : 'divider',
                      bgcolor: isSelected ? 'action.selected' : 'background.paper',
                      '&:hover': {
                        bgcolor: 'action.hover'
                      },
                      display: 'flex',
                      flexDirection: 'column',
                      width: '100%',
                      minWidth: 0
                    }}
                    onClick={() => {
                      setSelectedDate(day);
                      handleOpenDialog(day);
                    }}
                  >
                    <CardContent sx={{
                      p: 1,
                      '&:last-child': { pb: 1 },
                      height: '100%',
                      display: 'flex',
                      flexDirection: 'column'
                    }}>
                      <Box display="flex" justifyContent="space-between" alignItems="center" mb={1}>
                        <Typography
                          variant="body2"
                          sx={{
                            fontWeight: isCurrentDay ? 'bold' : 'normal',
                            color: isCurrentDay ? 'primary.main' : 'text.primary'
                          }}
                        >
                          {format(day, 'd')}
                        </Typography>

                        {dayTasks.length > 0 && (
                          <Badge badgeContent={dayTasks.length} color="primary" />
                        )}
                      </Box>

                      {/* Görevler */}
                      <Box sx={{ flexGrow: 1, overflow: 'hidden' }}>
                        {dayTasks.slice(0, isMobile ? 1 : 3).map((task) => (
                          <Chip
                            key={task._id}
                            label={task.title}
                            size="small"
                            sx={{
                              fontSize: '0.7rem',
                              height: 20,
                              mb: 0.5,
                              bgcolor: getTaskTypeColor(task.task_type),
                              color: 'white',
                              display: 'block',
                              maxWidth: '100%',
                              '& .MuiChip-label': {
                                px: 1,
                                overflow: 'hidden',
                                textOverflow: 'ellipsis',
                                whiteSpace: 'nowrap'
                              }
                            }}
                            onClick={(e) => {
                              e.stopPropagation();
                              handleOpenDialog(day, task);
                            }}
                          />
                        ))}

                        {dayTasks.length > (isMobile ? 1 : 3) && (
                          <Typography variant="caption" color="text.secondary">
                            +{dayTasks.length - (isMobile ? 1 : 3)} daha
                          </Typography>
                        )}
                      </Box>
                    </CardContent>
                  </Card>
                </Box>
              );
            })}
          </Box>
        </Paper>

        {/* Yeni Görev Ekleme FAB */}
        <Fab
          color="primary"
          aria-label="Görev Ekle"
          sx={{
            position: 'fixed',
            bottom: 16,
            right: 16
          }}
          onClick={() => handleOpenDialog()}
        >
          <AddIcon />
        </Fab>

        {/* Görev Dialog */}
        <Dialog
          open={isDialogOpen}
          onClose={handleCloseDialog}
          maxWidth="sm"
          fullWidth
          fullScreen={isMobile}
        >
          <DialogTitle>
            {isEditMode ? 'Görevi Düzenle' : 'Yeni Görev Ekle'}
          </DialogTitle>

          <DialogContent>
            <Box sx={{ pt: 1 }}>
              <TextField
                fullWidth
                label="Görev Başlığı"
                value={formData.title}
                onChange={(e) => handleFormChange('title', e.target.value)}
                margin="normal"
                required
              />

              <TextField
                fullWidth
                label="Açıklama"
                value={formData.description}
                onChange={(e) => handleFormChange('description', e.target.value)}
                margin="normal"
                multiline
                rows={3}
              />

              <DatePicker
                label="Bitiş Tarihi"
                value={formData.due_date}
                onChange={(date) => handleFormChange('due_date', date)}
                sx={{ width: '100%', mt: 2 }}
              />

              <FormControl fullWidth margin="normal">
                <InputLabel>Görev Türü</InputLabel>
                <Select
                  value={formData.task_type}
                  onChange={(e) => handleFormChange('task_type', e.target.value)}
                  label="Görev Türü"
                >
                  <MenuItem value="daily">Günlük</MenuItem>
                  <MenuItem value="assignment">Ödev</MenuItem>
                  <MenuItem value="exam">Sınav</MenuItem>
                </Select>
              </FormControl>

              <FormControl fullWidth margin="normal">
                <InputLabel>Durum</InputLabel>
                <Select
                  value={formData.status}
                  onChange={(e) => handleFormChange('status', e.target.value)}
                  label="Durum"
                >
                  <MenuItem value="pending">Bekliyor</MenuItem>
                  <MenuItem value="in_progress">Devam Ediyor</MenuItem>
                  <MenuItem value="completed">Tamamlandı</MenuItem>
                </Select>
              </FormControl>
            </Box>
          </DialogContent>

          <DialogActions>
            {isEditMode && (
              <Button
                onClick={() => handleDeleteTask(editingTask!._id)}
                color="error"
                startIcon={<DeleteIcon />}
              >
                Sil
              </Button>
            )}

            <Button onClick={handleCloseDialog}>
              İptal
            </Button>

            <Button
              onClick={handleSaveTask}
              variant="contained"
              startIcon={isEditMode ? <EditIcon /> : <AddIcon />}
            >
              {isEditMode ? 'Güncelle' : 'Ekle'}
            </Button>
          </DialogActions>
        </Dialog>

        {/* Snackbar */}
        <Snackbar
          open={snackbar.open}
          autoHideDuration={6000}
          onClose={handleCloseSnackbar}
        >
          <Alert
            onClose={handleCloseSnackbar}
            severity={snackbar.severity}
            sx={{ width: '100%' }}
          >
            {snackbar.message}
          </Alert>
        </Snackbar>
      </Box>
    </section>
  );
};

export default Calendar; 