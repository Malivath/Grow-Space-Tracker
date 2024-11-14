// src/components/SignIn.js
// Import necessary libraries and components
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom'; // Import useNavigate for programmatic navigation
import { useAuth } from '../contexts/AuthContext'; // Import useAuth to get authentication state and methods
import { signInWithEmailAndPassword } from 'firebase/auth'; // Import Firebase authentication method for signing in

// Define the SignIn component
const SignIn = () => {
  // Define state variables to manage form inputs and error messages
  const [email, setEmail] = useState(''); // State for the email input field
  const [password, setPassword] = useState(''); // State for the password input field
  const [error, setError] = useState(''); // State for handling error messages
  const { auth } = useAuth(); // Get the auth object from the AuthContext
  const navigate = useNavigate(); // Get the navigate function for programmatic navigation

  // Function to handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault(); // Prevent the default form submission behavior
    setError(''); // Clear any previous error messages
    try {
      // Attempt to sign in with email and password
      await signInWithEmailAndPassword(auth, email, password);
      navigate('/'); // Navigate to the main section upon successful sign-in
    } catch (error) {
      setError(error.message); // Set the error state with the error message
    }
  };

  // Render the sign-in form
  return (
    <div>
      <h2>Sign In</h2>
      <form onSubmit={handleSubmit}>
        <label htmlFor="email">Email:</label>
        <input
          type="email"
          id="email"
          name="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)} // Update the email state with input value
          required // Make the email field required
        />
        <label htmlFor="password">Password:</label>
        <input
          type="password"
          id="password"
          name="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)} // Update the password state with input value
          required // Make the password field required
        />
        {error && <p>{error}</p>} {/* Display error message if there's an error */}
        <button className="button-85" id="submit" type="submit">Sign In</button> {/* Button to submit the form */}
      </form>
      <button className="button-85" id="register" onClick={() => navigate('/signup')}>Register</button> {/* Button to navigate to the registration page */}
    </div>
  );
};

// Export the SignIn component for use in other parts of the app
export default SignIn;
