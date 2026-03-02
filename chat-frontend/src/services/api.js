import axios from "axios";

const api = axios.create({
    baseURL: "http://localhost:5000/api/",
    withCredentials: true,
});

api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem("token");

        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }

        return config;
    },
    (error) => Promise.reject(error)
);

api.interceptors.response.use(
    res => res,
    async err => {
        if (err.response?.status === 401) {
            try {
                const refreshToken = localStorage.get("token");

                const res = await axios.post(`${baseURL}/auth/refresh`, {
                    refreshToken
                });

                const newAccessToken = res.data.accessToken;

                localStorage.setItem("token", newAccessToken);

                api.defaults.headers.common["Authorization"] =
                    `Bearer ${newAccessToken}`;

                originalRequest.headers["Authorization"] =
                    `Bearer ${newAccessToken}`;

                return api(originalRequest);
            } catch (err) {
                localStorage.clear();
                window.location.href = "/login";
                return Promise.reject(refreshError);
            }
        }
    }
)

export default api;