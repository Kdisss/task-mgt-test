import React, { useState ,useEffect} from 'react';
import { BrowserRouter as Router, Routes, Route, Link, Outlet, useNavigate } from 'react-router-dom'; 
import { Avatar, Menu, MenuItem, Typography } from '@mui/material';
import StatCard from './StatCard'; // Assuming StatCard is its own component
import CreateProjectCard from '../../Components/CreateProjectCard';
import AddTaskModal from '../../Components/AddTaskModal';
import { fetchProjects, createProject, fetchAllTasks, fetchTasks, createTask, deleteProject, updateProject } from '../../api/TaskApi';
import { fetchUsers, fetchUserProfile} from '../../api/UserApi';
import TaskDetailsModal from '../../Components/TaskDetailsModal';
import ProjectUpdateModal from '../../Components/ProjectUpdateModal';


function Admin() {
  const [showCreateProjectCard, setShowCreateProjectCard] = useState(false);
  const [projects, setProjects] = useState([]);
  const [tasks, setTasks] = useState([]); 
  const [showAddTaskModal, setShowAddTaskModal] = useState(false);
  const [selectedProject, setSelectedProject] = useState(null);
  const [users, setUsers] = useState([]); 
  const [openDetailsModal, setOpenDetailsModal] = useState(false);
  const [currentProjectTasks, setCurrentProjectTasks] = useState([]); 
  const [openUpdateModal, setOpenUpdateModal] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null); // For Menu
  const [userName, setUserName] = useState(""); 
    const [user, setUser] = useState({
      fullName: "", // Initial value as empty, will be populated after fetching profile
      avatarUrl: "https://randomuser.me/api/portraits/men/1.jpg" // Default avatar URL, you can replace with actual if available
    });


  const navigate = useNavigate();
  
  // Fetch projects from backend
  useEffect(() => {
    const loadProjectsTasksAndUsers = async () => {
      try {
        const projectResponse = await fetchProjects();
        setProjects(projectResponse.data);

        const taskResponse = await fetchAllTasks(); 
        setTasks(taskResponse.data);

        const userResponse = await fetchUsers(); // Fetch users using the fetchUsers function
        setUsers(userResponse.data);  // Store users
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };
    loadProjectsTasksAndUsers();
  }, []);

  
  useEffect(() => {
    if (selectedProject) {
      // Reset tasks before fetching new ones
      setCurrentProjectTasks([]);
      
      console.log("Fetching tasks for project:", selectedProject.name);
      
      const loadTasksForProject = async () => {
        try {
          const taskResponse = await fetchTasks(selectedProject.id);
          setCurrentProjectTasks(taskResponse.data || []); // Ensure fallback for empty data
          console.log(taskResponse, 'tasks');
          
        } catch (error) {
          console.error("Error fetching tasks for project:", error);
        }
      };
  
      loadTasksForProject();
    }
  }, [selectedProject]);
  
  



  
  

    // Add a new project to the list
    const addProject = async (newProjectData) => {
      try {
        const response = await createProject(newProjectData);
        setProjects((prev) => [...prev, response.data]); // Update project list
        setShowCreateProjectCard(false); // Close modal
      } catch (error) {
        console.error('Error creating project:', error);
      }
    };



    const addNewTask = (newTask) => {
      setTasks((prevTasks) => [...prevTasks, newTask]);
    };

  // Define the function to open the modal
  const openCreateProjectCardModal = () => {
    setShowCreateProjectCard(true);
  };

  // Define the function to close the modal
  const closeCreateProjectCardModal = () => {
    setShowCreateProjectCard(false);
  };

  const openAddTaskModal = (project) => {
    setSelectedProject(project);
    setShowAddTaskModal(true);
  };

  const closeAddTaskModal = () => setShowAddTaskModal(false);


  const openDetailsModalHandler = (project) => {
    console.log("Selected Project Handler:", project);
    setSelectedProject(project);
    setOpenDetailsModal(true);
  };
  const closeDetailsModalHandler = () => {
    setOpenDetailsModal(false);
  };

  const handleMenuOpen = (event) => {
    setAnchorEl(event.currentTarget); // Open the menu on avatar click
  };

  const handleMenuClose = () => {
    setAnchorEl(null); // Close the menu
  };

  const handleLogout = () => {
    // Clear user data from localStorage or your state management
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    navigate("/"); // Redirect to the login page
  };
  
  console.log("Current Project Tasks: ", currentProjectTasks);

  const totalUsersCount = users.length;
  const usersName = users.fullName;

  const handleDeleteProject = async (projectId) => {
    try {
      // Delete the project from the backend
      await deleteProject(projectId);
  
      // After deletion, fetch the updated list of projects
      const updatedProjectsResponse = await fetchProjects();
      setProjects(updatedProjectsResponse.data); // Update the state with the new list of projects
    } catch (error) {
      console.error("Error deleting project:", error);
    }
  };

  const openUpdateProjectModal = (project) => {
    setSelectedProject(project);
    setOpenUpdateModal(true);
  };

  // Close the update modal
  const closeUpdateProjectModal = () => {
    setOpenUpdateModal(false);
    setSelectedProject(null);
  };

  const handleUpdateProject = async (projectId, updatedProjectData) => {
    try {
      // Call the updateProject function to update the project on the backend
      await updateProject(projectId, updatedProjectData);
  
      // Update the project in the local state without refetching all projects
      setProjects((prevProjects) =>
        prevProjects.map((project) =>
          project.id === projectId ? { ...project, ...updatedProjectData } : project
        )
      );
    } catch (error) {
      console.error("Error updating project:", error);
    }
  };


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
  }, []); // Empty dependency array, runs only once on mount
  
  // Calculate task counts outside useEffect
  const completedTasksCount = tasks.filter(task => task.status === 'DONE').length;
  const pendingTasksCount = tasks.filter(task => task.status === 'PENDING').length;
  const unassignedTasksCount = tasks.filter(task => task.assignedUserId === 0).length;
  return (
    
    <div className="flex h-screen">
      {/* Sidebar */}
      <div className="flex-shrink-0 w-64 p-5 text-white bg-blue-800">
        <h2 className="text-2xl font-semibold">Admin Panel</h2>
        <ul className="mt-8 space-y-4">
          <li>
            <Link to="/dashboard/admin/manage-users" className="p-2 text-white rounded hover:bg-blue-700">
                Manage Users
            </Link></li>
          
        </ul>
      </div>

      {/* Main Content */}
      <div className="flex-1 p-6 overflow-y-auto">
        {/* Top Bar */}
        <div className="flex items-center justify-between pb-4 border-b border-gray-300">
          <div className="text-xl font-semibold">Admin Dashboard</div>
          <div className="flex items-center space-x-4">
          <div className="text-gray-600">Welcome, {user.fullName || "User"}</div>
          <Avatar 
              alt={userName} 
              src="https://randomuser.me/api/portraits/men/1.jpg" 
              className="cursor-pointer" 
              onClick={handleMenuOpen}
            />
            <Menu
              anchorEl={anchorEl}
              open={Boolean(anchorEl)}
              onClose={handleMenuClose}
            >
              <MenuItem onClick={handleLogout}>Logout</MenuItem>
            </Menu>
          </div>
        </div>

        {/* Dashboard Stats */}
        <div className="grid grid-cols-1 gap-6 mt-8 sm:grid-cols-2 lg:grid-cols-3">
          <StatCard label="Total Projects" value={projects.length}/>
          <StatCard label="Total Tasks" value={tasks.length}/>
          <StatCard label="Active Users" value={totalUsersCount}/>
          <StatCard label="Completed Tasks" value={completedTasksCount}/>
          <StatCard label="Pending Tasks" value={pendingTasksCount}/>
          <StatCard label="Unassigned Tasks" value={unassignedTasksCount}/>
        </div>

        {/* Quick Actions */}
        <div className="flex mt-8 space-x-4">
          <button
            className="px-6 py-2 text-white bg-blue-800 rounded-md hover:bg-blue-700"
            onClick={openCreateProjectCardModal}
          >
            Add New Project
          </button>
          
        </div>

         {/* Projects List */}
        <div className="p-6 mt-12 bg-white rounded-lg shadow-md">
          <h3 className="text-xl font-semibold text-black">Projects</h3>
          <div className="mt-4 overflow-y-auto max-h-96">
            {projects.map((project) => (
              <div key={project.id} className="p-4 mb-4 bg-gray-300 rounded-lg shadow">
                
                <h4 className="text-lg font-semibold text-black">{project.name}</h4>
                <p className="text-gray-600">{project.description}</p>
                <p className="text-gray-600">{project.id}</p>
                <div className="project-button-container">
                <button 
                className="px-4 py-2 mt-2 text-white bg-blue-800 rounded-md hover:bg-blue-700" 
                onClick={() => openDetailsModalHandler(project)}>
                More Details
              </button>
              
              <button
              className="px-4 py-2 mt-2 text-white bg-blue-800 rounded-md hover:bg-blue-600 "
              onClick={() => openUpdateProjectModal(project)}>
              Edit
              </button>
             
              <button 
              className="px-4 py-2 mt-2 text-white bg-red-800 rounded-md hover:bg-red-700" 
              onClick={() => handleDeleteProject(project.id)}>
              Delete Project
            </button>
            </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Modal Component */}
      {showCreateProjectCard && (
        <CreateProjectCard handleClose={closeCreateProjectCardModal} addProject={addProject} />
      )}
      {showAddTaskModal && selectedProject && (
        <AddTaskModal 
        handleClose={closeAddTaskModal} 
        project={selectedProject} 
        addTaskToState={addNewTask} />
      )}

      <TaskDetailsModal
        open={openDetailsModal}
        onClose={closeDetailsModalHandler}
        selectedProject={selectedProject}
        tasks={currentProjectTasks} // Pass the fetched tasks
        onAddTaskClick={() => openAddTaskModal(selectedProject)}
      />

      {selectedProject && (
        <ProjectUpdateModal
          open={openUpdateModal}
          onClose={closeUpdateProjectModal}
          project={selectedProject}
          onUpdate={handleUpdateProject}
        />
      )}

    </div>

      
    
    
  );
}

export default Admin;
