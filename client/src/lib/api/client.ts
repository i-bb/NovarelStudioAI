// import axios from "axios";

// const API_BASE_URL = "https://kora-undeluding-nathanael.ngrok-free.dev";
// // const API_BASE_URL = "https://api.novarelstudio.com/v1";
// // const API_BASE_URL = " https://oryx-patient-llama.ngrok-free.app";

// const apiClient = axios.create({
//   baseURL: API_BASE_URL,
//   timeout: 600000,
//   headers: {
//     "Content-Type": "application/json",
//     "ngrok-skip-browser-warning": "true", // bypass ngrok
//   },
// });

// apiClient.interceptors.request.use(
//   (config) => {
//     const token = localStorage.getItem("auth_token");
//     if (token) {
//       config.headers.Authorization = `Bearer ${token}`;
//     }
//     return config;
//   },
//   (error) => Promise.reject(error)
// );

// apiClient.interceptors.response.use(
//   (response) => response,
//   (error) => {
//     if (error.response?.status === 401) {
//       localStorage.removeItem("auth_token");
//       localStorage.removeItem("auth_user");
//       // window.location.href = "/login";
//     }
//     return Promise.reject(error);
//   }
// );

// export default apiClient;

import axios from "axios";

// const API_BASE_URL = "https://kora-undeluding-nathanael.ngrok-free.dev";
const API_BASE_URL = "https://api.novarelstudio.com/v1";
// const API_BASE_URL = " https://oryx-patient-llama.ngrok-free.app";

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 600000,
  headers: {
    "Content-Type": "application/json",
    "ngrok-skip-browser-warning": "true", // bypass ngrok
  },
});

apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("auth_token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject({
      type: "REQUEST_NOT_SENT",
      message: error.message,
      originalError: error,
    });
  }
);

apiClient.interceptors.response.use(
  (response) => response,

  (error) => {
    // 🔥 1️⃣ SERVER RESPONDED WITH ERROR (4xx / 5xx)
    if (error.response) {
      const status = error.response.status;

      // Auto logout on 401
      if (status === 401) {
        localStorage.removeItem("auth_token");
        localStorage.removeItem("auth_user");
        // window.location.href = "/login";
      }

      return Promise.reject({
        type: "SERVER_ERROR",
        status,
        data: error.response.data,
        headers: error.response.headers,
      });
    }

    // 🔥 2️⃣ REQUEST SENT BUT NO RESPONSE RECEIVED (network / CORS / timeout)
    if (error.request) {
      return Promise.reject({
        type: "NO_RESPONSE",
        message: "Request sent but no response received",
        request: error.request,
      });
    }

    // 🔥 3️⃣ REQUEST NEVER SENT (Axios config or other client-side error)
    return Promise.reject({
      type: "REQUEST_NOT_SENT",
      message: error.message,
      originalError: error,
    });
  }
);

export default apiClient;
