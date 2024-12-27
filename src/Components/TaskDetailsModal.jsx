import React, { useState, useEffect } from "react";
import { fetchUsers } from "../api/UserApi";
import { assignUser, fetchTasks, deleteTask, deleteProject,updateTask } from "../api/TaskApi";
import { Modal, Box, Typography, Button, Card, CardContent, Grid, TextField } from "@mui/material";


const TaskDetailsModal = ({
  open,
  onClose,
  selectedProject,
  tasks,
  onAddTaskClick,
}) => {
  const [assignModalOpen, setAssignModalOpen] = useState(false);
  const [selectedTask, setSelectedTask] = useState(null);
  const [users, setUsers] = useState([]);
  const [taskWithUsers, setTaskWithUsers] = useState([]);  // Store tasks with assigned users
  const [detailsModalOpen, setDetailsModalOpen] = useState(false);
  const [updateModalOpen, setUpdateModalOpen] = useState(false);
const [updatedTaskData, setUpdatedTaskData] = useState({
  title: '',
  description: '',
  status: '',
  deadline: ''
}); // Modal to show task details

  useEffect(() => {
    const loadUsers = async () => {
      try {
        const response = await fetchUsers();
        setUsers(response.data);  // Store users in state
      } catch (error) {
        console.error("Error fetching users:", error);
      }
    };

    if (open) {
      loadUsers();  // Fetch users when the modal opens
    }
  }, [open]);

  // Fetch tasks and map them with assigned users
  useEffect(() => {
    const loadTasks = async () => {
      if (selectedProject) {
        try {
          const taskResponse = await fetchTasks(selectedProject.id);
          const tasksWithAssignedUsers = taskResponse.data.map((task) => {
            const assignedUser = task.assignedUserId
              ? users.find((user) => user.id === task.assignedUserId)
              : null;
            return { ...task, assignedUser };
          });
          setTaskWithUsers(tasksWithAssignedUsers);
        } catch (error) {
          console.error("Error fetching tasks:", error);
        }
      }
    };

    if (selectedProject) {
      loadTasks();
    }
  }, [open, selectedProject, users]);

  const handleAssignClick = (task) => {
    setSelectedTask(task);
    setAssignModalOpen(true);
  };

  const closeAssignModal = () => {
    setAssignModalOpen(false);
    setSelectedTask(null);
  };

  const handleUserSelect = async (user) => {
    if (!selectedTask) return;
  
    try {
      // Assign user to the task but ensure status remains "PENDING"
      const updatedTask = await assignUser(selectedTask.id, user.id);  // Call assignUser API
      console.log(`Task "${updatedTask.data.title}" assigned to ${user.fullName}`);
      
      // Close the modal after successful assignment
      setAssignModalOpen(false);
  
      // Refresh tasks after assignment
      const taskResponse = await fetchTasks(selectedProject.id);
      
      // Map over tasks to include assigned users and ensure status remains "PENDING"
      const tasksWithAssignedUsers = taskResponse.data.map((task) => {
        const assignedUser = task.assignedUserId
          ? users.find((user) => user.id === task.assignedUserId)
          : null;
        // Ensure task status stays "PENDING" when assigned
        if (task.status !== 'DONE' && task.assignedUserId) {
          task.status = 'PENDING'; // Ensure the status is "PENDING" for assigned tasks
        }
        return { ...task, assignedUser };
      });
      
      // Update task state with the tasks containing the assigned user and status
      setTaskWithUsers(tasksWithAssignedUsers);
    } catch (error) {
      console.error("Error assigning user to task:", error);
      alert("Failed to assign user to task.");
    }
  };
  

  const projectTasks = taskWithUsers;  // Use tasks with users for rendering

  // Function for opening the Task Details Modal
  const handleMoreDetailsClick = (task) => {
    setSelectedTask(task);
    setDetailsModalOpen(true);
  };

  const closeDetailsModal = () => {
    setDetailsModalOpen(false);
    setSelectedTask(null);
  };

    // Delete task function
    const handleDeleteTask = async (taskId) => {
      try {
        await deleteTask(taskId);
        console.log(`Task with ID ${taskId} deleted successfully`);
  
        // Refresh tasks after deletion
        const taskResponse = await fetchTasks(selectedProject.id);
        const tasksWithAssignedUsers = taskResponse.data.map((task) => {
          const assignedUser = task.assignedUserId
            ? users.find((user) => user.id === task.assignedUserId)
            : null;
          return { ...task, assignedUser };
        });
        setTaskWithUsers(tasksWithAssignedUsers);
  
        closeDetailsModal(); // Close the modal after deletion
      } catch (error) {
        console.error("Error deleting task:", error);
        alert("Failed to delete task.");
      }
    };


    const handleDeleteProject = async () => {
      try {
        // Call the delete API
        await deleteProject(selectedProject.id);
        console.log(`Project with ID ${selectedProject.id} deleted successfully`);
    
        // Fetch the updated project list and pass it to the parent component
         // This will trigger the parent to re-fetch the projects
    
        // Close the modal after deletion
        onClose();
      } catch (error) {
        console.error("Error deleting project:", error);
        alert("Failed to delete project.");
      }
    };

    const handleUpdateSubmit = async () => {
      try {
        const updatedTask = await updateTask(selectedTask.id, updatedTaskData); // Call updateTask API
        console.log(`Task "${updatedTask.data.title}" updated successfully`);
    
        // Refresh tasks after update
        const taskResponse = await fetchTasks(selectedProject.id);
        const tasksWithAssignedUsers = taskResponse.data.map((task) => {
          const assignedUser = task.assignedUserId
            ? users.find((user) => user.id === task.assignedUserId)
            : null;
          return { ...task, assignedUser };
        });
        setTaskWithUsers(tasksWithAssignedUsers);
        
        setUpdateModalOpen(false);
      } catch (error) {
        console.error("Error updating task:", error);
        alert("Failed to update task.");
      }
    };
    

    const handleUpdateTask = async (taskId, updatedTaskData) => {
      try {
        // Update the task using the updateTask function
        await updateTask(taskId, updatedTaskData);
    
        // Optionally, you can update the task in the local state here if needed
        setTaskWithUsers((prevTasks) =>
          prevTasks.map((task) =>
            task.id === taskId ? { ...task, ...updatedTaskData } : task
          )
        );
        console.log("Task updated successfully");
      } catch (error) {
        console.error("Error updating task:", error);
      }
    };

    const handleUpdateTaskClick = (task) => {
      setSelectedTask(task);
      setUpdatedTaskData({
        title: task.title || '',
        description: task.description || '',
        status: task.status || '',
        deadline: task.deadline || ''
      });
      setUpdateModalOpen(true);
    };
    
    
  return (
    <>
      <Modal open={open} onClose={onClose}>
        <Box
          sx={{
            width: 600,
            overflowY: "auto",
            p: 4,
            bgcolor: "background.paper",
            borderRadius: 2,
            boxShadow: 24,
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
          }}
        >
          <Typography className="text-black" variant="h6" gutterBottom>
            Project: {selectedProject?.name || "No project selected"}
          </Typography>
          <Typography className="text-black" variant="body1" gutterBottom>
            {selectedProject?.description || "No description available"}
          </Typography>
          <div style={{ maxHeight: "300px", overflowY: "scroll" }}>
            <Typography className="text-black" variant="h6" gutterBottom>
              Tasks:
            </Typography>
            {projectTasks.length > 0 ? (
              <Grid container spacing={2}>
                {projectTasks.map((task) => (
                  <Grid item xs={12} sm={6} md={4} key={task.id}>
                    <Card variant="outlined">
                      <CardContent>
                        <Typography className="text-black" variant="h6">
                          {task.title || "Untitled Task"}
                        </Typography>
                        <Typography variant="body2" color="textSecondary" gutterBottom>
                          {task.description || "No description available"}
                        </Typography>
                        <Typography variant="body2" color="textSecondary" sx={{ mt: 1 }}>
                          {task.assignedUser ? (
                            `Assigned to: ${task.assignedUser.fullName}`
                          ) : (
                            "Not Assigned"
                          )}
                        </Typography>
                        <Button
                          variant="contained"
                          color="primary"
                          onClick={() => handleAssignClick(task)}
                          sx={{ mt: 2 }}
                        >
                          Assign User
                        </Button>
                        <Button
                        variant="outlined"
                        color="primary"
                        onClick={() => handleMoreDetailsClick(task)}  // More details button
                        sx={{ mt: 2, ml: 2 }}
                      >
                        More Details
                      </Button>
                      </CardContent>
                    </Card>
                  </Grid>
                ))}
              </Grid>
            ) : (
              <Typography variant="body2" color="textSecondary">
                No tasks for this project
              </Typography>
            )}
          </div>
          <Box mt={2} display="flex" justifyContent="flex-end">
            <Button variant="contained" color="primary" onClick={onAddTaskClick}>
              Add Task
            </Button>
            <Button
              variant="contained"
              color="secondary"
              onClick={handleDeleteProject}
            >
              Delete Project
            </Button>
          </Box>
        </Box>
      </Modal>

      {/* Assign User Modal */}
      <Modal open={assignModalOpen} onClose={closeAssignModal}>
        <Box
          sx={{
            width: 400,
            p: 4,
            bgcolor: "background.paper",
            borderRadius: 2,
            boxShadow: 24,
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
          }}
        >
          <Typography className="text-black" variant="h6" gutterBottom>
            Assign Task: {selectedTask?.title}
          </Typography>
          <Box
            display="grid"
            gap={2}
            sx={{
              maxHeight: "300px",
              overflowY: "scroll",  // Make the user list scrollable
            }}
          >
            {Array.isArray(users) && users.length > 0 ? (
              users.map((user) => (
                <Box key={user.id}>
                  <Card variant="outlined">
                    <CardContent>
                      <Typography variant="h6">
                        Name: {user.fullName} (ID: {user.id})
                      </Typography>
                      <Button
                        variant="contained"
                        color="primary"
                        onClick={() => handleUserSelect(user)}
                        sx={{ mt: 2 }}
                      >
                        Assign
                      </Button>
                    </CardContent>
                  </Card>
                </Box>
              ))
            ) : (
              <Typography variant="body2" color="textSecondary">
                No users available
              </Typography>
            )}
          </Box>
        </Box>
      </Modal>

      {/* Task Details Modal */}
      <Modal open={detailsModalOpen} onClose={closeDetailsModal}>
        <Box
          sx={{
            width: 600,
            p: 4,
            bgcolor: "background.paper",
            borderRadius: 2,
            boxShadow: 24,
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
          }}
        >
          <Typography className="text-black" variant="h6" gutterBottom>
            Task Details: {selectedTask?.title}
          </Typography>
          <Typography className="text-black" variant="h6" gutterBottom>
            Task ID: {selectedTask?.id}
          </Typography>
          <Typography className="text-black" variant="body1" gutterBottom>
            Description: {selectedTask?.description || "No description available"}
          </Typography>
          <Typography className="text-black" variant="body1" gutterBottom>
            Status: {selectedTask?.status || "No status available"}
          </Typography>
          <Typography className="text-black" variant="body1" gutterBottom>
            Assigned to: {selectedTask?.assignedUser ? selectedTask.assignedUser.fullName : "Not Assigned"}
          </Typography>
          <Typography className="text-black" variant="body1" gutterBottom>
            Deadline: {selectedTask?.deadline || "No deadline available"}
          </Typography>
          <Box display="flex" justifyContent="flex-end">
            <Button variant="contained" color="primary" onClick={closeDetailsModal}>
              Close
            </Button>
            <Button
              variant="contained"
              color="secondary"
              onClick={() => handleDeleteTask(selectedTask.id)}
            >
              Delete Task
            </Button>
            <Button
            variant="contained"
            color="secondary"
            onClick={() => handleUpdateTaskClick(selectedTask)}
           >
            Update Task
          </Button>
          </Box>
        </Box>
      </Modal>

      <Modal open={updateModalOpen} onClose={() => setUpdateModalOpen(false)}>
  <Box
    sx={{
      width: 600,
      p: 4,
      bgcolor: "background.paper",
      borderRadius: 2,
      boxShadow: 24,
      position: "absolute",
      top: "50%",
      left: "50%",
      transform: "translate(-50%, -50%)",
    }}
  >
    <Typography className="text-black" variant="h6" gutterBottom>
      Update Task: {selectedTask?.title}
    </Typography>
    <Box
      display="flex"
      flexDirection="column"
      gap={2}
    >
      <TextField
        label="Title"
        value={updatedTaskData.title}
        onChange={(e) => setUpdatedTaskData({ ...updatedTaskData, title: e.target.value })}
        fullWidth
      />
      <TextField
        label="Description"
        value={updatedTaskData.description}
        onChange={(e) => setUpdatedTaskData({ ...updatedTaskData, description: e.target.value })}
        fullWidth
      />
      <TextField
        label="Status"
        value={updatedTaskData.status}
        onChange={(e) => setUpdatedTaskData({ ...updatedTaskData, status: e.target.value })}
        fullWidth
      />
      <TextField
        label="Deadline"
        value={updatedTaskData.deadline}
        onChange={(e) => setUpdatedTaskData({ ...updatedTaskData, deadline: e.target.value })}
        fullWidth
      />
      <Box display="flex" justifyContent="flex-end" gap={2}>
        <Button
          variant="contained"
          color="primary"
          onClick={handleUpdateSubmit}
        >
          Update Task
        </Button>
        <Button
          variant="outlined"
          color="secondary"
          onClick={() => setUpdateModalOpen(false)}
        >
          Cancel
        </Button>
      </Box>
    </Box>
  </Box>
</Modal>
    </>
  );
};

export default TaskDetailsModal;
