import React from 'react';
import { Card, CardContent, Typography, IconButton, Grid } from '@mui/material';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import { updateTask } from '../api/TaskApi'; // Assuming you have this function for updating task status

function TaskListModal({ tasks, onClose }) {
  const handleTaskStatusChange = (taskId) => {
    // Call the API to update the task status to 'DONE'
    updateTask(taskId, { status: 'DONE' })
      .then((response) => {
        console.log('Task status updated:', response.data);
      })
      .catch((error) => {
        console.error('Error updating task status:', error);
      });
  };

  return (
    <div>
      <h2>Tasks in this Project</h2>
      <Grid container spacing={3}>
        {tasks.map((task) => (
          <Grid item xs={12} sm={6} md={4} key={task.id}>
            <Card variant="outlined">
              <CardContent>
                <Typography variant="h6">{task.title}</Typography>
                <Typography variant="body2" color="textSecondary">
                  {task.description}
                </Typography>
                <div className="flex justify-between mt-2">
                  <Typography variant="body2">
                    Status: {task.status}
                  </Typography>
                  <IconButton
                    color="primary"
                    onClick={() => handleTaskStatusChange(task.id)}
                  >
                    <CheckCircleIcon />
                  </IconButton>
                </div>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </div>
  );
}

export default TaskListModal;
