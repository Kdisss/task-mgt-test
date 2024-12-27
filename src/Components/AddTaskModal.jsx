import React, { useState } from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import Modal from '@mui/material/Modal';
import axios from 'axios';

const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 400,
  bgcolor: 'background.paper',
  borderRadius: 2,
  boxShadow: 24,
  p: 4,
};

function AddTaskModal({ handleClose, project, addTaskToState }) {
  const [task, setTask] = useState({
    title: '',
    image: '',
    description: '',
    deadline: '',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setTask((prevTask) => ({
      ...prevTask,
      [name]: value,
    }));
  };

  const handleAddTask = async () => {
    try {
      const token = localStorage.getItem('token');

      const formattedTask = {
        ...task,
        deadline: task.deadline ? `${task.deadline}T00:00:00` : null,
      };

      // Make the request to add the task
      const response = await axios.post(
        `http://localhost:5002/api/tasks?projectId=${project.id}`,
        formattedTask,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      console.log('Task added successfully:', response.data);

      // Pass the new task data to the parent to update the state
      addTaskToState(response.data);

      // Reset the form
      setTask({ title: '', image: '', description: '', deadline: '' });

      // Close the modal
      handleClose();
    } catch (error) {
      console.error('Error adding task:', error);
    }
  };

  return (
    <Modal
      open={true}
      onClose={handleClose}
      aria-labelledby="modal-modal-title"
      aria-describedby="modal-modal-description"
    >
      <Box sx={style}>
        <Typography id="modal-modal-title" variant="h6" component="h2" gutterBottom>
          Add Task to {project.name}
        </Typography>
        <TextField
          fullWidth
          label="Task Title"
          variant="outlined"
          name="title"
          value={task.title}
          onChange={handleChange}
          margin="normal"
        />
        <TextField
          fullWidth
          label="Task Image URL"
          variant="outlined"
          name="image"
          value={task.image}
          onChange={handleChange}
          margin="normal"
        />
        <TextField
          fullWidth
          label="Task Description"
          variant="outlined"
          name="description"
          value={task.description}
          onChange={handleChange}
          margin="normal"
          multiline
          rows={3}
        />
        <TextField
          fullWidth
          label="Task Deadline"
          variant="outlined"
          name="deadline"
          type="date"
          value={task.deadline}
          onChange={handleChange}
          margin="normal"
          InputLabelProps={{ shrink: true }}
        />
        <Box mt={2} display="flex" justifyContent="flex-end">
          <Button variant="contained" color="primary" onClick={handleAddTask}>
            Add Task
          </Button>
        </Box>
      </Box>
    </Modal>
  );
}

export default AddTaskModal;
