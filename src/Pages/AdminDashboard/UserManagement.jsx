import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { fetchUsers, updateUser, deleteUser } from '../../api/UserApi';
import { signupUser } from '../../api/AuthApi';
import { Box, Button, Modal, TextField, Typography, Select, MenuItem, Table, TableBody, TableCell, TableHead, TableRow } from '@mui/material';

const UserManagement = () => {

    const navigate = useNavigate(); 
  const [users, setUsers] = useState([]);
  const [openModal, setOpenModal] = useState(false);
  const [editUser, setEditUser] = useState(null);
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    password: '',
    role: '',
  });

  // Fetch all users on component load
  useEffect(() => {
    const loadUsers = async () => {
      try {
        const response = await fetchUsers();
        setUsers(response.data);
      } catch (error) {
        console.error('Error fetching users:', error);
      }
    };
    loadUsers();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleCreateOrUpdate = async () => {
    try {
      // Prepare the user data to send to the backend
      const userData = {
        id: editUser ? editUser.id : null, // Include the ID if it's an edit, else null for create
        email: formData.email,
        fullName: formData.fullName,
        password: formData.password, // Include password even if not being updated
        role: formData.role,
      };
  
      if (editUser) {
        // Update user
        const response = await updateUser(userData); // Send the data to the backend
      } else {
        // Create user
        const response = await signupUser(userData); // Create a new user
      }
      handleCloseModal();
  
      // Reload the page to reflect changes in the table
      window.location.reload();
    } catch (error) {
      if (error.response) {
        console.error('Error details:', error.response.data); // Log the error response body
      }
      console.error('Error saving user:', error);
    }
  };
  
  
  
  
  const handleDelete = async (userId) => {
    try {
      await deleteUser(userId);
      setUsers((prev) => prev.filter((user) => user.id !== userId));
    } catch (error) {
      console.error('Error deleting user:', error);
    }
  };

  const handleEdit = (user) => {
    setEditUser(user);
    setFormData({ fullName: user.fullName, email: user.email, password: '', role: user.role });
    setOpenModal(true);
  };

  const handleCloseModal = () => {
    setOpenModal(false);
    setEditUser(null);
    setFormData({ fullName: '', email: '', password: '', role: '' });
  };

  const handleGoBack = () => {
    navigate('/dashboard/admin'); // Replace with the actual route for your Admin Dashboard
  };


  return (
    <Box p={4}>
      <Typography variant="h4" gutterBottom>User Management</Typography>

      <Button
    variant="outlined"
    onClick={() => handleGoBack()}  // Adjust path if needed
    style={{ padding: '10px 20px', fontWeight: 'bold' }}
    >
    Back to Admin Dashboard
    </Button>

    <div className='p-2'/>

    <Button variant="contained" color="primary" onClick={() => setOpenModal(true)}>
        Add New User
      </Button>
      
      
      {/* User Table */}
      <Box mt={4}>
      <Table className="text-center rounded-lg">
  <TableHead>
    <TableRow>
      <TableCell className="font-bold bg-[#0059b3] text-center">User ID</TableCell>
      <TableCell className="font-bold bg-[#0059b3] text-center">Full Name</TableCell>
      <TableCell className="font-bold bg-[#0059b3] text-center">Email</TableCell>
      <TableCell className="font-bold bg-[#0059b3] text-center">Role</TableCell>
      <TableCell className="font-bold bg-[#0059b3] text-center">Actions</TableCell>
    </TableRow>
  </TableHead>
  <TableBody>
    {users.map((user) => (
      <TableRow key={user.id} className="bg-[#c5e1f7] hover:bg-[#b3e0ff]">
        <TableCell className="text-center">{user.id}</TableCell>
        <TableCell className="text-center">{user.fullName}</TableCell>
        <TableCell className="text-center">{user.email}</TableCell>
        <TableCell className="text-center">{user.role}</TableCell>
        <TableCell className="text-center">
          <Button variant="outlined" color="primary" onClick={() => handleEdit(user)}>Edit</Button>
          <Button variant="outlined" color="secondary" onClick={() => handleDelete(user.id)} style={{ marginLeft: 8 }}>
            Delete
          </Button>
        </TableCell>
      </TableRow>
    ))}
  </TableBody>
</Table>

      </Box>

      {/* Add/Edit User Modal */}
      <Modal open={openModal} onClose={handleCloseModal}>
        <Box
          sx={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            bgcolor: 'background.paper',
            p: 4,
            borderRadius: 2,
            boxShadow: 24,
            width: 400,
          }}
        >
          <Typography variant="h6">{editUser ? 'Edit User' : 'Add New User'}</Typography>
          
          {/* User ID (Non-editable) */}
          {editUser && (
            <TextField
              fullWidth
              margin="normal"
              label="User ID"
              value={editUser.id}
              InputProps={{ readOnly: true }}
            />
          )}

            <TextField
            fullWidth
            margin="normal"
            label="Email"
            name="email"
            value={formData.email}
            onChange={handleInputChange}
            disabled={editUser !== null}
             // Make email field non-editable
          />
          
          <TextField
            fullWidth
            margin="normal"
            label="Full Name"
            name="fullName"
            value={formData.fullName}
            onChange={handleInputChange}
          />
          
          {/* Remove password field during update */}
          {!editUser && (
            <TextField
              fullWidth
              margin="normal"
              label="Password"
              name="password"
              type="password"
              value={formData.password}
              onChange={handleInputChange}
            />
          )}
          <Select
            fullWidth
            margin="normal"
            name="role"
            value={formData.role}
            onChange={handleInputChange}
            displayEmpty
          >
            <MenuItem value="" disabled>
              Select Role
            </MenuItem>
            <MenuItem value="ROLE-ADMIN">Admin</MenuItem>
            <MenuItem value="ROLE-CUSTOMER">User</MenuItem>
          </Select>
          <Box mt={2} display="flex" justifyContent="flex-end">
            <Button variant="outlined" onClick={handleCloseModal}>
              Cancel
            </Button>
            <Button variant="contained" color="primary" onClick={handleCreateOrUpdate} style={{ marginLeft: 8 }}>
              {editUser ? 'Update' : 'Create'}
            </Button>
          </Box>
        </Box>
      </Modal>
      
    </Box>
    
  );
};

export default UserManagement;
