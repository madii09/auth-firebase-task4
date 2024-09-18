// src/App.js
import React, { useState, useEffect } from 'react';
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from 'react-router-dom';
import { auth } from './firebaseConfig';
import AuthForm from './components/AuthForm';
import UserManagement from './components/UserManagement';

const App = () => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((currentUser) => {
      setUser(currentUser);
    });
    return () => unsubscribe();
  }, []);

  return (
    <Router>
      <Routes>
        <Route
          path='/login'
          element={
            user ? <Navigate to='/users' /> : <AuthForm isSignUp={false} />
          }
        />
        <Route
          path='/signup'
          element={
            user ? <Navigate to='/users' /> : <AuthForm isSignUp={true} />
          }
        />
        <Route
          path='/users'
          element={
            user ? <UserManagement user={user} /> : <Navigate to='/login' />
          }
        />
        <Route
          path='*'
          element={<Navigate to={user ? '/users' : '/login'} />}
        />
      </Routes>
    </Router>
  );
};

export default App;
