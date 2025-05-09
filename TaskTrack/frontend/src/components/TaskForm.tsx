import React, { useState, useEffect } from 'react';
import { 
  Dialog, 
  DialogTitle, 
  DialogContent, 
  DialogActions, 
  TextField, 
  Button, 
  FormControl, 
  InputLabel, 
  Select, 
  MenuItem, 
  SelectChangeEvent,
  FormHelperText,
  Box
} from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { format, parseISO } from 'date-fns';
import { tr } from 'date-fns/locale';
import { Task, TaskCreateData } from '../services/api';

interface TaskFormProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (taskData: TaskCreateData) => Promise<void>;
  initialData?: Task;
  mode: 'create' | 'edit';
}

const TaskForm: React.FC<TaskFormProps> = ({ 
  open, 
  onClose, 
  onSubmit, 
  initialData, 
  mode 
}) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [dueDate, setDueDate] = useState<Date | null>(null);
  const [taskType, setTaskType] = useState<'assignment' | 'exam' | 'daily'>('assignment');
  const [status, setStatus] = useState<'pending' | 'in_progress' | 'completed'>('pending');
  const [errors, setErrors] = useState({ title: '', taskType: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Düzenleme modunda form verilerini doldur
  useEffect(() => {
    if (initialData && mode === 'edit') {
      setTitle(initialData.title);
      setDescription(initialData.description || '');
      setTaskType(initialData.task_type);
      setStatus(initialData.status);
      
      // Tarih varsa çevir
      if (initialData.due_date) {
        setDueDate(parseISO(initialData.due_date));
      } else {
        setDueDate(null);
      }
    } else {
      // Yeni görevde varsayılan değerler
      setTitle('');
      setDescription('');
      setDueDate(null);
      setTaskType('assignment');
      setStatus('pending');
    }
  }, [initialData, mode, open]);

  const validateForm = (): boolean => {
    const newErrors = { title: '', taskType: '' };
    let isValid = true;

    if (!title.trim()) {
      newErrors.title = 'Başlık gereklidir';
      isValid = false;
    }

    if (!taskType) {
      newErrors.taskType = 'Görev türü seçilmelidir';
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    try {
      setIsSubmitting(true);
      
      const taskData: TaskCreateData = {
        title,
        description: description || undefined,
        due_date: dueDate ? format(dueDate, 'yyyy-MM-dd') : undefined,
        task_type: taskType,
        status: mode === 'edit' ? status : undefined
      };

      await onSubmit(taskData);
      onClose();
    } catch (error) {
      console.error('Görev kaydetme hatası:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleTaskTypeChange = (e: SelectChangeEvent) => {
    setTaskType(e.target.value as 'assignment' | 'exam' | 'daily');
  };

  const handleStatusChange = (e: SelectChangeEvent) => {
    setStatus(e.target.value as 'pending' | 'in_progress' | 'completed');
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle>
        {mode === 'create' ? 'Yeni Görev Oluştur' : 'Görevi Düzenle'}
      </DialogTitle>
      <DialogContent>
        <Box component="form" noValidate onSubmit={handleSubmit} sx={{ mt: 2 }}>
          <TextField
            margin="normal"
            required
            fullWidth
            id="title"
            label="Görev Başlığı"
            name="title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            error={!!errors.title}
            helperText={errors.title}
            disabled={isSubmitting}
            autoFocus
          />
          
          <TextField
            margin="normal"
            fullWidth
            id="description"
            label="Açıklama"
            name="description"
            multiline
            rows={4}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            disabled={isSubmitting}
          />
          
          <LocalizationProvider dateAdapter={AdapterDateFns} adapterLocale={tr}>
            <DatePicker
              label="Bitiş Tarihi"
              value={dueDate}
              onChange={(newValue) => setDueDate(newValue)}
              slotProps={{ 
                textField: { 
                  fullWidth: true, 
                  margin: 'normal',
                  disabled: isSubmitting 
                } 
              }}
            />
          </LocalizationProvider>
          
          <FormControl 
            fullWidth 
            margin="normal" 
            error={!!errors.taskType}
            disabled={isSubmitting}
          >
            <InputLabel id="task-type-label">Görev Türü</InputLabel>
            <Select
              labelId="task-type-label"
              id="task-type"
              value={taskType}
              label="Görev Türü"
              onChange={handleTaskTypeChange}
              required
            >
              <MenuItem value="assignment">Ödev</MenuItem>
              <MenuItem value="exam">Sınav</MenuItem>
              <MenuItem value="daily">Günlük</MenuItem>
            </Select>
            {errors.taskType && <FormHelperText>{errors.taskType}</FormHelperText>}
          </FormControl>
          
          {mode === 'edit' && (
            <FormControl fullWidth margin="normal" disabled={isSubmitting}>
              <InputLabel id="status-label">Durum</InputLabel>
              <Select
                labelId="status-label"
                id="status"
                value={status}
                label="Durum"
                onChange={handleStatusChange}
              >
                <MenuItem value="pending">Bekliyor</MenuItem>
                <MenuItem value="in_progress">Devam Ediyor</MenuItem>
                <MenuItem value="completed">Tamamlandı</MenuItem>
              </Select>
            </FormControl>
          )}
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} disabled={isSubmitting}>
          İptal
        </Button>
        <Button 
          onClick={handleSubmit} 
          variant="contained" 
          color="primary"
          disabled={isSubmitting}
        >
          {isSubmitting ? 'Kaydediliyor...' : 'Kaydet'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default TaskForm; 