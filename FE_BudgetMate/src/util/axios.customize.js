import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
// const baseUrl = "https://budgetmate-app-b48b1f358087.herokuapp.com/api/v1";
const baseUrl = "http://localhost:8080/api/v1";

// Set config defaults when creating the instance
const instance = axios.create({
  baseURL: baseUrl,
});

// Add a request interceptor
instance.interceptors.request.use(
  async function (config) {
    // Do something before request is sent
    const token = await AsyncStorage.getItem("accessToken");

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    config.headers["ngrok-skip-browser-warning"] = "69420";

    return config;
  },
  function (error) {
    // Do something with request error
    return Promise.reject(error);
  }
);

// Add a response interceptor
instance.interceptors.response.use(
  function (response) {
    // Any status code that lie within the range of 2xx cause this function to trigger
    // Do something with response data
    return response;
  },
  function (error) {
    // Any status codes that falls outside the range of 2xx cause this function to trigger
    // Do something with response error
    return Promise.reject(error);
  }
);

// Alter defaults after instance has been created
export default instance;
