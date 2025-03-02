import React, { useState, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';
import './Challenge.css'; // Reuse the same CSS file

const ChallengeFriend = () => {
  const [friendUsername, setFriendUsername] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [shareUrl, setShareUrl] = useState('');
  const [showShareOptions, setShowShareOptions] = useState(false);
  const shareUrlRef = useRef(null);
  const navigate = useNavigate();
  const location = useLocation();
  const API_BASE = process.env.REACT_APP_API_BASE_URL || 'http://localhost:5001';
  
  // Get username and score from state or localStorage
  const username = localStorage.getItem('username');
  const score = new URLSearchParams(location.search).get('score') || '0';

  const handleSendChallenge = async () => {
    if (!friendUsername) {
      alert('Please enter a username to challenge.');
      return;
    }
    
    setIsLoading(true);
    
    try {
      // Create the challenge URL
      const challengeUrl = `${window.location.origin}/challenge?challenger=${username}&challengerScore=${score}&expectedFriend=${friendUsername}`;
      setShareUrl(challengeUrl);
      setShowShareOptions(true);
      
      // Optionally, you can save this challenge in your database
      try {
        await axios.post(`${API_BASE}/api/challenges/create`, {
          challenger: username,
          challengee: friendUsername,
          challengerScore: score
        });
      } catch (error) {
        console.error('Error saving challenge:', error);
        // Continue anyway since we have the share URL
      }
      
    } catch (error) {
      console.error('Error creating challenge:', error);
      alert('There was an error creating the challenge. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const copyToClipboard = () => {
    if (shareUrlRef.current) {
      shareUrlRef.current.select();
      document.execCommand('copy');
      alert('Challenge link copied to clipboard!');
    }
  };

  const handleReturn = () => {
    navigate('/game');
  };

  return (
    <div className="challenge-container">
      <div className="challenge-card">
        <div className="decorative-element element1"></div>
        <div className="decorative-element element2"></div>
        <div className="decorative-element element3"></div>
        
        <h1 className="challenge-title">Challenge a Friend</h1>
        <p className="challenge-subtitle">Test their geography knowledge</p>
        
        {!showShareOptions ? (
          <>
            <div className="challenge-score">Your Score: {score}</div>
            <p className="challenge-question">Who would you like to challenge?</p>
            <div className="challenge-form">
              <input
                type="text"
                value={friendUsername}
                onChange={(e) => setFriendUsername(e.target.value)}
                placeholder="Friend's username"
                className="challenge-input"
                disabled={isLoading}
              />
              <button 
                onClick={handleSendChallenge}
                className="challenge-button"
                disabled={isLoading}
              >
                {isLoading ? 'Creating...' : 'Send Challenge'}
              </button>
            </div>
          </>
        ) : (
          <>
            <div className="challenge-score">Challenge Created!</div>
            <p className="challenge-question">Share this link with {friendUsername}:</p>
            <div className="challenge-form">
              <input
                type="text"
                ref={shareUrlRef}
                value={shareUrl}
                readOnly
                className="challenge-input"
                onClick={() => copyToClipboard()}
                style={{ cursor: 'pointer' }}
              />
              <div style={{ display: 'flex', gap: '10px', width: '100%', justifyContent: 'center' }}>
                <button 
                  onClick={copyToClipboard}
                  className="challenge-button"
                  style={{ flex: 1 }}
                >
                  Copy Link
                </button>
                <button 
                  onClick={handleReturn}
                  className="challenge-button"
                  style={{ flex: 1, background: 'linear-gradient(to right, #4834d4, #6411AD)' }}
                >
                  Return to Game
                </button>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default ChallengeFriend;