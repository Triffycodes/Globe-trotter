//frontend/src/components/Challenge.js
import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';
import './Challenge.css';

const Challenge = () => {
  const [username, setUsername] = useState('');
  const [challengeImage, setChallengeImage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const canvasRef = useRef(null);
  const navigate = useNavigate();
  const location = useLocation();
  const API_BASE = process.env.REACT_APP_API_BASE_URL || 'http://localhost:5001';
  
  // Extract query parameters
  const params = new URLSearchParams(location.search);
  const challenger = params.get('challenger');
  const challengerScore = params.get('challengerScore');
  const expectedFriend = params.get('expectedFriend');

  useEffect(() => {
    // Generate the challenge canvas when component mounts
    if (challenger && challengerScore) {
      generateChallengeImage();
    }
  }, [challenger, challengerScore]);
  
  const generateChallengeImage = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    
    // Set canvas dimensions
    canvas.width = 600;
    canvas.height = 400;
    
    // Draw background
    const gradient = ctx.createLinearGradient(0, 0, 600, 400);
    gradient.addColorStop(0, '#1c082e');
    gradient.addColorStop(1, '#503fbe');
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, 600, 400);
    
    // Draw decorative elements
    ctx.fillStyle = 'rgba(255, 255, 255, 0.15)';
    ctx.beginPath();
    ctx.arc(500, 80, 60, 0, Math.PI * 2);
    ctx.fill();
    
    ctx.beginPath();
    ctx.arc(100, 350, 40, 0, Math.PI * 2);
    ctx.fill();

    // Draw decorative path
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.2)';
    ctx.lineWidth = 5;
    ctx.beginPath();
    ctx.moveTo(50, 100);
    ctx.lineTo(550, 100);
    ctx.stroke();
    
    // Draw title
    ctx.fillStyle = 'white';
    ctx.font = 'bold 40px Boogaloo, Arial';
    ctx.textAlign = 'center';
    ctx.fillText('GLOBETROTTER CHALLENGE', 300, 80);
    
    // Draw challenge text
    ctx.font = '28px Fredoka, Arial';
    ctx.fillText(`${challenger} is challenging YOU!`, 300, 150);
    
    // Draw VS section
    ctx.fillStyle = '#ff7e5f';
    ctx.font = 'bold 60px Boogaloo, Arial';
    ctx.fillText('VS', 300, 220);
    
    // Draw score section
    ctx.fillStyle = '#ffcc00';
    ctx.font = 'bold 36px Fredoka, Arial';
    ctx.fillText(`Score: ${challengerScore}`, 300, 280);
    
    ctx.fillStyle = 'white';
    ctx.font = '22px Fredoka, Arial';
    ctx.fillText(`Can you beat ${challenger}'s score?`, 300, 320);
    
    // Draw button-like shape
    const buttonGradient = ctx.createLinearGradient(150, 350, 450, 350);
    buttonGradient.addColorStop(0, '#ff7e5f');
    buttonGradient.addColorStop(1, '#feb47b');
    ctx.fillStyle = buttonGradient;
    
    // Rounded rectangle for button
    const buttonX = 150;
    const buttonY = 340;
    const buttonWidth = 300;
    const buttonHeight = 45;
    const buttonRadius = 22.5;
    
    ctx.beginPath();
    ctx.moveTo(buttonX + buttonRadius, buttonY);
    ctx.lineTo(buttonX + buttonWidth - buttonRadius, buttonY);
    ctx.arc(buttonX + buttonWidth - buttonRadius, buttonY + buttonRadius, buttonRadius, Math.PI * 1.5, 0);
    ctx.lineTo(buttonX + buttonWidth, buttonY + buttonHeight - buttonRadius);
    ctx.arc(buttonX + buttonWidth - buttonRadius, buttonY + buttonHeight - buttonRadius, buttonRadius, 0, Math.PI * 0.5);
    ctx.lineTo(buttonX + buttonRadius, buttonY + buttonHeight);
    ctx.arc(buttonX + buttonRadius, buttonY + buttonHeight - buttonRadius, buttonRadius, Math.PI * 0.5, Math.PI);
    ctx.lineTo(buttonX, buttonY + buttonRadius);
    ctx.arc(buttonX + buttonRadius, buttonY + buttonRadius, buttonRadius, Math.PI, Math.PI * 1.5);
    ctx.closePath();
    ctx.fill();
    
    ctx.fillStyle = 'white';
    ctx.font = 'bold 22px Fredoka, Arial';
    ctx.fillText('ACCEPT CHALLENGE', 300, 370);
    
    // Set the image in state for display
    const dataUrl = canvas.toDataURL('image/png');
    setChallengeImage(dataUrl);
  };

  const handleStartChallenge = async () => {
    if (!username) {
      alert('Please enter your username to accept the challenge.');
      return;
    }
    
    setIsLoading(true);
    
    try {
      // First attempt to register/login the user
      console.log(`Attempting to login user: ${username}`);
      
      try {
        await axios.post(`${API_BASE}/api/users/login`, { username });
        console.log('User registered/logged in successfully');
      } catch (loginError) {
        console.error('Login error:', loginError);
        console.log('Trying fallback to /register endpoint...');
        
        // Try alternative endpoint if login fails
        try {
          await axios.post(`${API_BASE}/api/users/register`, { username });
          console.log('User registered successfully through fallback');
        } catch (registerError) {
          console.error('Register fallback error:', registerError);
          // Proceed anyway - we'll still set the username locally
          console.log('Proceeding without server registration');
        }
      }
      
      // Store the username as challenge_username regardless of API success
      localStorage.setItem('challenge_username', username);
      console.log(`Set challenge_username in localStorage: ${username}`);
      
      // Proceed to game
      console.log(`Navigating to game with URL parameters: challenger=${challenger}, score=${challengerScore}, friend=${expectedFriend}`);
      navigate(`/game?challenger=${challenger}&challengerScore=${challengerScore}&expectedFriend=${expectedFriend}`);
      
    } catch (error) {
      console.error('Error in challenge acceptance flow:', error);
      alert('There was an error accepting the challenge, but we\'ll try to continue.');
      
      // Even if there's an error, try to proceed anyway
      localStorage.setItem('challenge_username', username);
      navigate(`/game?challenger=${challenger}&challengerScore=${challengerScore}&expectedFriend=${expectedFriend}`);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="challenge-container">
      <div className="challenge-card">
        <div className="decorative-element element1"></div>
        <div className="decorative-element element2"></div>
        <div className="decorative-element element3"></div>
        
        <h1 className="challenge-title">You've Been Challenged!</h1>
        <p className="challenge-subtitle">Get ready to prove your geography skills</p>
        
        {/* Display the canvas-generated image */}
        <div className="challenge-image-container">
          <canvas ref={canvasRef} style={{ display: 'none' }} />
          {challengeImage && (
            <img 
              src={challengeImage} 
              alt="Challenge" 
              className="challenge-image"
            />
          )}
        </div>
        
        <div className="challenge-form">
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder="Enter your username"
            className="challenge-input"
            disabled={isLoading}
          />
          <button 
            onClick={handleStartChallenge}
            className="challenge-button"
            disabled={isLoading}
          >
            {isLoading ? 'Loading...' : 'Accept Challenge'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Challenge;