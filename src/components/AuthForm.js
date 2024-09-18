// src/components/AuthForm.js
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
} from 'firebase/auth';
import { doc, setDoc } from 'firebase/firestore';
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { auth, firestore } from '../firebaseConfig';

const AuthForm = ({ isSignUp }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (isSignUp) {
        // Create user account with Firebase Authentication
        const userCredential = await createUserWithEmailAndPassword(
          auth,
          email,
          password
        );
        const user = userCredential.user;
        // Save user data in Firestore
        await setDoc(doc(firestore, 'users', user.uid), {
          uid: user.uid,
          email: user.email,
          name: '',
          registrationTime: new Date(),
          lastLogin: new Date(),
          status: 'active',
          block: false,
        });
        console.log('User signed up and data stored in Firestore');
        navigate('/users'); // Redirect to users management after successful sign-up
      } else {
        // Log in the user with Firebase Authentication
        await signInWithEmailAndPassword(auth, email, password);
        navigate('/users'); // Redirect to users management after successful login
      }
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className='container mt-5'>
      <h2>{isSignUp ? 'Sign Up' : 'Login'}</h2>
      {error && <p className='text-danger'>{error}</p>}
      <form onSubmit={handleSubmit}>
        <div className='mb-3'>
          <label>Email</label>
          <input
            type='email'
            className='form-control'
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <div className='mb-3'>
          <label>Password</label>
          <input
            type='password'
            className='form-control'
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        <button type='submit' className='btn btn-primary'>
          {isSignUp ? 'Sign Up' : 'Login'}
        </button>
      </form>
      <div className='mt-3'>
        {isSignUp ? (
          <p>
            Already have an account? <Link to='/login'>Login here</Link>
          </p>
        ) : (
          <p>
            Don't have an account? <Link to='/signup'>Sign Up here</Link>
          </p>
        )}
      </div>
    </div>
  );
};

export default AuthForm;
