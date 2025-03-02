//frontend/src/App.js
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Landing from './components/Landing';
import Game from './components/Game';
import Challenge from './components/Challenge';
import ChallengeFriend from './components/ChallengeFriend';
//import Login from './components/Login'; // Import the Login component

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Landing />} />
        console.log("Hello World");
        <Route path="/game" element={<Game />} />
        <Route path="/challenge" element={<Challenge />} />
        <Route path="/challenge-friend" element={<ChallengeFriend />} />
      </Routes>
    </Router>
  );
}

export default App;