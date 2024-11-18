import React, { createContext, useContext, useState, useEffect } from 'react';
import { auth } from '../firebase';
import { onAuthStateChanged } from 'firebase/auth';



const AuthContext = createContext();

export const useAuth = () => {
  return useContext(AuthContext);
};

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);

  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem('currentUser'));
    console.log('Stored User on Load:', storedUser); // Debug: Check stored user

    if (storedUser) {
      setCurrentUser(storedUser);
    }

    const unsubscribe = onAuthStateChanged(auth, (user) => {
      console.log('Auth State Changed:', user); // Debug: Check auth state change
      setCurrentUser(user);
      if (user) {
        localStorage.setItem('currentUser', JSON.stringify(user));
      } else {
        localStorage.removeItem('currentUser');
      }
    });

    return unsubscribe;
  }, []);

  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem('currentUser'));
    console.log('Stored User on Load:', storedUser); // Debug log
  
    if (storedUser) {
      setCurrentUser(storedUser);
    }
  
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      console.log('Auth State Changed:', user); // Debug log
      setCurrentUser(user);
      if (user) {
        localStorage.setItem('currentUser', JSON.stringify(user));
      } else {
        localStorage.removeItem('currentUser');
      }
    });
  
    return unsubscribe;
  }, []);
  

  const value = {
    currentUser,
    auth,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

