import React, { useState, useEffect } from 'react';
import { Button, Modal, Box, Grid, Card, CardContent, Typography, IconButton, Avatar, Menu, MenuItem } from '@mui/material';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import { fetchProjects, fetchUserTasks } from '../../api/TaskApi'; // Assuming this function fetches projects for the user
import { fetchTasks } from '../../api/TaskApi'; // Fetch tasks for a specific project
import { updateTask } from '../../api/TaskApi'; // Function to update task status to 'DONE'
import { fetchUserProfile } from '../../api/UserApi'; // New API method to fetch user profile
import StatCard from '../AdminDashboard/StatCard'; // Assuming StatCard is your existing component

function UserDashboard() {
  const [projects, setProjects] = useState([]);
  const [tasks, setTasks] = useState([]);
  const [openModal, setOpenModal] = useState(false);
  const [selectedProjectTasks, setSelectedProjectTasks] = useState([]);
  const [selectedProjectName, setSelectedProjectName] = useState("");
  const [completedTasks, setCompletedTasks] = useState(0);
  const [pendingTasks, setPendingTasks] = useState(0);
  const [unassignedTasks, setUnassignedTasks] = useState(0);
  const [activeProjects, setActiveProjects] = useState(0); 

  const [anchorEl, setAnchorEl] = useState(null); // For the avatar dropdown
  const [user, setUser] = useState({
    fullName: "", // Initial value as empty, will be populated after fetching profile
    avatarUrl: "https://randomuser.me/api/portraits/men/1.jpg" // Default avatar URL, you can replace with actual if available
  });

  useEffect(() => {
    // Fetch user profile
    fetchUserProfile()
      .then((response) => {
        setUser({
          fullName: response.data.fullName, // Set the full name from the response
          avatarUrl: response.data.avatarUrl || "https://randomuser.me/api/portraits/men/1.jpg" // Set avatar if available
        });
      })
      .catch((error) => {
        console.error("Error fetching user profile:", error);
      });

    // Fetch initial data (projects)
    fetchProjects()
      .then((response) => {
        setProjects(response.data);
      })
      .catch((error) => console.error("Error fetching projects:", error));
  }, []);
// Trigger this effect only when projects change



  const handleOpenModal = (projectId, projectName) => {
    fetchTasks(projectId)
      .then((response) => {
        setSelectedProjectTasks(response.data);
        setSelectedProjectName(projectName);
        setOpenModal(true);
      })
      .catch((error) => console.error("Error fetching tasks:", error));
  };

  const handleCloseModal = () => {
    setOpenModal(false);
    setSelectedProjectTasks([]);
    setSelectedProjectName("");
  };

  const handleTaskStatusChange = (taskId) => {
    updateTask(taskId, { status: 'DONE' })
      .then((response) => {
        setSelectedProjectTasks((prevTasks) =>
          prevTasks.map((task) =>
            task.id === taskId ? { ...task, status: 'DONE' } : task
          )
        );
      })
      .catch((error) => {
        console.error('Error updating task status:', error);
      });
  };

  const handleAvatarClick = (event) => {
    setAnchorEl(event.currentTarget); // Open the dropdown menu
  };

  const handleLogout = () => {
    console.log("Logging out...");
    localStorage.removeItem("token");
    localStorage.removeItem("role"); // Clear token from local storage
    window.location.href = "/"; // Redirect to login page
  };

  const handleCloseMenu = () => {
    setAnchorEl(null); // Close the menu
  };

  const openMenu = Boolean(anchorEl);

  useEffect(() => {
    const loadUserData = async () => {
      try {
        // Fetch tasks assigned to the user
        const taskResponse = await fetchUserTasks();
        const userTasks = taskResponse.data;
        setTasks(userTasks);

        // Fetch all projects
        const projectResponse = await fetchProjects();
        const allProjects = projectResponse.data;
        setProjects(allProjects);

        // Calculate task statuses
        const completed = userTasks.filter(task => task.status === 'DONE').length;
        const pending = userTasks.filter(task => task.status === 'PENDING').length;
        const unassigned = userTasks.filter(task => !task.assignedTo).length;

        setCompletedTasks(completed);
        setPendingTasks(pending);
        setUnassignedTasks(unassigned);

        // Calculate active projects (projects the user has tasks in)
        const activeProjectCount = allProjects.length;

        setActiveProjects(activeProjectCount);
      } catch (error) {
        console.error('Error fetching user tasks or projects:', error);
      }
    };

    loadUserData();
  }, []);
  

  return (
    <div>
      {/* Top Bar */}
      <div className="flex items-center justify-between pb-4 border-b border-gray-300">
        <div className="pt-4 pl-4 text-xl font-semibold">User Dashboard</div>
        <div className="flex items-center space-x-4">
          <div className="pt-4 text-white">Welcome, {user.fullName || "User"}</div>
          <div className='pt-4 pr-4'>
            <Avatar
              src={user.avatarUrl}
              alt={user.fullName}
              className="cursor-pointer"
              onClick={handleAvatarClick}
            />
          </div>
          <Menu
            anchorEl={anchorEl}
            open={openMenu}
            onClose={handleCloseMenu}
            MenuListProps={{
              'aria-labelledby': 'basic-button',
            }}
          >
            <MenuItem onClick={handleLogout}>Logout</MenuItem>
          </Menu>
        </div>
      </div>

      {/* Dashboard Stats */}
      <div className="grid grid-cols-1 gap-6 mt-8 ml-4 mr-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard label="Active Projects" value={activeProjects} />
        <StatCard label="Assigned Tasks" value={tasks.length} />
        <StatCard label="Completed Tasks" value={completedTasks} />
        <StatCard label="Pending Tasks" value={pendingTasks} />
      </div>

      {/* Quick Actions */}


      <div className="p-6 overflow-y-auto">
      {/* Projects List Container */}
      <h2 className="mb-6 text-2xl font-semibold text-white">My Projects</h2>
      
      {/* Grid Layout for Projects */}
      <Grid container spacing={3}>
        {projects.map((project) => (
          <Grid item xs={12} sm={6} md={4} key={project.id}>
            {/* Project Card */}
            <Card variant="outlined" className="shadow-lg">
              <CardContent>
                <Typography variant="h6" className="font-semibold text-black">{project.name}</Typography>
                <Typography variant="body2" color="textSecondary" className="mt-2">
                  {project.description}
                </Typography>

                {/* Button for More Details */}
                <Button
                  variant="contained"
                  color="primary"
                  onClick={() => handleOpenModal(project.id, project.name)}
                  className="mt-4"
                >
                  More Details
                </Button>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </div>

      {/* Modal for displaying tasks */}
      <Modal open={openModal} onClose={handleCloseModal}>
        <Box sx={{ width: 600, margin: 'auto', backgroundColor: 'white', padding: 4 }}>
          <h2>{selectedProjectName} - Tasks</h2>
          <Grid container spacing={3}>
            {selectedProjectTasks.map((task) => (
              <Grid item xs={12} sm={6} md={4} key={task.id}>
                <Card variant="outlined">
                  <CardContent>
                    <Typography variant="h6">{task.title}</Typography>
                    <Typography variant="body2" color="textSecondary">
                      {task.description}
                    </Typography>
                    <div className="flex justify-between mt-2">
                      <Typography variant="body2">Status: {task.status}</Typography>
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
        </Box>
      </Modal>
    </div>
  );
}

export default UserDashboard;
