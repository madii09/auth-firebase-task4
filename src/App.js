// src/App.js
import React, { useEffect, useState } from 'react';
import {
  Navigate,
  Route,
  BrowserRouter as Router,
  Routes,
} from 'react-router-dom';
import AuthForm from './components/AuthForm';
import UserManagement from './components/UserManagement';
import { auth } from './firebaseConfig';
import { isUserBlocked } from './utils';

const App = () => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    async function checkUser(uid) {
      return await isUserBlocked(uid);
    }

    const unsubscribe = auth.onAuthStateChanged(async (currentUser) => {
      if (currentUser) {
        checkUser(currentUser.uid).then((res) => {
          if (!res) {
            setUser(currentUser);
          }
        });
      }
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
