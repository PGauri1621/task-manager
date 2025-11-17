import React, { useState } from "react";
import client from "../api/axiosClient";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";
import {
  Card,
  CardContent,
  CardActions,
  Typography,
  IconButton,
  Collapse,
  Stack,
  Chip,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import { grey } from "@mui/material/colors";

const MySwal = withReactContent(Swal);

export default function TaskItem({ task, onEdit, onDelete, onUpdate }) {
  const [busy, setBusy] = useState(false);
  const [open, setOpen] = useState(true);

  const updateStatus = async (status) => {
    setBusy(true);
    try {
      const updatedTask = {
        ...task,
        completed: status === "completed",
        pending: status === "pending",
      };
      const r = await client.put(`/tasks/${task.id}`, updatedTask);
      onUpdate(r.data);
    } catch {
      alert("Failed to update");
    } finally {
      setBusy(false);
    }
  };

  const del = async () => {
    const result = await MySwal.fire({
      title: "Are you sure?",
      text: "This task will be permanently deleted!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Yes, delete it!",
    });

    if (result.isConfirmed) {
      try {
        await client.delete(`/tasks/${task.id}`);
        setOpen(false);
        setTimeout(() => onDelete(task.id), 250);
        MySwal.fire("Deleted!", "The task has been deleted.", "success");
      } catch {
        MySwal.fire("Error", "Failed to delete task", "error");
      }
    }
  };

  const currentStatus = task.completed ? "completed" : task.pending ? "pending" : "pending";

  return (
    <Collapse in={open} timeout={300}>
      <Card
        variant="outlined"
        sx={{
          mb: 2,
          borderRadius: 3,
          transition: "0.2s",
          "&:hover": { boxShadow: 3 },
        }}
      >
        <CardContent>
          <Stack direction="row" spacing={2} alignItems="center">
            <Stack spacing={0} sx={{ flexGrow: 1 }}>
              <Stack direction="row" spacing={1} alignItems="center">
                <Typography
                  variant="h6"
                  sx={{
                    textDecoration: task.completed ? "line-through" : "none",
                  }}
                >
                  {task.title}
                </Typography>

                {task.completed && (
                  <Chip label="Completed" size="small" color="success" />
                )}
                {!task.completed && task.pending && (
                  <Chip label="Pending" size="small" color="warning" />
                )}
              </Stack>

              {task.description && (
                <Typography
                  variant="body2"
                  color={grey[600]}
                  sx={{
                    textDecoration: task.completed ? "line-through" : "none",
                  }}
                >
                  {task.description}
                </Typography>
              )}
            </Stack>

            {/* STATUS SELECTOR */}
            <FormControl size="small" sx={{ minWidth: 120 }}>
              <InputLabel>Status</InputLabel>
              <Select
                value={currentStatus}
                label="Status"
                onChange={(e) => updateStatus(e.target.value)}
                disabled={busy}
              >
                <MenuItem value="pending">Pending</MenuItem>
                <MenuItem value="completed">Completed</MenuItem>
              </Select>
            </FormControl>
          </Stack>
        </CardContent>

        <CardActions sx={{ justifyContent: "flex-end" }}>
          <IconButton onClick={() => onEdit(task)}>
            <EditIcon />
          </IconButton>

          <IconButton color="error" onClick={del}>
            <DeleteIcon />
          </IconButton>
        </CardActions>
      </Card>
    </Collapse>
  );
}
