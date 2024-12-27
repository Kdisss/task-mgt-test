import * as React from 'react';
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

export default function CreateProjectCard({ handleClose, addProject }) {
  const [project, setProject] = React.useState({
    name: '',
    description: '',
  });

  // Handle input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setProject((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Handle form submission
  const handleCreate = async () => {
    try {
      const token = localStorage.getItem('token');
      console.log('JWT Token:', token);  // Check the token in the browser's console

      const response = await axios.post('http://localhost:5002/api/projects', project, {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`  // Add the token here
        }
      });  // Send data to the backend
      console.log('Project Created:', response.data);

      addProject(response.data);

      handleClose();  // Close modal
      setProject({ name: '', description: '' });  // Reset form
    } catch (error) {
      console.error('Error creating project:', error);
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
          Create New Project
        </Typography>
        <TextField
          fullWidth
          label="Project Name"
          variant="outlined"
          name="name"
          value={project.name}
          onChange={handleChange}
          margin="normal"
        />
        <TextField
          fullWidth
          label="Project Description"
          variant="outlined"
          name="description"
          value={project.description}
          onChange={handleChange}
          margin="normal"
          multiline
          rows={3}
        />
        <Box mt={2} display="flex" justifyContent="flex-end">
          <Button variant="contained" color="primary" onClick={handleCreate}>
            CREATE
          </Button>
        </Box>
      </Box>
    </Modal>
  );
}
