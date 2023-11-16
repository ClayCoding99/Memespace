import React, { createContext, useState, useEffect, useCallback } from 'react';
import axios from "axios";

const AuthContext = createContext();
const axiosInstance = axios.create();

// wrapper for authentication using JWT and axios interceptors
const AuthProvider = ({ children }) => {
    const [auth, setAuth] = useState(false);

    useEffect(() => {
      // Check if user is already authenticated (e.g., tokens in localStorage)
      const accessToken = localStorage.getItem('accessToken');
      if (accessToken) {
        setAuth(true);
      }
    }, []);

    const handleTokenExpired = useCallback(async () => {
      // Logic to refresh token
      // This is an example, you should implement your own refresh token logic
      const refreshToken = localStorage.getItem('refreshToken');
      console.log("IN HANDLE TOKEN EXPIRED!!!");
      if (refreshToken) {
        try {
          const response = await axios.post('http://localhost:8000/v1/auth/token', {
            token: refreshToken
          });
          console.log(response.data.accessToken);
          localStorage.setItem('accessToken', response.data.accessToken);

          // reload the page to prevent some visual bugs with the page (TODO: FIX THIS BY ENSURING THE INTERCEPTOR RUNS THIS BEFORE ANY OTHER SERVER PINGS!)
          window.location.reload();
        } catch (error) {
          console.log("Token could not be refreshed: " + error);
          // if token couldn't be refreshed, log out the user
          //await logout();
        }
      }
    });

    // add a request interceptor to obtain a new access token with the refresh token
    axiosInstance.interceptors.request.use(
      (config) => {
        // Do something before request is sent
        // For example, you can add headers or modify the request config
        console.log('Request interceptor:', config);
        const accessToken = localStorage.getItem('accessToken');
        if (accessToken) {
          config.headers.Authorization = `Bearer ${accessToken}`;
        }
        return config;
      },
      (error) => {
        // Do something with request error
        return Promise.reject(error);
      }
    );

    // Add a response interceptor
    axiosInstance.interceptors.response.use(
      (response) => {
        // Do something with the response data
        return response;
      },
      async (error) => {
        // Do something with response error
        if (error.response && error.response.status === 403) {
          // Token expired or unauthorized
          // Retry the original request after token refresh
          // Implement logic to retry the request

          // TODO: maybe have some kind of a listener that checks to see if the user has interacted with the app recently and if so, then go ahead and keep them signed in, else, basically just log them out instead
          console.log('Token expired or unauthorized. Attempting token refresh...');
          await handleTokenExpired();
        }
        return Promise.reject(error);
      }
    );

    const signup = async (email, password, displayname) => {
      try {
        const serverEndpoint = 'http://localhost:8000/v1/auth/signup';
        const requestData = {
          email: email,
          password: password,
          displayname: displayname
        };
        const requestOptions = {
          headers: {
            'Content-Type': 'application/json'
          }
        };
        const response = await axiosInstance.post(serverEndpoint, requestData, requestOptions);
        if (response.data.error) {
          throw new Error(response.data.error);
        }
        // after successfully signing up set auth to true
        localStorage.setItem('accessToken', response.data.accessToken);
        localStorage.setItem('refreshToken', response.data.refreshToken);
        setAuth(true);
    
        return response.data;
      } catch (error) {
        return { error: error };
      }
  };

  const login = async (email, password) => {
      try {
        const serverEndpoint = 'http://localhost:8000/v1/auth/login';
        const requestData = {
          email: email,
          password: password
        };
        const requestOptions = {
          headers: {
            'Content-Type': 'application/json'
          }
        };
        const response = await axiosInstance.post(serverEndpoint, requestData, requestOptions);
      
        if (response.data.error) {
          throw new Error(response.data.error);
        }

        // after successfully logging in, set the auth to true
        localStorage.setItem('accessToken', response.data.accessToken);
        localStorage.setItem('refreshToken', response.data.refreshToken);
        setAuth(true);

        return response.data;
      } catch (error) {
          console.error('Error during login:', error);
          return {error: error};
      }
  };

  const logout = async () => {
    try {
      const refreshToken = localStorage.getItem('refreshToken');
      if (!refreshToken) {
        throw new Error("Cannot logout if they have no refresh token!");
      }
      const serverEndpoint = 'http://localhost:8000/v1/auth/logout';
      const requestData = {
        token: refreshToken
      };
      const requestOptions = {
        headers: {
          'Content-Type': 'application/json'
        }
      };
      const response = await axiosInstance.delete(serverEndpoint, {
        ...requestOptions,
        data: requestData // Pass the data directly for DELETE requests using Axios
      });
  
      if (response.status !== 204) {
        console.error(response.error);
      }
      
      // after successfully logging out, set the auth to false
      setAuth(false);
      localStorage.removeItem('accessToken');
      localStorage.removeItem('refreshToken');
  
      return response.data;
    } catch (error) {
      console.error('Error during logout:', error);
      return { error: error };
    }
  }

  const authContextValue = {
    auth,
    login,
    signup, 
    logout,
  };

  return (
    <AuthContext.Provider value={authContextValue}>
      {children}
    </AuthContext.Provider>
  );
};

export { AuthContext, AuthProvider, axiosInstance};