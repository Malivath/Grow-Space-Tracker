// src/components/GrowSpaceList.js
// Import necessary libraries and components
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { collection, query, where, getDocs, doc, deleteDoc, updateDoc } from 'firebase/firestore'; // Import Firestore methods
import { signOut } from 'firebase/auth'; // Import signOut method from Firebase Auth
import { useAuth } from '../contexts/AuthContext'; // Import the AuthContext for user authentication
import { db } from '../firebase'; // Import the Firebase instance
import CalendarComponent from './CalendarComponent'; // Import CalendarComponent
import PlantsDropdown from './PlantsDropdown'; // Import PlantsDropdown component

// Define the GrowSpaceList component
const GrowSpaceList = () => {
  // Define state variables to manage grow spaces and form inputs
  const [growSpaces, setGrowSpaces] = useState([]); // State for storing grow spaces
  const { currentUser, auth } = useAuth(); // Get the current user and auth instance from AuthContext
  const navigate = useNavigate(); // Hook to navigate between routes
  const [editSpaceId, setEditSpaceId] = useState(null); // State for storing the ID of the space being edited
  const [editFields, setEditFields] = useState({
    name: '',
    dimensions: { width: '', length: '', height: '' },
    power: '',
    lightCycle: '',
    stage: ''
  }); // State for storing the values of the fields being edited
  const [plants, setPlants] = useState([]); // State for storing plant details
  const [newPlant, setNewPlant] = useState({ name: '', type: '', potSize: '' }); // State for storing new plant details including pot size


  // useEffect hook to fetch grow spaces when the component mounts or currentUser changes
  useEffect(() => {
    // Function to fetch grow spaces from Firestore
    const fetchGrowSpaces = async () => {
      if (!currentUser) return; // Exit if no user is logged in

      try {
        const q = query(collection(db, 'growSpaces'), where('userId', '==', currentUser.uid)); // Query for grow spaces belonging to the current user
        const snapshot = await getDocs(q); // Execute the query
        const spacesData = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        })); // Map the documents to grow space objects
        setGrowSpaces(spacesData); // Update the grow spaces state with fetched data
      } catch (error) {
        console.error("Error fetching grow spaces: ", error); // Log any errors to the console
      }
    };

    fetchGrowSpaces(); // Call the fetchGrowSpaces function
  }, [currentUser]); // Dependency array, effect runs when currentUser changes

  // Function to handle deleting a grow space
  const handleDelete = async (id) => {
    try {
      await deleteDoc(doc(db, 'growSpaces', id)); // Delete the document from Firestore
      setGrowSpaces(growSpaces.filter(space => space.id !== id)); // Update the grow spaces state to remove the deleted space
    } catch (error) {
      console.error("Error deleting grow space: ", error); // Log any errors to the console
    }
  };

  // Function to handle entering edit mode for a grow space
  const handleEdit = (space) => {
    setEditSpaceId(space.id); // Set the ID of the space being edited
    setEditFields({
      name: space.name,
      dimensions: space.dimensions,
      power: space.power,
      lightCycle: space.lightCycle,
      stage: space.stage
    }); // Populate the edit fields with the current values of the space
    setPlants(space.plantsDetails || []); // Populate the plants state with the current plant details of the space
  };

  // Function to handle changes in the edit fields
  const handleChange = (e) => {
    const { name, value } = e.target;
    setEditFields(prevFields => ({
      ...prevFields,
      [name]: value
    })); // Update the corresponding edit field with the new value
  };

  // Function to handle changes in the dimensions fields
  const handleDimensionsChange = (e) => {
    const { name, value } = e.target;
    setEditFields(prevFields => ({
      ...prevFields,
      dimensions: {
        ...prevFields.dimensions,
        [name]: value
      }
    })); // Update the corresponding dimension field with the new value
  };

  // Function to handle saving the edited grow space
  const handleSave = async (id) => {
    try {
      await updateDoc(doc(db, 'growSpaces', id), {
        ...editFields, // Include the existing fields
        plantsDetails: plants // Ensure that plantsDetails includes potSize for each plant
      });
      setGrowSpaces(growSpaces.map(space =>
        space.id === id ? { ...space, ...editFields, plantsDetails: plants } : space
      ));
      setEditSpaceId(null);
    } catch (error) {
      console.error("Error updating grow space: ", error);
    }
  };


  const handlePlantChange = (index, e) => {
    const { name, value } = e.target;
    const updatedPlants = [...plants];
    updatedPlants[index] = { ...updatedPlants[index], [name]: value };
    setPlants(updatedPlants);
  };


  // Function to handle adding a new plant
  const handleAddPlant = () => {
    setPlants([...plants, newPlant]); // Add the new plant to the plants state
    setNewPlant({ name: '', type: '' }); // Clear the new plant input fields
  };

  // Function to handle changes in the new plant input fields
  const handleNewPlantChange = (e) => {
    const { name, value } = e.target;
    setNewPlant(prevPlant => ({
      ...prevPlant,
      [name]: value
    })); // Update the corresponding new plant field with the new value
  };

  // src/components/GrowSpaceList.js

  // Function to handle removing a plant from the list
  const handleRemovePlant = (index) => {
    const updatedPlants = plants.filter((_, i) => i !== index); // Create a new array excluding the plant at the specified index
    setPlants(updatedPlants); // Update the plants state with the new array
  };

  // Function to handle user logout
  const handleLogout = async () => {
    try {
      await signOut(auth); // Sign out the current user
      navigate('/signin'); // Navigate to the sign-in page
    } catch (error) {
      console.error("Error logging out: ", error); // Log any errors to the console
    }
  };

