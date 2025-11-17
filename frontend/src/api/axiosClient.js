import axios from "axios";

const client = axios.create({
  baseURL: "http://localhost:5000",
});

// FIX — read token directly from localStorage every time
client.interceptors.request.use(
  (config) => {
    const stored = localStorage.getItem("auth");

    let token = null;
    if (stored) {
      try {
        token = JSON.parse(stored).token;
      } catch (e) {
        console.error("Failed to parse auth from localStorage");
      }
    }

    console.log("AXIOS INTERCEPTOR FIRED. TOKEN =", token);

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => Promise.reject(error)
);

export default client;
