import React, { useState } from 'react';
import axios from 'axios';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { z} from 'zod';

const emailSchema = z.string().email('Invalid email format');
const passwordSchema = z.string().min(6, 'Password should be at least 6 characters long');


const AuthForm = () => {

  const [email, setEmail] = useState('');
  const [emailError, setEmailError] = useState('');
  const [password, setPassword] = useState('');
  const [isSignUp, setIsSignUp] = useState(false); // Track whether the user is signing up or signing in
  const [rememberMe, setRememberMe] = useState(false); // Track "Remember Me" state
  const [passwordError, setPasswordError] = useState('');

  const handleRememberMeChange = () => {
    setRememberMe(!rememberMe);
  };
  const handleEmailChange = (e) => {
  const emailValue = e.target.value;
  setEmail(emailValue);
  const validationResult = emailSchema.safeParse(emailValue);
  setEmailError(validationResult.success ? '' : validationResult.error.message);
};

  const handlePasswordChange = (e) => {
  const passwordValue = e.target.value;
  setPassword(passwordValue);
  const validationResult = passwordSchema.safeParse(passwordValue);
  setPasswordError(validationResult.success ? '' : validationResult.error.message);
};


  const handleAuthToggle = () => {
    // Toggle between signup and signin
    setIsSignUp(!isSignUp);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (isSignUp) {
        // If isSignUp is true, the user is registering
        const response = await axios.post('http://localhost:3001/api/signup', { email, password });
        const { success, message } = response.data;
        if (success) {
          toast.success(message);
          // Optionally, you can auto-switch to sign-in mode after successful registration
          setIsSignUp(false);
        } else {
          toast.error(message);
        }
      } else {
        // If isSignUp is false, the user is signing in
        const response = await axios.post('http://localhost:3001/api/signin', { email, password });
        const { token, success, message } = response.data;
        if (success) {
          // Store the token in localStorage or a global state management solution.
          // You can also redirect the user to a protected route here.
          // localStorage.setItem('authToken', token);
          toast.success(message);
        } else {
          toast.error(message);
        }
      }
    } catch (error) {
      toast.error('An error occurred. Please try again later.');
      console.error(error);
    }
  };

  return (
    <div>
      <h2>{isSignUp ? 'Sign Up' : 'Sign In'}</h2>
      <form onSubmit={handleSubmit}>
      <div>
      <label>Email:</label>
      <input type="email" value={email} onChange={handleEmailChange} required />
      {emailError && <span style={{ color: 'red' }}>{emailError.message}</span>}
    </div>
    <div>
      <label>Password:</label>
      <input type="password" value={password} onChange={handlePasswordChange} required />
      {passwordError && <span style={{ color: 'red' }}>{passwordError.message}</span>}
    </div>

        <button type="submit">{isSignUp ? 'Sign Up' : 'Sign In'}</button>
        <div>
        <label>
          Remember Me
          <input
            type="checkbox"
            checked={rememberMe}
            onChange={handleRememberMeChange}
          />
        </label>
      </div>
      </form>
      <p>
        {isSignUp ? 'Already have an account?' : 'Don\'t have an account?'}{' '}
        <span onClick={handleAuthToggle} style={{ cursor: 'pointer', color: 'blue' }}>
          {isSignUp ? 'Sign In' : 'Sign Up'}
        </span>
      </p>
      <ToastContainer />
    </div>
  );
};

export default AuthForm;