// Render the component
return (
  <div>
    {/* Button to log out the current user */}
    <button className="btn btn-danger mb-4 button-85" onClick={handleLogout}>Logout</button>
    <h2 className="mb-4">Grow Spaces</h2>
    <div className="grow-space-container">
      {/* Map through the growSpaces array to render each grow space */}
      {growSpaces.map(space => (
        <div key={space.id} className="grow-space-item">
          <details>
            <summary className="mb-2" id="list-name" >{space.name}</summary>
            <div>
              {/* Display grow space dimensions */}
              <p>Dimensions: {space.dimensions.width || 'N/A'} x {space.dimensions.length || 'N/A'} x {space.dimensions.height || 'N/A'}</p>
              {/* Conditionally render the edit form or display details */}
              {editSpaceId === space.id ? (
                <div className="form-group">
                  {/* Form inputs for editing grow space details */}
                  <label htmlFor="name">Name:</label>
                  <input type="text" className="form-control mb-2" name="name" value={editFields.name} onChange={handleChange} />
                  <label htmlFor="width">Dimensions:</label>
                  <input type="text" className="form-control mb-2" name="width" placeholder="Width" value={editFields.dimensions.width} onChange={handleDimensionsChange} />
                  <input type="text" className="form-control mb-2" name="length" placeholder="Length" value={editFields.dimensions.length} onChange={handleDimensionsChange} />
                  <input type="text" className="form-control mb-2" name="height" placeholder="Height" value={editFields.dimensions.height} onChange={handleDimensionsChange} />
                  <label htmlFor="power">Power:</label>
                  <input type="number" className="form-control mb-2" name="power" value={editFields.power} onChange={handleChange} />
                  <label htmlFor="lightCycle">Light Cycle:</label>
                  <select className="form-control mb-2" name="lightCycle" value={editFields.lightCycle} onChange={handleChange}>
                    <option value="">Select Light Cycle</option>
                    <option value="24/0">24/0</option>
                    <option value="20/4">20/4</option>
                    <option value="18/6">18/6</option>
                    <option value="16/8">16/8</option>
                    <option value="14/10">14/10</option>
                    <option value="12/12">12/12</option>
                  </select>
                  <label htmlFor="stage">Stage:</label>
                  <select className="form-control mb-2" name="stage" value={editFields.stage} onChange={handleChange}>
                    <option value="">Select Stage</option>
                    <option value="seedling">Seedling</option>
                    <option value="veg">Veg</option>
                    <option value="flower">Flower</option>
                  </select>
                  {/* Display the number of plants */}
                  <h3>Plants ({plants.length})</h3>
                  <PlantsDropdown
                    plants={plants}
                    handlePlantChange={handlePlantChange}
                    handleRemovePlant={handleRemovePlant}
                  />
                  <h3>Add New Plant</h3>
                  {/* Form inputs for adding a new plant */}
                  <div className="form-group">
                    <label htmlFor="newPlantName">Name:</label>
                    <input type="text" className="form-control mb-2" name="name" id="newPlantName" value={newPlant.name} onChange={handleNewPlantChange} />
                    <label htmlFor="newPlantType">Type:</label>
                    <select className="form-control mb-2" name="type" id="newPlantType" value={newPlant.type} onChange={handleNewPlantChange}>
                      <option value="">Select Type</option>
                      <option value="clone">Clone</option>
                      <option value="seed">Seed</option>
                    </select>
                    <label htmlFor="potSize">Pot Size:</label>
                    <input type="text" className="form-control mb-2" name="potSize" id="potSize" value={newPlant.potSize} onChange={handleNewPlantChange} />
                  </div>
                  {/* Button to add the new plant */}
                  <button className="btn btn-primary mb-2 button-85" onClick={handleAddPlant}>Add Plant</button>
                  {/* Button to save the edited grow space */}
                  <button className="btn btn-success button-85" id="saveEdit" onClick={() => handleSave(space.id)}>Save</button>
                </div>
              ) : (
                // Display the grow space details when not editing
                <>
                  <p>Power: {space.power}</p>
                  <p>Number of Plants: {space.plantsDetails ? space.plantsDetails.length : 0}</p>
                  <p>Plant Names:</p>
                  <select className="form-control mb-2">
                    {space.plantsDetails && space.plantsDetails.map((plant, index) => (
                      <option key={index} value={plant.name}>
                        {plant.name} ({plant.type}) - Pot Size: {plant.potSize}
                      </option>
                    ))}
                  </select>
                  <p>Light Cycle: {space.lightCycle}</p>
                  <p>Stage: {space.stage}</p>
                  {/* Button to edit the grow space */}
                  <button className="btn btn-warning mb-2 button-85" onClick={() => handleEdit(space)}>Edit</button>
                </>
              )}
              {/* CalendarComponent to manage notes for the grow space */}
              <CalendarComponent growSpaceId={space.id} />
              {/* Button to delete the grow space */}
              <button className="btn btn-danger mt-2 button-85" onClick={() => handleDelete(space.id)}>Delete Grow Space</button>
            </div>
          </details>
        </div>
      ))}
    </div>
  </div>
);


};

export default GrowSpaceList;