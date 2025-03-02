//frontend/src/components/Game.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Confetti from 'react-confetti';
import { useNavigate, useLocation } from 'react-router-dom';
import './Game.css';


const Game = () => {
  const [destination, setDestination] = useState(null);
  const [options, setOptions] = useState([]);
  const [selectedAnswer, setSelectedAnswer] = useState('');
  const [feedback, setFeedback] = useState('');
  const [score, setScore] = useState({ correct: 0, incorrect: 0 });
  const [questionCount, setQuestionCount] = useState(0);
  const [showConfetti, setShowConfetti] = useState(false);
  const [gameOver, setGameOver] = useState(false);
  const [user, setUser] = useState(null);
  const [winner, setWinner] = useState(null);
  const [timer, setTimer] = useState(20); // 15 seconds for each question
  const [timerActive, setTimerActive] = useState(false);
  const [questionVisible, setQuestionVisible] = useState(false);
  const [feedbackVisible, setFeedbackVisible] = useState(false);
  
    const [showLeaderboard, setShowLeaderboard] = useState(false);
    const [leaderboardData, setLeaderboardData] = useState([]);
    const [leaderboardLoading, setLeaderboardLoading] = useState(false);

  
  const navigate = useNavigate();
  const location = useLocation();
  const API_BASE = process.env.REACT_APP_API_BASE_URL || 'http://localhost:5001';
  
  // Determine if a challenge is active by checking for expectedFriend in the query.
  const urlParams = new URLSearchParams(location.search);
  const isChallenge = urlParams.has('expectedFriend');
  const challenger = urlParams.get('challenger');
  const challengerScore = parseInt(urlParams.get('challengerScore'), 10);
  
  // If a challenge is active, use 'challenge_username'; otherwise, use 'username'.
  const activeUsername = isChallenge 
    ? localStorage.getItem('challenge_username') 
    : localStorage.getItem('username');
  
  useEffect(() => {
    console.log('Game component mounted');
    console.log('Active username:', activeUsername);
    console.log('Is challenge mode:', isChallenge);
    console.log('Challenger score:', challengerScore);
    
    if (!activeUsername) {
      console.log('No username found, redirecting to landing');
      navigate('/');
    } else {
      console.log('Fetching user data for:', activeUsername);
      axios.get(`${API_BASE}/api/users/${activeUsername}`)
        .then(res => {
          console.log('User data received:', res.data);
          setUser(res.data);
          fetchRandomDestination();
        })
        .catch(err => {
          console.error('Error fetching user data:', err);
          // If we can't get user data, we should still let them play
          fetchRandomDestination();
        });
    }
  }, [activeUsername, navigate, API_BASE, isChallenge, challengerScore]);
  
  // Timer effect
  useEffect(() => {
    if (timerActive && timer > 0) {
      const timerInterval = setInterval(() => {
        setTimer(prevTime => prevTime - 1);
      }, 1000);
      
      return () => clearInterval(timerInterval);
    } else if (timerActive && timer === 0) {
      // Time's up - handle as incorrect answer
      handleTimerExpired();
    }
  }, [timerActive, timer]);
  
  // Add this function to handle timer expiration
  const handleTimerExpired = () => {
    setFeedback(`Time's up! The correct answer was ${destination.city}. ${destination.fun_fact[1] || destination.fun_fact[0]}`);
    setFeedbackVisible(true);
    setScore(prev => ({ ...prev, incorrect: prev.incorrect + 1 }));
    const newCount = questionCount + 1;
    setQuestionCount(newCount);
    setTimerActive(false);
    
    if (newCount >= 10) {
      // Update user score and end game
      axios.put(`${API_BASE}/api/users/${activeUsername}/score`, { score: score.correct })
        .then(res => {
          setUser(res.data);
          setGameOver(true);
          
          if (isChallenge) {
            // Challenge winner logic
            if (score.correct > challengerScore) {
              setWinner(activeUsername);
              setShowConfetti(true);
            } else if (score.correct < challengerScore) {
              setWinner(challenger);
            } else {
              setWinner('Tie');
            }
          }
        })
        .catch(err => {
          console.error('Error updating score:', err);
          setGameOver(true);
          // Handle challenge winner logic on error
          if (isChallenge) {
            if (score.correct > challengerScore) {
              setWinner(activeUsername);
              setShowConfetti(true);
            } else if (score.correct < challengerScore) {
              setWinner(challenger);
            } else {
              setWinner('Tie');
            }
          }
        });
    } else {
      // Move to next question after a delay
      setTimeout(() => {
        fetchRandomDestination();
      }, 2000);
    }
  };
  
  const fetchRandomDestination = async () => {
    try {
      // First hide the current question with animation
      setQuestionVisible(false);
      setFeedbackVisible(false);
      
      // Wait for animation to complete
      setTimeout(async () => {
        const res = await axios.get(`${API_BASE}/api/destinations/random`);
        setDestination(res.data);
        setFeedback('');
        setSelectedAnswer('');
        setShowConfetti(false);
        fetchOptions(res.data.city);
        
        // Reset and start the timer
        setTimer(20);
        setTimerActive(true);
        
        // Show the new question with animation
        setQuestionVisible(true);
      }, 300);
    } catch (error) {
      console.error('Error fetching destination:', error);
    }
  };
  
  const fetchOptions = async (excludeCity) => {
    try {
      const res = await axios.get(`${API_BASE}/api/destinations/options`, {
        params: { exclude: excludeCity }
      });
      const combined = [excludeCity, ...res.data];
      const shuffled = combined.sort(() => Math.random() - 0.5);
      setOptions(shuffled);
    } catch (error) {
      console.error('Error fetching options:', error);
    }
  };
  
  const handleSubmit = () => {
    if (!selectedAnswer) return;
    
    // Stop the timer
    setTimerActive(false);
    
    let isCorrect = selectedAnswer === destination.city;
    if (isCorrect) {
      setFeedback('Correct! ' + destination.fun_fact[0]);
      setScore(prev => ({ ...prev, correct: prev.correct + 1 }));
      setShowConfetti(true);
    } else {
        // Add red blink animation for incorrect answer
        const gameContentElement = document.querySelector('.game-content');
        gameContentElement.classList.add('incorrect-answer');
        
        // Remove the class after animation completes
        setTimeout(() => {
          gameContentElement.classList.remove('incorrect-answer');
        }, 600);
        
        setFeedback('Incorrect! ' + (destination.fun_fact[1] || destination.fun_fact[0]));
        setScore(prev => ({ ...prev, incorrect: prev.incorrect + 1 }));
      }
    
    setFeedbackVisible(true);
    const newCount = questionCount + 1;
    setQuestionCount(newCount);
    if (newCount >= 10) {
      // Update user score when game is over.
      const finalScore = score.correct + (isCorrect ? 1 : 0);
      console.log('Game over, final score:', finalScore);
      
      axios.put(`${API_BASE}/api/users/${activeUsername}/score`, { score: finalScore })
        .then(res => {
          console.log('Score updated:', res.data);
          setUser(res.data);
          setGameOver(true);
          
          if (isChallenge) {
            console.log('Determining winner...');
            console.log('Player score:', finalScore);
            console.log('Challenger score:', challengerScore);
            
            if (finalScore > challengerScore) {
              setWinner(activeUsername);
              setShowConfetti(true);
              console.log('Winner:', activeUsername);
            } else if (finalScore < challengerScore) {
              setWinner(challenger);
              console.log('Winner:', challenger);
            } else {
              setWinner('Tie');
              console.log('Game resulted in a tie');
            }
          }
        })
        .catch(err => {
          console.error('Error updating score:', err);
          setGameOver(true);
          
          // Still determine winner even if score update fails
          if (isChallenge) {
            const finalScore = score.correct + (isCorrect ? 1 : 0);
            if (finalScore > challengerScore) {
              setWinner(activeUsername);
              setShowConfetti(true);
            } else if (finalScore < challengerScore) {
              setWinner(challenger);
            } else {
              setWinner('Tie');
            }
          }
        });
    } else {
      setTimeout(() => {
        fetchRandomDestination();
      }, 1500);
    }
  };
  
  const handlePlayAgain = () => {
    // For a new game, we use the same active session.
    setScore({ correct: 0, incorrect: 0 });
    setQuestionCount(0);
    setGameOver(false);
    fetchRandomDestination();
  };
  
  // Function to clear sessions and go back to landing
  const handlePlayNewGame = () => {
    console.log('Clearing sessions and returning to landing');
    // Clear all relevant localStorage items
    localStorage.removeItem('username');
    localStorage.removeItem('challenge_username');
    // Navigate to landing page
    navigate('/');
  };
  
  const handleChallengeFriend = () => {
    navigate(`/challenge-friend?score=${score.correct}`);
  };

 

const handleFetchLeaderboard = async () => {
    // Toggle visibility if already loaded
    if (leaderboardData.length > 0) {
      setShowLeaderboard(!showLeaderboard);
      return;
    }
    
    setLeaderboardLoading(true);
    setShowLeaderboard(true);
    
    try {
      // Try to get all users and sort them client-side instead
      console.log('Fetching all users from:', `${API_BASE}/api/users/all-users`);
      const response = await axios.get(`${API_BASE}/api/users/all-users`);
      
      
      if (Array.isArray(response.data) && response.data.length > 0) {
        // Sort users by highScore in descending order and take only top 10
        const sortedUsers = [...response.data]
          .sort((a, b) => b.highScore - a.highScore)
          .slice(0, 10); // This line limits to top 10
        
        setLeaderboardData(sortedUsers);
      } else {
        console.log('No users found or empty response');
        
        // Fallback to show at least the current user
        if (user) {
          setLeaderboardData([{
            username: user.username,
            highScore: user.highScore
          }]);
        }
      }
    } catch (error) {
      console.error('Error fetching users:', error);
      
      // Try a different approach - get the current user and create mock data
      try {
        // Add the current user to mock data
        const mockData = [
          { username: "explorer123", highScore: 10 },
          { username: "traveler456", highScore: 8 },
          { username: "adventurer789", highScore: 7 },
          { username: "wanderlust22", highScore: 6 }
        ];
        
        if (user) {
          // Add current user
          const userExists = mockData.some(player => player.username === user.username);
          if (!userExists) {
            mockData.push({
              username: user.username,
              highScore: user.highScore
            });
          }
        }
        
        // Sort the mock data
        mockData.sort((a, b) => b.highScore - a.highScore);
        setLeaderboardData(mockData);
        
      } catch (fallbackError) {
        console.error('Fallback also failed:', fallbackError);
        
        // Last resort - just show the current user
        if (user) {
          setLeaderboardData([{
            username: user.username,
            highScore: user.highScore
          }]);
        } else {
          setLeaderboardData([]);
        }
      }
    } finally {
      setLeaderboardLoading(false);
    }
  };

  // Add CSS for the timer
  const getTimerColor = () => {
    if (timer > 10) return '#4CAF50'; // Green
    if (timer > 5) return '#FF9800'; // Orange
    return '#F44336'; // Red
  };
  
  const getTimerClass = () => {
    return timer <= 5 ? 'timer-warning' : '';
  };
  
  
// For the loading state:
if (!destination) return (
    <div className="game-container">
      <div className="game-content loading-container">
        <div className="globe-loader"></div>
        <h2 className="loading-text">Preparing Your Adventure</h2>
        <p className="loading-subtext">Getting your next destination ready!</p>
      </div>
    </div>
  );
  
  // For the game over state:
  if (gameOver) {
    return (
      <div className="game-container">
        <div className="game-content">
          <div className="game-over-container">
            <h1 className="game-over-title">Game Over!</h1>
            <p className="final-score">Your final score: {score.correct} / 10</p>
            {user && <p className="high-score">Your High Score: {user.highScore}</p>}
            
            {isChallenge && (
              <div className="challenge-result">
                <p className="challenge-score">{challenger}'s score: {challengerScore}</p>
                <p className="winner-announcement">
                  {winner === 'Tie' ? 'It\'s a tie!' : `Winner: ${winner}`}
                </p>
                {winner === activeUsername && <Confetti />}
                {winner !== activeUsername && winner !== 'Tie' && (
                  <div className="loser-message">
                    <p>😢 Better luck next time!</p>
                    <p>Keep practicing and you'll get there!</p>
                  </div>
                )}
                <button 
                  onClick={handlePlayNewGame} 
                  className="game-button button-primary"
                >
                  Play Game
                </button>
              </div>
            )}
            
            {!isChallenge && (
              <>
                <button 
                  onClick={handlePlayAgain}
                  className="game-button button-primary"
                >
                  Play New Game
                </button>
                <button 
                  onClick={handleChallengeFriend}
                  className="game-button button-secondary"
                >
                  Challenge a Friend
                </button>
                
                <button 
                  onClick={handleFetchLeaderboard}
                  className="game-button button-accent"
                >
                  {showLeaderboard ? 'Hide Leaderboard' : 'Show Leaderboard'}
                </button>
              </>
            )}
            
            {showLeaderboard && (
              <div className="leaderboard">
                <h2 className="leaderboard-title">Global Leaderboard</h2>
                {leaderboardLoading ? (
                  <div className="loading-container">
                    <div className="globe-loader"></div>
                    <p>Loading leaderboard data...</p>
                  </div>
                ) : (
                  <>
                    <div className="leaderboard-header">
                      <div className="leaderboard-rank">Rank</div>
                      <div className="leaderboard-player">Player</div>
                      <div className="leaderboard-score">Score</div>
                    </div>
                    
                    {leaderboardData.length === 0 ? (
                      <div style={{ textAlign: 'center', padding: '20px' }}>
                        No scores yet. Be the first to play!
                      </div>
                    ) : (
                      leaderboardData.map((player, index) => (
                        <div 
                          key={player._id || index} 
                          className={`leaderboard-row ${index === 0 ? 'gold' : ''} 
                                     ${index === 1 ? 'silver' : ''} 
                                     ${index === 2 ? 'bronze' : ''} 
                                     ${player.username === activeUsername ? 'current-user' : ''}`}
                        >
                          <div className="leaderboard-rank">#{index + 1}</div>
                          <div className="leaderboard-player">{player.username}</div>
                          <div className="leaderboard-score">{player.highScore}</div>
                        </div>
                      ))
                    )}
                  </>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }
  
  // For the active game state:
  return (
    <div className="game-container">
      <div className="game-content">
        {user && (
          <div className="user-welcome">
            <h2 className="user-name">Welcome, {activeUsername}!</h2>
            <p className="user-score">Your High Score: {user.highScore}</p>
            {isChallenge && <p className="challenger-info">Trying to beat: {challenger}'s score of {challengerScore}</p>}
          </div>
        )}
        
        <div className="timer-container">
          <div 
            className={`timer-circle ${
              timer > 10 ? 'green' : timer > 5 ? 'orange' : 'red'
            } ${timer <= 5 ? 'timer-warning' : ''}`}
          >
            {timer}
          </div>
        </div>
        
        <div className="progress-container">
          <div className="progress-bar" style={{ width: `${(questionCount) * 10}%` }}></div>
        </div>
        
        <p>Question: {questionCount + 1} / 10</p>
        {showConfetti && <Confetti />}
        
        <div className={`question-container ${questionVisible ? 'visible' : 'hidden'}`}>
          <h1 className="game-title">Globetrotter Challenge</h1>
          <h3 className="country-name">Clues for a destination in {destination.country}:</h3>
          {destination.clues.map((clue, index) => (
            <p key={index} className="clue-text">{clue}</p>
          ))}
          <div className="options-container">
            {options.map((option, index) => (
              <button 
                key={index} 
                onClick={() => setSelectedAnswer(option)} 
                className={`option-button ${selectedAnswer === option ? 'selected' : ''}`}
              >
                {option}
              </button>
            ))}
          </div>
          <button 
            onClick={handleSubmit}
            className="submit-button"
            disabled={!selectedAnswer}
          >
            Submit Answer
          </button>
        </div>
        
        <div className={`feedback-text ${feedbackVisible ? 'visible' : 'hidden'}`}>
          {feedback}
        </div>
        
        <p>Score: Correct: {score.correct} | Incorrect: {score.incorrect}</p>
        {!isChallenge && (
          <button 
            onClick={handleChallengeFriend}
            className="game-button button-secondary"
          >
            Challenge a Friend
          </button>
        )}
      </div>
    </div>
  );
};
  
  export default Game;