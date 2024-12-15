import axios from 'axios';
import { useEffect } from 'react';
import { createContext, useState } from 'react';
import { toast } from 'react-toastify';

const AppContent = createContext();

const AppContentProvider = (prop) => {
  const BACKEND_URL = import.meta.env.VITE_BACKEND_URI;
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [user, setUser] = useState(null);



  const getAuthStatus = async () => {
    try {
      axios.defaults.withCredentials = true;
      const { data } = await axios.get(
        `${BACKEND_URL}/api/v1/auth/is-authenticated`
      );
      if (data.success) {
        setIsLoggedIn(true);
        localStorage.setItem('isLoggedIn', 'true');
        getUserData();
      }else{
        localStorage.setItem('isLoggedIn', 'false');
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.message);
      localStorage.setItem('isLoggedIn', 'false');
    }
  };

  useEffect(() => { 
    const isLoggedInFromStorage = localStorage.getItem('isLoggedIn');
    
    if (isLoggedInFromStorage === 'true') {
      setIsLoggedIn(true);
      getUserData();
    } else {
      getAuthStatus(); 
    }
  }, []);


  const getUserData = async () => {
    try {
      axios.defaults.withCredentials = true;
      const { data } = await axios.get(
        `${BACKEND_URL}/api/v1/user/get-user-data`
      );
      if (data.success) {
        setUser(data.data);
      }
    } catch (error) {
      toast.error(error.message);
    }
  };


  const value = {
    BACKEND_URL,
    isLoggedIn,
    setIsLoggedIn,
    user,
    setUser,
    getUserData,
    isLoading,
    setIsLoading
  };

  return (
    <AppContent.Provider value={value}>{prop.children}</AppContent.Provider>
  );
};

export { AppContent, AppContentProvider };
