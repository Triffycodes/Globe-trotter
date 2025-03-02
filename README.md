# Globetrotter - Interactive Geography Quiz Game
### Project Link: (https://globe-trotter-seven.vercel.app/)
## 📝 Project Overview

Globetrotter is an interactive web-based geography quiz game that challenges players to identify cities around the world based on clues. Players can test their knowledge, compete with friends, and climb the global leaderboard.

## ✨ Key Features

- **Interactive Quiz Interface**: Answer geography questions through an engaging game interface
- **Real-time Feedback**: Get immediate feedback on your answers
- **Challenge System**: Challenge friends to beat your score
- **Global Leaderboard**: Compare your performance with players worldwide
- **Responsive Design**: Play seamlessly across desktop and mobile devices
- **User Authentication**: Track your progress and high scores over time

## 🛠️ Technologies Used

### Frontend
- React.js
- React Router for navigation
- CSS3 with custom animations
- Canvas API for challenge images
- Confetti effects for correct answers
- Responsive design principles

### Backend
- Node.js
- Express.js
- MongoDB for data storage
- RESTful API architecture

## 🏛️ Architecture

Globetrotter follows a modern client-server architecture:

- **Frontend**: Single Page Application built with React
- **Backend**: RESTful API built with Express.js
- **Database**: MongoDB for storing user data, questions, and leaderboards
- **Authentication**: JWT-based secure authentication
- **Deployment**: Separated frontend (https://globe-trotter.adarshshankar.in/) and backend deployment in vercel

## 🚀 Installation and Setup

### Prerequisites
- Node.js (v14+)
- npm or yarn
- MongoDB (local or Atlas)

### Backend Setup
1. Clone the repository
   ```bash
   git clone https://github.com/Triffycodes/globetrotter-app.git
   ```
2. Install dependencies
    ```bash
    npm install
    ```
3. Create a .env file with the following variables
  MONGO_URI=your_mongodb_connection_string
  PORT=5001
4. Start the backend server
    ```bash
    npm start
    ```
5. Frontend Setup
   npm install

6. Create a .env file with the following variables
   REACT_APP_API_BASE_URL=http://localhost:5001
   
7. Start the development server 
   ```bash
    npm start
   ```
8. Open your browser and navigate to http://localhost:3000


Frontend and Backend Deployment (Vercel)

## 🎮 How to Play:
  1. Start: Enter your username on the landing page and click "Start Adventure"
  2. Quiz: You'll be presented with clues about a city in a specific country
  3. Answer: Select the correct city from the multiple-choice options
  4. Score: Earn points for correct answers
  5. Challenge: After completing a game, challenge a friend to beat your score
  6. Leaderboard: Check how you rank against other players globally


## API Endpoints:
### User Endpoints
    POST /api/users/register - Register a new user
    POST /api/users/login - Login existing user

### Game Endpoints
    GET /api/destinations/random - Get a random destination
    GET /api/destinations/options - Get multiple choice options
    GET /api/leaderboard - Get global leaderboard
    POST /api/scores - Submit a new score

### Challenge Endpoints
    POST /api/challenges/create - Create a new challenge
    GET /api/challenges/:id - Get challenge details


## 🔮 Future Enhancements
  1. Additional Question Types: Include map-based questions and image recognition
  2. Achievement System: Unlock badges and achievements for completing challenges
  3. Difficulty Levels: Add varying difficulty settings
  4. Social Sharing: Share your achievements on social media
  5. Localization: Support for multiple languages

## 👥 Contributors
  Adarsh Shankar (www.adarshshankar.in)

  

