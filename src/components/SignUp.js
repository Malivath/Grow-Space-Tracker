// src/components/SignUp.js
// Import necessary libraries and components
import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext'; // Import useAuth to get authentication state and methods
import { createUserWithEmailAndPassword } from 'firebase/auth'; // Import Firebase authentication method for signing up

// Define the SignUp component
const SignUp = () => {
  // Define state variables to manage form inputs and error messages
  const [email, setEmail] = useState(''); // State for the email input field
  const [password, setPassword] = useState(''); // State for the password input field
  const [error, setError] = useState(''); // State for handling error messages
  const { auth } = useAuth(); // Get the auth object from the AuthContext

  // Function to handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault(); // Prevent the default form submission behavior
    setError(''); // Clear any previous error messages
    try {
      // Attempt to create a new user with email and password
      await createUserWithEmailAndPassword(auth, email, password);
      // Redirect to homepage or another page (implementation needed)
    } catch (error) {
      setError(error.message); // Set the error state with the error message
    }
  };

  // Render the sign-up form
  return (
    <div>
      <h2>Sign Up</h2>
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
        <button className="button-85" id="submit" type="submit">Sign Up</button> {/* Button to submit the form */}
      </form>
    </div>
  );
};

// Export the SignUp component for use in other parts of the app
export default SignUp;
