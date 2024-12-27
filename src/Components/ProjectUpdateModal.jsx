import React, { useState } from "react";
import { Modal, TextField, Button, Box } from "@mui/material";

const ProjectUpdateModal = ({ open, onClose, project, onUpdate }) => {
  const [updatedName, setUpdatedName] = useState(project?.name || "");
  const [updatedDescription, setUpdatedDescription] = useState(project?.description || "");

  const handleSubmit = (event) => {
    event.preventDefault();

    // Prepare the updated project data
    const updatedProjectData = {
      name: updatedName,
      description: updatedDescription,
    };

    // Call the onUpdate function to handle the project update
    onUpdate(project.id, updatedProjectData);
  };

  return (
    <Modal open={open} onClose={onClose}>
      <Box
        sx={{
          width: 400,
          margin: "auto",
          padding: 3,
          backgroundColor: "white",
          borderRadius: "8px",
          top: "20%",
          position: "relative",
        }}
      >
        <h2>Update Project</h2>
        <form onSubmit={handleSubmit}>
          <TextField
            label="Project Name"
            fullWidth
            value={updatedName}
            onChange={(e) => setUpdatedName(e.target.value)}
            margin="normal"
          />
          <TextField
            label="Project Description"
            fullWidth
            value={updatedDescription}
            onChange={(e) => setUpdatedDescription(e.target.value)}
            margin="normal"
            multiline
            rows={4}
          />
          <div className="flex justify-end mt-4 space-x-4">
            <Button onClick={onClose} variant="outlined" color="secondary">
              Cancel
            </Button>
            <Button type="submit" variant="contained" color="primary">
              Update Project
            </Button>
          </div>
        </form>
      </Box>
    </Modal>
  );
};

export default ProjectUpdateModal;
