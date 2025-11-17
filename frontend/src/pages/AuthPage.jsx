import React, { useState } from "react";
import { useAuth } from "../contexts/AuthContext";
import { useNavigate } from "react-router-dom";

// MUI components
import {
  Container,
  Box,
  Card,
  CardContent,
  TextField,
  Typography,
  Button,
  Alert,
  CircularProgress,
  AppBar,
  Toolbar,
  IconButton,
} from "@mui/material";

// Social Icons
import FacebookIcon from "@mui/icons-material/Facebook";
import TwitterIcon from "@mui/icons-material/Twitter";
import LinkedInIcon from "@mui/icons-material/LinkedIn";
import GitHubIcon from "@mui/icons-material/GitHub";

export default function AuthPage() {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const { login, signup, loading, error } = useAuth();
  const nav = useNavigate();

  const submit = async (e) => {
    e.preventDefault();
    try {
      isLogin
        ? await login(email, password)
        : await signup(email, password);

      nav("/tasks");
    } catch {
      console.log("Auth error");
    }
  };

  return (
    <>
      {/* HEADER */}
      <AppBar position="static" sx={{ backgroundColor: "#1976d2" }}>
        <Toolbar>
          <Typography variant="h6" sx={{ flexGrow: 1, textAlign: "center" }}>
            📝 TaskFlow — Simple & Smart Task Manager
          </Typography>
        </Toolbar>
      </AppBar>

      {/* AUTH FORM */}
      <Container
        maxWidth="sm"
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          flexDirection: "column",
          minHeight: "calc(100vh - 64px - 120px)", // header + footer approx
          mt: 2,
          mb: 2,
        }}
      >
        <Card sx={{ width: "100%", p: 2, boxShadow: 4 }}>
          <CardContent>
            <Typography variant="h4" align="center" gutterBottom>
              {isLogin ? "Login" : "Sign Up"}
            </Typography>

            <Box component="form" onSubmit={submit} sx={{ mt: 2 }}>
              <TextField
                fullWidth
                label="Email"
                variant="outlined"
                margin="normal"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />

              <TextField
                fullWidth
                label="Password"
                type="password"
                variant="outlined"
                margin="normal"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />

              {error && (
                <Alert severity="error" sx={{ mt: 2 }}>
                  {error}
                </Alert>
              )}

              <Button
                type="submit"
                variant="contained"
                fullWidth
                sx={{ mt: 3, py: 1 }}
                disabled={loading}
              >
                {loading ? (
                  <CircularProgress size={24} sx={{ color: "white" }} />
                ) : isLogin ? (
                  "Login"
                ) : (
                  "Sign Up"
                )}
              </Button>

              <Button
                fullWidth
                variant="text"
                sx={{ mt: 2 }}
                onClick={() => setIsLogin((prev) => !prev)}
              >
                {isLogin
                  ? "Create an account"
                  : "Already have an account?"}
              </Button>
            </Box>
          </CardContent>
        </Card>
      </Container>

      {/* FOOTER */}
      <Box
        component="footer"
        sx={{
          textAlign: "center",
          py: 4,
          mt: "auto",
          backgroundColor: "#f5f5f5",
          borderTop: "1px solid #ddd",
        }}
      >
        <Typography variant="body1" gutterBottom>
          Follow us on social media
        </Typography>
        <Box sx={{ display: "flex", justifyContent: "center", gap: 2, mb: 1 }}>
          <IconButton color="primary" href="#" target="_blank">
            <FacebookIcon />
          </IconButton>
          <IconButton color="primary" href="#" target="_blank">
            <TwitterIcon />
          </IconButton>
          <IconButton color="primary" href="#" target="_blank">
            <LinkedInIcon />
          </IconButton>
          <IconButton color="primary" href="#" target="_blank">
            <GitHubIcon />
          </IconButton>
        </Box>
        <Typography variant="body2" color="text.secondary">
          © {new Date().getFullYear()} TaskFlow — Built with ❤️ using React & Node.js
        </Typography>
      </Box>
    </>
  );
}
