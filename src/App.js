import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { collection, getDocs } from 'firebase/firestore';
import { db } from './firebase';
import SignUp from './components/SignUp';
import SignIn from './components/SignIn';
import GrowSpaceForm from './components/GrowSpaceForm';
import GrowSpaceList from './components/GrowSpaceList';
import { AuthProvider } from './contexts/AuthContext';
import PrivateRoute from './components/PrivateRoute';

const App = () => {
  const [growSpaces, setGrowSpaces] = useState([]);

  useEffect(() => {
    const fetchGrowSpaces = async () => {
      try {
        const snapshot = await getDocs(collection(db, 'growSpaces'));
        const spacesData = snapshot.docs.map(doc => {
          const data = doc.data();
          return {
            id: doc.id,
            name: data.name || 'N/A',
            dimensions: data.dimensions || {},
            power: data.power || 'N/A',
            plants: data.plants || 'N/A',
            lightCycle: data.lightCycle || 'N/A',
            stage: data.stage || 'N/A',
            notes: data.notes || 'N/A',
          };
        });
        setGrowSpaces(spacesData);
      } catch (error) {
        console.error("Error fetching grow spaces: ", error);
      }
    };

    fetchGrowSpaces();
  }, []);

  return (
    <Router>
      <AuthProvider>
        <div className="container mt-4">
          <Routes>
            <Route path="/signup" element={<SignUp />} />
            <Route path="/signin" element={<SignIn />} />
            <Route path="/" element={<PrivateRoute component={() => (
              <>
                <div className="row mb-4">
                  <div className="col-12">
                    <GrowSpaceForm setGrowSpaces={setGrowSpaces} />
                  </div>
                </div>
                <div className="row">
                  <div className="col-12">
                    <GrowSpaceList growSpaces={growSpaces} setGrowSpaces={setGrowSpaces} />
                  </div>
                </div>
              </>
            )} />} />
          </Routes>
        </div>
      </AuthProvider>
    </Router>
  );
};

export default App;
