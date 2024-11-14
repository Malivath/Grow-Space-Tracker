// src/components/PlantsDropdown.js
// Import necessary libraries and components
import React from 'react';

// Define the PlantsDropdown component
// Props:
// - plants: Array of plant objects, each with a name and type
// - handlePlantChange: Function to handle changes in plant details
// - handleRemovePlant: Function to handle removing a plant from the list
const PlantsDropdown = ({ plants, handlePlantChange, handleRemovePlant }) => {
    return (
        <>
            {/* Iterate over the plants array and render input fields for each plant */}
            {plants.map((plant, index) => (
                <div key={index}>
                    <label id="plantInputs">
                        Name:
                        {/* Input field for plant name */}
                        <input 
                            type="text" 
                            name="name" 
                            value={plant.name} 
                            onChange={(e) => handlePlantChange(index, e)} 
                        />
                    </label>
                    <label id="plantInputs">
                        Type:
                        {/* Dropdown for selecting plant type */}
                        <select 
                            name="type" 
                            value={plant.type} 
                            onChange={(e) => handlePlantChange(index, e)}
                        >
                            <option value="">Select Type</option>
                            <option value="clone">Clone</option>
                            <option value="seed">Seed</option>
                        </select>
                    </label>
                    <label id="plantInputs">
                        Pot Size:
                        {/* Input field for pot size */}
                        <input 
                            type="text" 
                            name="potSize" 
                            value={plant.potSize} 
                            onChange={(e) => handlePlantChange(index, e)}
                        />
                    </label>
                    {/* Button to remove the plant */}
                    <button id="plantInputs" onClick={() => handleRemovePlant(index)}>Remove Plant</button>
                </div>
            ))}
        </>
    );
};


// Export the PlantsDropdown component for use in other parts of the app
export default PlantsDropdown;
