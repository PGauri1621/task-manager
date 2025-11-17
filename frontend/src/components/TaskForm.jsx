import React, { useState } from "react";
import client from "../api/axiosClient";

import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  Stack,
  FormControlLabel,
  Checkbox,
  Slide,
} from "@mui/material";

// Smooth animation
const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

export default function TaskForm({ task, onClose, onCreate, onUpdate }) {
  const isNew = !task.id;
  const [title, setT] = useState(task.title || "");
  const [d, setD] = useState(task.description || "");
  const [c, setC] = useState(task.completed || false);

  const submit = async (e) => {
    e.preventDefault();

    try {
      if (isNew) {
        const r = await client.post("/tasks", {
          title,
          description: d,
        });
        onCreate(r.data);
      } else {
        const r = await client.put(`/tasks/${task.id}`, {
          title,
          description: d,
          completed: c,
        });
        onUpdate(r.data);
      }
      onClose();
    } catch {
      alert("Failed to save task");
    }
  };

  return (
    <Dialog
      open={true}
      onClose={onClose}
      TransitionComponent={Transition}
      PaperProps={{
        sx: { borderRadius: 3, p: 1, width: 400 },
      }}
    >
      <DialogTitle>{isNew ? "Create Task" : "Edit Task"}</DialogTitle>

      <DialogContent dividers>
        <Stack spacing={2}>
          <TextField
            label="Title"
            fullWidth
            value={title}
            onChange={(e) => setT(e.target.value)}
          />

          <TextField
            label="Description"
            fullWidth
            multiline
            minRows={3}
            value={d}
            onChange={(e) => setD(e.target.value)}
          />

          {!isNew && (
            <FormControlLabel
              control={
                <Checkbox
                  checked={c}
                  onChange={(e) => setC(e.target.checked)}
                />
              }
              label="Completed"
            />
          )}
        </Stack>
      </DialogContent>

      <DialogActions>
        <Button variant="contained" onClick={submit}>
          Save
        </Button>
        <Button variant="outlined" color="error" onClick={onClose}>
          Cancel
        </Button>
      </DialogActions>
    </Dialog>
  );
}
