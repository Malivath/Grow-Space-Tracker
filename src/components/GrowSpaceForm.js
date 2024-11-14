// src/components/GrowSpaceForm.js
// Import necessary libraries and components
import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext'; // Import the AuthContext for user authentication
import { db } from '../firebase'; // Import the Firebase instance
import { collection, addDoc } from 'firebase/firestore'; // Import Firestore methods

// Define the GrowSpaceForm component
const GrowSpaceForm = ({ setGrowSpaces }) => {
  // Define state variables to manage form inputs
  const [name, setName] = useState(''); // State for the name input field
  const [dimensions, setDimensions] = useState({ width: '', length: '', height: '' }); // State for dimensions (width, length, height)
  const [power, setPower] = useState(''); // State for power input field
  const [lightCycle, setLightCycle] = useState(''); // State for light cycle dropdown
  const [stage, setStage] = useState(''); // State for stage dropdown
  const { currentUser } = useAuth(); // Get the current user from the AuthContext

  // Function to handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault(); // Prevent the default form submission behavior
    try {
      // Add a new document to the 'growSpaces' collection in Firestore
      const docRef = await addDoc(collection(db, 'growSpaces'), {
        userId: currentUser.uid, // Store the user ID of the currently logged-in user
        name, // Store the name from the input field
        dimensions, // Store the dimensions (width, length, height)
        power, // Store the power input
        lightCycle, // Store the selected light cycle
        stage, // Store the selected stage
        plantsDetails: [] // Initialize with an empty array for plant details
      });
      // Update the state with the new grow space
      setGrowSpaces(prev => [...prev, { id: docRef.id, userId: currentUser.uid, name, dimensions, power, lightCycle, stage, plantsDetails: [] }]);
      // Clear the form fields after successful submission
      setName(''); // Clear the name input field
      setDimensions({ width: '', length: '', height: '' }); // Clear the dimensions input fields
      setPower(''); // Clear the power input field
      setLightCycle(''); // Clear the light cycle dropdown
      setStage(''); // Clear the stage dropdown
    } catch (error) {
      console.error("Error adding grow space: ", error); // Log any errors to the console
    }
  };

  // Render the form
  return (
    <form onSubmit={handleSubmit} className="form-group">
      <div className="form-row mb-2">
        <label htmlFor="name" className="col-sm-2 col-form-label">Name:</label>
        <div className="col-sm-10">
          <input type="text" className="form-control" id="name" value={name} onChange={(e) => setName(e.target.value)} required /> {/* Input field for grow space name */}
        </div>
      </div>
      <div className="form-row mb-2">
        <label htmlFor="width" className="col-sm-2 col-form-label">Dimensions:</label>
        <div className="col-sm-10">
          <input type="text" className="form-control mb-1" id="width" placeholder="Width" value={dimensions.width} onChange={(e) => setDimensions({ ...dimensions, width: e.target.value })} /> {/* Input field for width */}
          <input type="text" className="form-control mb-1" placeholder="Length" value={dimensions.length} onChange={(e) => setDimensions({ ...dimensions, length: e.target.value })} /> {/* Input field for length */}
          <input type="text" className="form-control" placeholder="Height" value={dimensions.height} onChange={(e) => setDimensions({ ...dimensions, height: e.target.value })} /> {/* Input field for height */}
        </div>
      </div>
      <div className="form-row mb-2">
        <label htmlFor="power" className="col-sm-2 col-form-label">Power:</label>
        <div className="col-sm-10">
          <input type="number" className="form-control" id="power" value={power} onChange={(e) => setPower(e.target.value)} required /> {/* Input field for power */}
        </div>
      </div>
      <div className="form-row mb-2">
        <label htmlFor="lightCycle" className="col-sm-2 col-form-label">Light Cycle:</label>
        <div className="col-sm-10">
          <select className="form-control" id="lightCycle" value={lightCycle} onChange={(e) => setLightCycle(e.target.value)} required> {/* Dropdown for selecting light cycle */}
            <option value="">Select Light Cycle</option>
            <option value="24/0">24/0</option>
            <option value="20/4">20/4</option>
            <option value="18/6">18/6</option>
            <option value="16/8">16/8</option>
            <option value="14/10">14/10</option>
            <option value="12/12">12/12</option>
          </select>
        </div>
      </div>
      <div className="form-row mb-3">
        <label htmlFor="stage" className="col-sm-2 col-form-label">Stage:</label>
        <div className="col-sm-10">
          <select className="form-control" id="stage" value={stage} onChange={(e) => setStage(e.target.value)} required> {/* Dropdown for selecting stage */}
            <option value="">Select Stage</option>
            <option value="seedling">Seedling</option>
            <option value="veg">Veg</option>
            <option value="flower">Flower</option>
          </select>
        </div>
      </div>
      <button type="submit" className="btn btn-primary button-85">Add Grow Space</button> {/* Button to submit the form */}
    </form>
  );
};

// Export the GrowSpaceForm component for use in other parts of the app
export default GrowSpaceForm;
