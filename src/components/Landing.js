import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './Landing.css';

const Landing = () => {
  const [username, setUsername] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [buttonText, setButtonText] = useState('Start Adventure');
  const navigate = useNavigate();
  const API_BASE = process.env.REACT_APP_API_BASE_URL || 'http://localhost:5001';

  // Cycle through different button texts for game effect
  useEffect(() => {
    const texts = ['Start Adventure', 'Play Now!', 'Begin Journey', 'Let\'s Go!'];
    let index = 0;
    
    const interval = setInterval(() => {
      index = (index + 1) % texts.length;
      setButtonText(texts[index]);
    }, 3000);
    
    return () => clearInterval(interval);
  }, []);

  const handleStart = async (e) => {
    e.preventDefault();
    if (!username.trim()) {
      alert('Please enter a username to start');
      return;
    }
    
    setIsLoading(true);
    setButtonText('Loading...');
    
    try {
      // Register user or get existing data
      const res = await axios.post(`${API_BASE}/api/users/register`, { username });
      // Store username in localStorage for session purposes
      localStorage.setItem('username', username);
      
      // Add a small delay for game-like effect
      setTimeout(() => {
        navigate('/game');
      }, 800);
      
    } catch (error) {
      console.error(error);
      alert('There was an error. Please try again.');
      setIsLoading(false);
      setButtonText('Try Again');
    }
  };

  return (
    <div className="landing-container">
      
      
      <div className="landing-content">
        <div className="globe-container">
          <div className="globe"></div>
        </div>
        
        <h1 className="landing-title">Globetrotter</h1>
        <p className="landing-subtitle">Ready to test your geography skills?</p>
        
        <form onSubmit={handleStart} className="username-form">
          <input 
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="username-input"
            placeholder="Enter your explorer name"
            required
            autoFocus
          />
          <button 
            type="submit" 
            className={`start-button ${isLoading ? 'disabled' : ''}`} 
            disabled={isLoading}
          >
            {buttonText}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Landing;