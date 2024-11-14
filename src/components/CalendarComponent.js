// src/components/CalendarComponent.js
// Import necessary libraries and components
import React, { useState, useEffect } from 'react';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import { db } from '../firebase'; // Import the Firebase instance
import { collection, doc, setDoc, getDoc, getDocs, deleteDoc } from 'firebase/firestore'; // Import Firestore methods

// Define the CalendarComponent function
const CalendarComponent = ({ growSpaceId }) => {
  // Define state variables to manage date, note, and notes
  const [date, setDate] = useState(new Date()); // State for selected date
  const [note, setNote] = useState(''); // State for note content
  const [notes, setNotes] = useState({}); // State for storing notes

  // useEffect hook to fetch notes when the component mounts or growSpaceId changes
  useEffect(() => {
    // Function to fetch notes from Firestore
    const fetchNotes = async () => {
      try {
        const notesRef = collection(db, 'growSpaces', growSpaceId, 'notes'); // Reference to the notes collection
        const snapshot = await getDocs(notesRef); // Fetch all documents in the notes collection
        const notesData = snapshot.docs.reduce((acc, doc) => {
          acc[doc.id] = doc.data().note; // Map document ID to note content
          return acc;
        }, {});
        setNotes(notesData); // Update the notes state with fetched data
      } catch (error) {
        console.error('Error fetching notes: ', error); // Log any errors to the console
      }
    };

    fetchNotes(); // Call the fetchNotes function
  }, [growSpaceId]); // Dependency array, effect runs when growSpaceId changes

  // Function to handle date change in the calendar
  const handleDateChange = async (newDate) => {
    setDate(newDate); // Update the selected date state
    const noteDoc = await getDoc(doc(db, 'growSpaces', growSpaceId, 'notes', newDate.toDateString())); // Fetch note for the selected date
    if (noteDoc.exists()) {
      setNote(noteDoc.data().note); // Update the note state with fetched note content
    } else {
      setNote(''); // Clear the note state if no note exists for the selected date
    }
  };

  // Function to handle changes in the note input field
  const handleNoteChange = (e) => {
    setNote(e.target.value); // Update the note state with the new input value
  };

  // Function to handle saving a note to Firestore
  const handleSaveNote = async () => {
    try {
      await setDoc(doc(db, 'growSpaces', growSpaceId, 'notes', date.toDateString()), {
        note, // Save the note content to Firestore
      });
      setNotes({
        ...notes,
        [date.toDateString()]: note, // Update the notes state with the new note
      });
      setNote(''); // Clear the note input field
    } catch (error) {
      console.error('Error saving note: ', error); // Log any errors to the console
    }
  };

  // Function to handle deleting a note from Firestore
  const handleDeleteNote = async () => {
    try {
      await deleteDoc(doc(db, 'growSpaces', growSpaceId, 'notes', date.toDateString())); // Delete the note document from Firestore
      const updatedNotes = { ...notes };
      delete updatedNotes[date.toDateString()]; // Remove the deleted note from the notes state
      setNotes(updatedNotes); // Update the notes state
      setNote(''); // Clear the note input field
    } catch (error) {
      console.error('Error deleting note: ', error); // Log any errors to the console
    }
  };

  // Function to render content in the calendar tiles
  const tileContent = ({ date, view }) => {
    if (view === 'month' && notes[date.toDateString()]) {
      return <p>{notes[date.toDateString()]}</p>; // Display note content in the calendar tile
    }
  };

  // Render the calendar component and note input section
  return (
    <div className="calendar-container">
      <h2 className="calendar-title">Calendar</h2>
      <Calendar
        onChange={handleDateChange} // Handle date selection
        value={date} // Set the currently selected date
        tileContent={tileContent} // Set content for calendar tiles
      />
      <div>
        <h3>Selected Date: {date.toDateString()}</h3>
        {/* Textarea for note input */}
        <textarea value={note} onChange={handleNoteChange} placeholder="Add a note"></textarea>
        {/* Button to save the note */}
        <button className="save-note-btn button-85" onClick={handleSaveNote}>Save Note</button>
        {/* Button to delete the note if it exists */}
        {notes[date.toDateString()] && <button onClick={handleDeleteNote}>Delete Note</button>}
      </div>
    </div>
  );
};

// Export the CalendarComponent for use in other parts of the app
export default CalendarComponent;
