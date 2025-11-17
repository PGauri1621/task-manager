import React, { useEffect, useState } from "react";
import client from "../api/axiosClient";
import { useAuth } from "../contexts/AuthContext";
import TaskItem from "../components/TaskItem";
import TaskForm from "../components/TaskForm";

// MUI imports
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  Container,
  CircularProgress,
  Alert,
  List,
  Box,
} from "@mui/material";

export default function TaskListPage() {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [editing, setEditing] = useState(null);

  const { user, logout } = useAuth();

  useEffect(() => {
    (async () => {
      try {
        const r = await client.get("/tasks");
        setTasks(r.data);
      } catch (e) {
        setError("Failed to load tasks.");
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  return (
    <>
      {/* Top AppBar */}
      <AppBar position="static">
        <Toolbar sx={{ display: "flex", justifyContent: "space-between" }}>
          <Typography variant="h6">Task Manager</Typography>
          <Box sx={{ display: "flex", gap: 2, alignItems: "center" }}>
            <Typography variant="body1">User: {user?.email}</Typography>
            <Button color="inherit" onClick={() => setEditing({})}>
              Add Task
            </Button>
            <Button color="inherit" onClick={logout}>
              Logout
            </Button>
          </Box>
        </Toolbar>
      </AppBar>

      {/* Main Content */}
      <Container maxWidth="md" sx={{ mt: 4 }}>
        {loading && (
          <Box sx={{ display: "flex", justifyContent: "center", mt: 3 }}>
            <CircularProgress />
          </Box>
        )}

        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}

        {/* Task List */}
        <List>
          {tasks.map((t) => (
            <TaskItem
              key={t.id}
              task={t}
              onEdit={setEditing}
              onDelete={(id) =>
                setTasks((prev) => prev.filter((x) => x.id !== id))
              }
              onUpdate={(u) =>
                setTasks((prev) =>
                  prev.map((x) => (x.id === u.id ? u : x))
                )
              }
            />
          ))}
        </List>

        {/* Task Form Modal */}
        {editing && (
          <TaskForm
            task={editing}
            onClose={() => setEditing(null)}
            onCreate={(t) => setTasks((prev) => [t, ...prev])}
            onUpdate={(t) =>
              setTasks((prev) =>
                prev.map((x) => (x.id === t.id ? t : x))
              )
            }
          />
        )}
      </Container>
    </>
  );
}
